import React, { useRef, useState } from 'react'

interface UploadFormProps {
  onUpload: (files: File[], date?: string) => void
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length) onUpload(files, selectedDate || undefined)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const files = Array.from(fileRef.current?.files || [])
    if (files.length) onUpload(files, selectedDate || undefined)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
      <div className="flex gap-3 items-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input type="file" ref={fileRef} accept="image/*" multiple className="p-2" />
        <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded">
          Upload
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2">Choose a date to attach to the images (defaults to today)</p>
    </form>
  )
}

export default UploadForm
