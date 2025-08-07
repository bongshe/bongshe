'use client'
import { useEffect, useState } from 'react'
import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  content: any // Stored JSON
}

export function RichTextRenderer({ content }: Props) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    if (content) {
      const output = generateHTML(content, [StarterKit])
      setHtml(output)
    }
  }, [content])

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
