import React, { useState } from 'react'
import UploadForm from './UploadForm2'
import UploadArea from './UploadArea'
import ScrollTimeline from './lightswind/scroll-timeline2'

export interface EventItem {
  id?: string
  year: string
  title: string
  description: string
  imageUrl?: string
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([
    { year: '2023', title: 'Major Achievement', description: 'A big milestone.' },
    { year: '2022', title: 'Important Milestone', description: 'Another milestone.' },
  ])

  const handleFilesUploaded = (files: File[], date?: string) => {
    const dateText = date || new Date().toISOString().slice(0, 10)
    const newEvents = files.map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      year: dateText,
      title: `Uploaded ${file.name}`,
      description: `Uploaded file: ${file.name}`,
      imageUrl: URL.createObjectURL(file),
    }))
    setEvents((prev) => [...newEvents, ...prev])
  }

  return (
    <div className="dashboard-root">
      <div className="container mx-auto py-8">
        <div className="dashboard-hero">
          <div>
            <h2>Your Timeline</h2>
            <p>Upload photos and memories — they appear by the date you choose.</p>
          </div>
          <div>
            <button className="btn btn-primary">New memory</button>
          </div>
        </div>

        <UploadArea onFilesUploaded={(files) => handleFilesUploaded(files)} />

        <div className="mt-6">
          <UploadForm onUpload={(files: File[], date?: string) => handleFilesUploaded(files, date)} />
        </div>

        <div className="mt-8">
          <ScrollTimeline events={events} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
