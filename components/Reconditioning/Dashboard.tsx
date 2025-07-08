"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"

const stages = [
  "Check-In",
  "Inspection",
  "Estimate",
  "In Progress",
  "QC",
  "Complete",
  "Ready for Retail",
]

interface Part {
  id: string
  name: string
  cost: number
  status: string
}

interface Labor {
  id: string
  description: string
  cost: number
}

interface Vehicle {
  id: string
  vin: string
  year: string
  make: string
  model: string
  color: string
  miles: number
  cost: number
  status: string
  parts: Part[]
  labor: Labor[]
  notes: string
}

function VehicleDialog({ vehicle, onSave }: { vehicle: Vehicle; onSave: (v: Vehicle) => void }) {
  const [local, setLocal] = useState(vehicle)
  const addPart = () => {
    setLocal({
      ...local,
      parts: [
        ...local.parts,
        { id: Date.now().toString(), name: "", cost: 0, status: "Ordered" },
      ],
    })
  }
  const addLabor = () => {
    setLocal({
      ...local,
      labor: [
        ...local.labor,
        { id: Date.now().toString(), description: "", cost: 0 },
      ],
    })
  }
  const totalCost =
    local.cost +
    local.parts.reduce((s, p) => s + p.cost, 0) +
    local.labor.reduce((s, l) => s + l.cost, 0)
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/40" />
      <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] w-11/12 max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">{local.vin}</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">Year</span>
            <input
              value={local.year}
              onChange={(e) => setLocal({ ...local, year: e.target.value })}
              className="border rounded p-1"
            />
            <span className="font-medium">Make</span>
            <input
              value={local.make}
              onChange={(e) => setLocal({ ...local, make: e.target.value })}
              className="border rounded p-1"
            />
            <span className="font-medium">Model</span>
            <input
              value={local.model}
              onChange={(e) => setLocal({ ...local, model: e.target.value })}
              className="border rounded p-1"
            />
            <span className="font-medium">Color</span>
            <input
              value={local.color}
              onChange={(e) => setLocal({ ...local, color: e.target.value })}
              className="border rounded p-1"
            />
            <span className="font-medium">Miles</span>
            <input
              type="number"
              value={local.miles}
              onChange={(e) => setLocal({ ...local, miles: +e.target.value })}
              className="border rounded p-1"
            />
            <span className="font-medium">Status</span>
            <select
              value={local.status}
              onChange={(e) => setLocal({ ...local, status: e.target.value })}
              className="border rounded p-1"
            >
              {stages.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Parts</h3>
            {local.parts.map((p, idx) => (
              <div key={p.id} className="grid grid-cols-4 gap-2 items-center">
                <input
                  value={p.name}
                  onChange={(e) => {
                    const parts = [...local.parts]
                    parts[idx].name = e.target.value
                    setLocal({ ...local, parts })
                  }}
                  placeholder="Part"
                  className="border rounded p-1 col-span-2"
                />
                <input
                  type="number"
                  value={p.cost}
                  onChange={(e) => {
                    const parts = [...local.parts]
                    parts[idx].cost = +e.target.value
                    setLocal({ ...local, parts })
                  }}
                  placeholder="Cost"
                  className="border rounded p-1"
                />
                <select
                  value={p.status}
                  onChange={(e) => {
                    const parts = [...local.parts]
                    parts[idx].status = e.target.value
                    setLocal({ ...local, parts })
                  }}
                  className="border rounded p-1"
                >
                  <option>Ordered</option>
                  <option>Received</option>
                  <option>Installed</option>
                </select>
              </div>
            ))}
            <button onClick={addPart} className="mt-1 rounded bg-blue-500 px-3 py-1 text-white">
              Add Part
            </button>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Labor</h3>
            {local.labor.map((l, idx) => (
              <div key={l.id} className="grid grid-cols-3 gap-2 items-center">
                <input
                  value={l.description}
                  onChange={(e) => {
                    const labor = [...local.labor]
                    labor[idx].description = e.target.value
                    setLocal({ ...local, labor })
                  }}
                  placeholder="Description"
                  className="border rounded p-1 col-span-2"
                />
                <input
                  type="number"
                  value={l.cost}
                  onChange={(e) => {
                    const labor = [...local.labor]
                    labor[idx].cost = +e.target.value
                    setLocal({ ...local, labor })
                  }}
                  placeholder="Cost"
                  className="border rounded p-1"
                />
              </div>
            ))}
            <button onClick={addLabor} className="mt-1 rounded bg-blue-500 px-3 py-1 text-white">
              Add Labor
            </button>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Notes</h3>
            <textarea
              value={local.notes}
              onChange={(e) => setLocal({ ...local, notes: e.target.value })}
              className="w-full rounded border p-1"
              rows={3}
            />
          </div>
          <div className="font-semibold">Total Recon Cost: ${totalCost.toFixed(2)}</div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Dialog.Close asChild>
            <button className="rounded border px-4 py-2">Cancel</button>
          </Dialog.Close>
          <button
            onClick={() => onSave(local)}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            Save
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

export default function ReconditioningDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [search, setSearch] = useState("")
  const [vin, setVin] = useState("")
  const [editing, setEditing] = useState<Vehicle | null>(null)

  const filtered = vehicles.filter((v) =>
    v.vin.toLowerCase().includes(search.toLowerCase())
  )

  async function addVehicle() {
    if (!vin) return
    try {
      const res = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValues/${vin}?format=json`
      )
      const data = (await res.json()) as {
        Results?: Array<{
          ModelYear?: string
          Make?: string
          Model?: string
        }>
      }
      const result = data.Results?.[0] ?? {}
      setVehicles([
        ...vehicles,
        {
          id: Date.now().toString(),
          vin,
          year: result.ModelYear || "",
          make: result.Make || "",
          model: result.Model || "",
          color: "",
          miles: 0,
          cost: 0,
          status: "Check-In",
          parts: [],
          labor: [],
          notes: "",
        },
      ])
      setVin("")
    } catch (e) {
      console.error(e)
    }
  }

  function updateVehicle(updated: Vehicle) {
    setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)))
    setEditing(null)
  }

  function advance(v: Vehicle) {
    const idx = stages.indexOf(v.status)
    if (idx >= 0 && idx < stages.length - 1) {
      updateVehicle({ ...v, status: stages[idx + 1] })
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Add VIN</label>
          <div className="flex gap-2">
            <input
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="VIN"
              className="flex-1 rounded border p-2"
            />
            <button onClick={addVehicle} className="rounded bg-blue-500 px-3 py-2 text-white">
              Add
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Search Inventory</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by VIN"
            className="rounded border p-2"
          />
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">VIN</th>
              <th className="px-3 py-2 text-left font-medium">Year</th>
              <th className="px-3 py-2 text-left font-medium">Make</th>
              <th className="px-3 py-2 text-left font-medium">Model</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap">{v.vin}</td>
                <td className="px-3 py-2 whitespace-nowrap">{v.year}</td>
                <td className="px-3 py-2 whitespace-nowrap">{v.make}</td>
                <td className="px-3 py-2 whitespace-nowrap">{v.model}</td>
                <td className="px-3 py-2 whitespace-nowrap">{v.status}</td>
                <td className="px-3 py-2 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => advance(v)}
                    className="rounded bg-green-500 px-2 py-1 text-white"
                  >
                    Advance
                  </button>
                  <Dialog.Root open={editing?.id === v.id} onOpenChange={() => setEditing(v)}>
                    <Dialog.Trigger asChild>
                      <button className="rounded border px-2 py-1">Edit</button>
                    </Dialog.Trigger>
                    {editing?.id === v.id && (
                      <VehicleDialog vehicle={v} onSave={updateVehicle} />
                    )}
                  </Dialog.Root>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
