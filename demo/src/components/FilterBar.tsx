import { type FC } from 'react'

interface FilterBarProps {
  view: 'year' | 'month' | 'day'
  setView: (v: 'year' | 'month' | 'day') => void
}

const FilterBar: FC<FilterBarProps> = ({ view, setView }) => {
  return (
    <div className="filter-bar max-w-4xl mx-auto flex items-center justify-between p-3 mb-6">
      <div className="filters flex gap-3">
        <button
          className={`px-3 py-2 rounded-md ${view === 'year' ? 'bg-pink-400 text-white' : 'bg-white/60 text-pink-600'}`}
          onClick={() => setView('year')}
        >
          Yearly
        </button>
        <button
          className={`px-3 py-2 rounded-md ${view === 'month' ? 'bg-pink-400 text-white' : 'bg-white/60 text-pink-600'}`}
          onClick={() => setView('month')}
        >
          Monthly
        </button>
        <button
          className={`px-3 py-2 rounded-md ${view === 'day' ? 'bg-pink-400 text-white' : 'bg-white/60 text-pink-600'}`}
          onClick={() => setView('day')}
        >
          Daily
        </button>
      </div>

      <div className="view-hint text-sm text-pink-500">View: {view}</div>
    </div>
  )
}

export default FilterBar
