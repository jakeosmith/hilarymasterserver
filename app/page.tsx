import { Metadata } from 'next'
import Dashboard from '@/components/Reconditioning/Dashboard'

export const metadata: Metadata = {
  title: 'Vehicle Reconditioning Tool',
}

export default function Home() {
  return (
    <div>
      <h1 className="text-center text-xl font-semibold my-4">Hi Jackson</h1>
      <Dashboard />
    </div>
  )
}
