'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface TiptapEditorProps {
  content: string
  onChange: (value: string) => void
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
        immediatelyRender: false, 

    content,
    editorProps: {
      attributes: {
        class: 'prose min-h-[150px] p-4 border border-gray-300 rounded-md focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  return <EditorContent editor={editor} />
}
