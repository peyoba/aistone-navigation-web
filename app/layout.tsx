import { Inter } from 'next/font/google'
import '../app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Stone Games - 游戏导航网站',
  description: '通过iframe方式嵌入各种网页游戏，为用户提供便捷的游戏发现和体验平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  )
} 