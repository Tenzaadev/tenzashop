import { NextResponse } from 'next/server'

const PAYME_MERCHANT_ID = process.env.PAYME_MERCHANT_ID
const PAYME_KEY = process.env.PAYME_KEY

export async function POST(request) {
  try {
    const { amount, orderId } = await request.json()

    const checkoutUrl = `https://checkout.paycom.uz/${PAYME_MERCHANT_ID}/${orderId}?amount=${Math.round(amount * 100)}`

    return NextResponse.json({ checkoutUrl })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    const response = await fetch(`https://checkout.paycom.uz/api/check/${PAYME_MERCHANT_ID}/${orderId}`, {
      headers: { 'X-Auth': PAYME_KEY }
    })
    const data = await response.json()

    return NextResponse.json({ paid: data.status === 'paid' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
