import { NextResponse } from 'next/server'
import crypto from 'crypto'

const MERCHANT_LOGIN = process.env.ROBOKASSA_LOGIN || ''
const PASSWORD_1 = process.env.ROBOKASSA_PASSWORD_1 || ''
const PASSWORD_2 = process.env.ROBOKASSA_PASSWORD_2 || ''

function generateSignature(login, amount, invoiceId, password) {
  return crypto.createHash('md5').update(`${login}:${amount}:${invoiceId}:${password}`).digest('hex')
}

function validateCallbackSignature(outSum, invId, password, receivedSig) {
  const expected = crypto.createHash('md5').update(`${outSum}:${invId}:${password}`).digest('hex')
  return expected.toLowerCase() === receivedSig.toLowerCase()
}

export async function POST(request) {
  try {
    if (!MERCHANT_LOGIN || !PASSWORD_1) {
      return NextResponse.json({ error: 'Robokassa not configured' }, { status: 503 })
    }

    const { amount, orderId, description = 'Order payment' } = await request.json()

    const invoiceId = orderId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20)
    const outSum = Number(amount).toFixed(2)
    const signature = generateSignature(MERCHANT_LOGIN, outSum, invoiceId, PASSWORD_1)

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const params = new URLSearchParams({
      MerchantLogin: MERCHANT_LOGIN,
      OutSum: outSum,
      InvoiceID: invoiceId,
      Description: description,
      SignatureValue: signature,
      IsTest: process.env.ROBOKASSA_TEST === '1' ? '1' : '0',
      SuccessUrl: `${baseUrl}/success?order=${orderId}`,
      FailUrl: `${baseUrl}/cart`,
      ResultUrl: `${baseUrl}/api/robokassa-payment`,
    })

    return NextResponse.json({ url: `https://auth.robokassa.ru/Merchant/Index.aspx?${params.toString()}` })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const outSum = searchParams.get('OutSum')
  const invId = searchParams.get('InvId')
  const signature = searchParams.get('SignatureValue')

  if (outSum && invId && signature && validateCallbackSignature(outSum, invId, PASSWORD_2, signature)) {
    return new NextResponse(`OK${invId}`, { status: 200 })
  }

  return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
}
