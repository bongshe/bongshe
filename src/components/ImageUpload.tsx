// src/components/ImageUpload.tsx
'use client'

import { useState, useRef } from 'react'
import { FiUpload, FiX, FiLoader } from 'react-icons/fi'

interface Props {
  imageUrl: string
  onChange: (url: string) => void
  type?: 'featured' | 'gallery'
}

export default function ImageUpload({ 
  imageUrl, 
  onChange,
  type = 'featured'
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset error
    setError('')

    // Basic validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSizeMB = 5
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, or WebP.')
      return
    }

    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      return
    }

    // Create temporary preview
    const tempUrl = URL.createObjectURL(file)
    onChange(tempUrl)

    try {
      setIsUploading(true)
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      // Update with permanent Cloudinary URL
      onChange(data.secure_url)
    } catch (err) {
      console.error('Upload failed:', err)
      setError(err.message || 'Failed to upload image')
      onChange('') // Remove temp URL
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    onChange('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="w-full">
      <input 
        type="file" 
        ref={fileRef} 
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
      
      {imageUrl ? (
        <div className="relative group">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-gray-300">
            <img
              src={imageUrl}
              alt="Preview"
              className={`w-full h-full object-contain ${
                isUploading ? 'opacity-50' : ''
              }`}
            />
            
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <FiLoader className="animate-spin text-white text-2xl" />
              </div>
            )}
            
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <FiX />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${type === 'featured' 
              ? 'aspect-square' 
              : 'aspect-video max-w-[200px]'}
            hover:border-indigo-400 hover:bg-gray-50`}
          onClick={() => fileRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <FiLoader className="animate-spin text-gray-500 text-2xl mb-2" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </div>
            ) : (
              <>
                <FiUpload className="text-gray-400 text-2xl mb-2" />
                <p className="text-sm text-gray-500">
                  Click to upload {type === 'featured' ? 'feature' : 'gallery'} image
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WebP (max 5MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}