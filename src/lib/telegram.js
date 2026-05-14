const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID

export async function sendTelegramMessage(chatId, text) {
  if (!BOT_TOKEN) return
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    })
  } catch (error) {
    console.error('Telegram send error:', error)
  }
}

export async function notifyAdminNewOrder(order) {
  const itemsList = (order.items || [])
    .map(item => `  • ${item.name} x${item.quantity} — $${(item.price * item.quantity).toFixed(2)}`)
    .join('\n')

  const message = `
🛒 <b>Yangi buyurtma!</b>

<b>ID:</b> #${order.orderId || order.id}
<b>Mijoz:</b> ${order.fullName || order.customerName || '?'}
<b>Telefon:</b> ${order.phone || '?'}

<b>Mahsulotlar:</b>
${itemsList || '  —'}

<b>Jami:</b> $${(order.totalPrice || order.total || 0).toFixed(2)}
<b>Yetkazish:</b> ${order.delivery || 'standart'}
<b>Manzil:</b> ${order.city || '?'}, ${order.address || '?'}

<b>Holat:</b> ⏳ To'lov kutilmoqda

<i>Admin panelda tasdiqlang: /admin/orders</i>
  `.trim()

  await sendTelegramMessage(ADMIN_CHAT_ID, message)
}

export async function notifyClientOrderConfirmed(order) {
  if (!order.telegramChatId) return
  const message = `
✅ <b>Buyurtmangiz tasdiqlandi!</b>

<b>ID:</b> #${order.orderId || order.id}
<b>Jami:</b> $${(order.totalPrice || order.total || 0).toFixed(2)}

Buyurtmangiz tez orada jo'natiladi.
TENZA SHOP
  `.trim()
  await sendTelegramMessage(order.telegramChatId, message)
}

export async function notifyClientOrderCancelled(order) {
  if (!order.telegramChatId) return
  const message = `
❌ <b>Buyurtma bekor qilindi</b>

<b>ID:</b> #${order.orderId || order.id}
<b>Jami:</b> $${(order.totalPrice || order.total || 0).toFixed(2)}

Agar to'lov qilgan bo'lsangiz, admin bilan bog'laning.
TENZA SHOP
  `.trim()
  await sendTelegramMessage(order.telegramChatId, message)
}
