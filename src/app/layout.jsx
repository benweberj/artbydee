

import "./globals.scss"
import Header from '@/components/Header'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { Raleway } from 'next/font/google'

import ThemeProvider from '@/context/ThemeProvider'
import './globals.scss'

const font = Raleway({ subsets: ['latin'] });


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeProvider>
        <UserProvider>
          <body className={font.className}>
              <Header />
              {children}
          </body>
        </UserProvider>
      </ThemeProvider>
    </html>
  )
}

export const metadata = {
  title: "Art by Dee",
  description: "A collection of Dee Weber's paintings",
}