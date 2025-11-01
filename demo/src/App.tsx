import { useState } from 'react'
import './App.css'
import ScrollTimeline from './components/lightswind/scroll-timeline2'
import UploadArea from './components/UploadArea'

function App() {
  const [events, setEvents] = useState([
    { year: "2023", title: "Major Achievement", description: "A big milestone." },
    { year: "2022", title: "Important Milestone", description: "Another milestone." },
    { year: "2021", title: "Key Event", description: "A key event." },
  ]);

  const handleFilesUploaded = (files: File[]) => {
    const newEvents = files.map((file, index) => ({
      year: new Date().getFullYear().toString(),
      title: `Uploaded Image ${index + 1}`,
      description: `Uploaded: ${file.name}`,
      imageUrl: URL.createObjectURL(file),
    }));
    setEvents(prev => [...prev, ...newEvents]);
  };

  return (
    <main className="min-h-screen text-gray-900">
      <UploadArea onFilesUploaded={handleFilesUploaded} />
      <ScrollTimeline events={events} />
    </main>
  )
}

export default App
