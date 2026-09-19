import React from 'react'
import { useParams } from 'react-router-dom'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">Blog Post Page — /blog/{slug}</h1>
    </div>
  )
}
