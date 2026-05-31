import { NextResponse } from 'next/server'

const SBER_USERNAME = process.env.SBER_USERNAME
const SBER_PASSWORD = process.env.SBER_PASSWORD

async function getSberToken() {
  const response = await fetch('https://api.sberbank.ru/ru/prod/tokens/v2/oauth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&username=${SBER_USERNAME}&password=${SBER_PASSWORD}`
  })
  const data = await response.json()
  return data.access_token
}

export async function POST(request) {
  try {
    const { amount, orderId, description, method } = await request.json()
    const token = await getSberToken()

    if (method === 'sberbank') {
      const response = await fetch('https://api.sberbank.ru/ru/prod/rbs/acquiring/qr/v1/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderNumber: orderId,
          amount: Math.round(amount * 100),
          currency: 643,
          description: description || 'TENZA SHOP заказ',
          returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?order=${orderId}`
        })
      })
      const data = await response.json()
      return NextResponse.json({ qrCode: data.qrCode, sberOrderId: data.orderId })
    }

    if (method === 'tbank') {
      const response = await fetch('https://api.sberbank.ru/ru/prod/rbs/acquiring/qr/v1/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderNumber: orderId,
          amount: Math.round(amount * 100),
          currency: 643,
          description: description || 'TENZA SHOP заказ',
          returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?order=${orderId}`
        })
      })
      const data = await response.json()
      return NextResponse.json({ qrCode: data.qrCode, sberOrderId: data.orderId })
    }

    return NextResponse.json({ error: 'Invalid method' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const token = await getSberToken()

    const response = await fetch(`https://api.sberbank.ru/ru/prod/rbs/acquiring/qr/v1/status?orderId=${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()

    return NextResponse.json({
      paid: data.orderStatus === 1,
      status: data.orderStatus
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
