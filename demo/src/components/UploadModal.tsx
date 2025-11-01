import { useState, useEffect, type FC } from 'react'

interface UploadModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (file: File, date: string, caption?: string) => void
  initialFile?: File | null
}

const UploadModal: FC<UploadModalProps> = ({ open, onClose, onSubmit, initialFile = null }) => {
  const [file, setFile] = useState<File | null>(initialFile)
  const [date, setDate] = useState<string>('')
  const [caption, setCaption] = useState<string>('')

  // if parent supplies a new initialFile while modal is open, update local state
  useEffect(() => {
    setFile(initialFile ?? null)
  }, [initialFile])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    onSubmit(file, date || new Date().toISOString().slice(0, 10), caption || undefined)
    setFile(null)
    setDate('')
    setCaption('')
    onClose()
  }

  return (
    <div className="modal-overlay fixed inset-0 z-60 flex items-center justify-center">
      <div className="modal-backdrop absolute inset-0 bg-pink-50/90" />
      <div className="modal-box relative bg-white rounded-xl shadow-lg w-full max-w-lg p-6 z-70">
        <div className="modal-header flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-pink-600">Upload Photo</h3>
          <button className="text-pink-400" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-pink-500 mb-1">Select image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div>
            <label className="block text-sm text-pink-500 mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm text-pink-500 mb-1">Caption (optional)</label>
            <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} className="p-2 border rounded w-full" />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 rounded-md" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-pink-400 text-white">Upload</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadModal
