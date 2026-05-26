import './globals.css'
import ClientLayout from './ClientLayout'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'TENZA SHOP - Street Fashion',
  description: 'Tenza Shop - Personal Streetwear Brand',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
        <Analytics />
      </body>
    </html>
  )
}