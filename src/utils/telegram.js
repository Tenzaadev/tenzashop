export async function sendTelegramMessage(orderData) {
  try {
    await fetch('/api/notify-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'new_order', order: orderData }),
    })
  } catch (error) {
    console.error('Telegram notification error:', error)
  }
}
