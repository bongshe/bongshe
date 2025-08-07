'use client'

import { useEffect, useState } from 'react'
import { generateHTML, JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  content: JSONContent | null // Better typing than 'any'
}

export function RichTextRenderer({ content }: Props) {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    if (content) {
      const output = generateHTML(content, [StarterKit])
      setHtml(output)
    } else {
      setHtml('') // Clear HTML if content is null
    }
  }, [content])

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
