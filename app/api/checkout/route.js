import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    
    if (!body.email || !body.name) {
      return NextResponse.json(
        { error: 'Ism va email kiritish shart' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: true, message: 'Buyurtma qabul qilindi' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Server xatosi' },
      { status: 500 }
    )
  }
}
