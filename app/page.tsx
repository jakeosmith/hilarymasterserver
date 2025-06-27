'use client'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vehicle Reconditioning Tool'
}

export default function Home() {
  return (
    <iframe
      src="/recon-tool/index.html"
      style={{ width: '100%', height: '100vh', border: 'none' }}
    />
  )
}
