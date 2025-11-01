import { useState, type FC } from 'react'
import TimelineLive from './TimelineLive'
import UploadModal from './UploadModal'
import './dashboard.css'

type PhotoEvent = {
  id: string
  date: string
  title?: string
  caption?: string
  imageUrl?: string
}

const Dashboard: FC = () => {
  const [events, setEvents] = useState<PhotoEvent[]>([
    { id: 'e1', date: '2023-10-01', title: 'Major Achievement', caption: 'A big milestone.', imageUrl: '/samples/kyoto.jpg' },
    { id: 'e2', date: '2022-06-15', title: 'Important Milestone', caption: 'Another milestone.', imageUrl: '/samples/graduation.jpg' },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const view: 'year' | 'month' | 'day' = 'year'

  return (
    <div className="dashboard-root timeline-only-root">
      <div className="timeline-only-container">
        <TimelineLive view={view} items={events} />
      </div>

      <button className="upload-fab" aria-label="Add memory" onClick={() => setIsModalOpen(true)}>＋</button>

      <UploadModal
        open={isModalOpen}
        initialFile={null}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(file, date, caption) => {
          const imgUrl = URL.createObjectURL(file)
          const ev: PhotoEvent = { id: String(Date.now()), date: date || new Date().toISOString().slice(0, 10), title: file.name, caption, imageUrl: imgUrl }
          setEvents((s) => [ev, ...s])
        }}
      />
    </div>
  )
}

export default Dashboard
