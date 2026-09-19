import React from 'react'
import { useParams } from 'react-router-dom'

export default function AdminPostForm() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">
        Admin Post Form Page — {id ? `/admin/posts/${id}/edit` : '/admin/posts/new'}
      </h1>
    </div>
  )
}
