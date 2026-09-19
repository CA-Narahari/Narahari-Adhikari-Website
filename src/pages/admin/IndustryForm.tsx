import React from 'react'
import { useParams } from 'react-router-dom'

export default function AdminIndustryForm() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">Admin Industry Form Page — /admin/industries/{id}/edit</h1>
    </div>
  )
}
