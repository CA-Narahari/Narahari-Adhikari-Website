import React from 'react'
import { useParams } from 'react-router-dom'

export default function AdminServiceForm() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">Admin Service Form Page — /admin/services/{id}/edit</h1>
    </div>
  )
}
