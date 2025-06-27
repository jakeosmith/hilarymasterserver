"use client"

import { useState } from "react"

interface Vehicle {
  vin: string
  year: string
  make: string
  model: string
  bucket: string
}

export default function Reconditioning() {
  const [vin, setVin] = useState("")
  const [vehicleInfo, setVehicleInfo] = useState<Vehicle | null>(null)
  const [bucket, setBucket] = useState("in transit")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  const decodeVin = async () => {
    if (!vin) return
    try {
      const res = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValues/${vin}?format=json`
      )
      const data = await res.json()
      const result = data.Results?.[0] || {}
      setVehicleInfo({
        vin,
        year: result.ModelYear || "",
        make: result.Make || "",
        model: result.Model || "",
        bucket,
      })
    } catch (e) {
      console.error(e)
    }
  }

  const addVehicle = () => {
    if (vehicleInfo) {
      setVehicles([...vehicles, { ...vehicleInfo, bucket }])
      setVin("")
      setVehicleInfo(null)
      setBucket("in transit")
    }
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Reconditioning</h1>
      <div className="space-x-2">
        <input
          type="text"
          placeholder="Enter VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          className="border rounded p-2"
        />
        <button
          onClick={decodeVin}
          className="bg-blue-400 text-white rounded px-4 py-2"
        >
          Decode
        </button>
      </div>
      {vehicleInfo && (
        <div className="space-y-2">
          <p>
            {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
          </p>
          <select
            value={bucket}
            onChange={(e) => setBucket(e.target.value)}
            className="border rounded p-2"
          >
            <option value="in transit">In Transit</option>
            <option value="reconditioning">Reconditioning</option>
            <option value="ready for sale">Ready for Sale</option>
          </select>
          <button
            onClick={addVehicle}
            className="bg-green-500 text-white rounded px-4 py-2"
          >
            Add to Bucket
          </button>
        </div>
      )}
      {vehicles.length > 0 && (
        <div className="pt-4">
          <h2 className="text-xl font-semibold">Vehicles</h2>
          <ul className="list-disc pl-4">
            {vehicles.map((v) => (
              <li key={v.vin}>
                {v.vin} - {v.year} {v.make} {v.model} ({v.bucket})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
