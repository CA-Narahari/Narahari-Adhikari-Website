import React from 'react'
import { useParams } from 'react-router-dom'

export default function NewsPost() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800">News Post Page — /news/{slug}</h1>
    </div>
  )
}
