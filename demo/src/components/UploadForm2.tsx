import { useRef, useState, useEffect, type ChangeEvent, type FormEvent, type FC } from 'react'

interface UploadFormProps {
  onUpload: (files: File[], date?: string) => void
}

const UploadForm: FC<UploadFormProps> = ({ onUpload }) => {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    // generate previews
    const urls = selectedFiles.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [selectedFiles])

  const handleFiles = (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith('image/'))
    if (imgs.length) setSelectedFiles((prev) => [...prev, ...imgs])
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (selectedFiles.length) {
      onUpload(selectedFiles, selectedDate || undefined)
      // reset
      setSelectedFiles([])
      setPreviews([])
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removePreview = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
      <div className="upload-area border-2 border-dashed rounded-lg p-6 text-center">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border rounded"
          />

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="upload-input"
            />
            <label htmlFor="upload-input" className="px-4 py-2 bg-pink-500 text-white rounded cursor-pointer">
              Select Images
            </label>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
              Upload
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-3">Drag and drop support is available via the Upload area component.</p>
      </div>

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {previews.map((src, i) => (
            <div key={src} className="relative">
              <img src={src} alt={`preview-${i}`} className="w-full h-28 object-cover rounded timeline-image" />
              <button
                type="button"
                onClick={() => removePreview(i)}
                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-sm"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </form>
  )
}

export default UploadForm
