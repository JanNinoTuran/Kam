import { useState, type FC } from 'react'
import './index.css'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard2'

const RootApp: FC = () => {
  const [showLanding, setShowLanding] = useState(true)

  return (
    <div>
      {showLanding ? (
        <Landing onComplete={() => setShowLanding(false)} />
      ) : (
        <Dashboard />
      )}
    </div>
  )
}

export default RootApp
