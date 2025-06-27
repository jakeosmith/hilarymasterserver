
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vehicle Reconditioning Tool'
}

export default function Home() {
  return (
    <div>
      <h1 className="text-center text-xl font-semibold my-4">Hi Jackson</h1>
      <iframe
        src="/recon-tool/index.html"
        style={{ width: '100%', height: 'calc(100vh - 4rem)', border: 'none' }}
      />
    </div>
  )
}
