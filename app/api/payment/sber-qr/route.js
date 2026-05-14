import https from 'https'
import fs from 'fs'

const SBER_API = 'https://api.sberbank.ru'
const TOKEN_URL = `${SBER_API}/oidc/token`
const CREATE_URL = `${SBER_API}/qr/order/v3/creation`
const STATUS_URL = `${SBER_API}/qr/order/v3/status`

function httpsRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const opts = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      rejectUnauthorized: false,
    }

    const certPath = process.env.SBER_API_CERT_PATH
    if (certPath && fs.existsSync(certPath)) {
      try {
        opts.cert = fs.readFileSync(certPath, 'utf8')
        opts.key = fs.readFileSync(certPath, 'utf8')
      } catch (e) {
        console.warn('Sber cert not loaded:', e.message)
      }
    }

    const req = https.request(opts, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: JSON.parse(data) })
        } catch {
          resolve({ ok: false, status: res.statusCode, data, error: data })
        }
      })
    })
    req.on('error', reject)
    if (body) req.write(body)
    req.end()
  })
}

async function getToken() {
  const clientId = process.env.SBER_CLIENT_ID
  const clientSecret = process.env.SBER_CLIENT_SECRET
  const memberId = process.env.SBER_MEMBER_ID
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  if (!clientId || !clientSecret) {
    throw new Error('SBER_CLIENT_ID va SBER_CLIENT_SECRET .env.local da sozlanmagan')
  }

  const res = await httpsRequest(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-ibm-client-id': memberId,
    },
  }, 'grant_type=client_credentials&scope=qr_payment')

  if (!res.ok) throw new Error(`Sber token error ${res.status}: ${JSON.stringify(res.data)}`)
  return res.data.access_token
}

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    const body = await req.json()

    if (action === 'create') {
      const { items, totalPrice } = body
      const rate = 90
      const amountRub = Math.round(totalPrice * rate)
      const orderId = 'SBER-' + Date.now().toString(36).toUpperCase()

      const token = await getToken()
      const memberId = process.env.SBER_MEMBER_ID

      const createRes = await httpsRequest(CREATE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-ibm-client-id': memberId,
        },
      }, JSON.stringify({
        rqTtl: '1200',
        rqTm: new Date().toISOString(),
        orderId,
        orderCreateDate: new Date().toISOString(),
        amount: amountRub,
        currency: 'RUB',
        description: `TENZA shop buyurtma #${orderId}`,
        idQr: process.env.SBER_ID_QR,
        tid: process.env.SBER_TID,
      }))

      if (!createRes.ok) throw new Error(`Sber create error ${createRes.status}: ${JSON.stringify(createRes.data)}`)

      const cd = createRes.data

      return Response.json({
        orderId,
        qrUrl: cd.qrUrl || cd.qrImage || null,
        qrCode: cd.qrCode || cd.qrPayload || null,
        amount: amountRub,
        raw: cd,
      })
    }

    if (action === 'status') {
      const { orderId } = body
      const token = await getToken()
      const memberId = process.env.SBER_MEMBER_ID

      const statusRes = await httpsRequest(STATUS_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-ibm-client-id': memberId,
        },
      }, JSON.stringify({ orderId }))

      if (!statusRes.ok) throw new Error(`Sber status error ${statusRes.status}: ${JSON.stringify(statusRes.data)}`)

      const sd = statusRes.data

      return Response.json({
        orderId: sd.orderId,
        status: sd.orderStatus,
        operationDateTime: sd.operationDateTime,
      })
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Sberbank error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
