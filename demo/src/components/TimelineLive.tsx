import { useMemo, type FC } from 'react'
import { motion } from 'framer-motion'
import './timeline.css'

export interface PhotoEvent {
  id?: string
  date: string // ISO yyyy-mm-dd
  title?: string
  caption?: string
  imageUrl?: string
}

interface TimelineLiveProps {
  items: PhotoEvent[]
  view: 'year' | 'month' | 'day'
}

// helpers: group events by key depending on view
const groupEvents = (events: PhotoEvent[], view: string) => {
  const map = new Map<string, PhotoEvent[]>()
  events.forEach((e) => {
    const d = new Date(e.date)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const key = view === 'year' ? `${y}` : view === 'month' ? `${y}-${m}` : `${e.date}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(e)
  })
  // sort keys chronologically
  const keys = Array.from(map.keys()).sort((a, b) => (a < b ? -1 : 1))
  return keys.map((k) => ({ key: k, items: map.get(k)! }))
}

const formatKeyLabel = (key: string, view: string) => {
  if (view === 'year') return key
  if (view === 'month') {
    const [y, m] = key.split('-')
    const dt = new Date(Number(y), Number(m) - 1, 1)
    return dt.toLocaleString(undefined, { month: 'long', year: 'numeric' })
  }
  // day
  const dt = new Date(key)
  return dt.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

const TimelineLive: FC<TimelineLiveProps> = ({ items, view }) => {
  const grouped = useMemo(() => groupEvents(items, view), [items, view])

  return (
    <section className="tl-root">
      <div className="tl-container">
        <div className="tl-line" />

        <div className="tl-groups">
          {grouped.map((g) => (
            <div className="tl-group" key={g.key}>
              <div className="tl-group-label">{formatKeyLabel(g.key, view)}</div>
              <div className="tl-items">
                {g.items.map((it, i) => (
                  <motion.article key={it.id ?? `${g.key}-${i}`} className="tl-item" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div className="tl-content">
                      {it.imageUrl ? (
                        <img src={it.imageUrl} alt={it.caption || it.title || ''} className="tl-photo" />
                      ) : null}

                      <div className="tl-meta">
                        <div className="tl-title">{it.title ?? (it.caption ?? 'Untitled')}</div>
                        {it.caption ? <div className="tl-caption">{it.caption}</div> : null}
                        <div className="tl-date">{it.date}</div>
                      </div>
                    </div>

                    <div className="tl-node" />
                  </motion.article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TimelineLive
