import { useState, useEffect, useCallback } from 'react'
import { getCurrentPhaseIndex, PHASES, todayStr, formatDate } from './data'
import PhaseCard from './components/PhaseCard'
import DailyLog from './components/DailyLog'
import Stats from './components/Stats'
import './App.css'


const LS_LOGS = 'vt_logs_v1'
const LS_START = 'vt_start_v1'

export default function App() {
  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_LOGS)) || {} }
    catch { return {} }
  })
  const [startDate, setStartDate] = useState(() => {
    const stored = localStorage.getItem(LS_START)
    if (stored) return stored
    const d = todayStr()
    localStorage.setItem(LS_START, d)
    return d
  })
  const [tab, setTab] = useState('today')

  const today = todayStr()

  useEffect(() => {
    localStorage.setItem(LS_LOGS, JSON.stringify(logs))
  }, [logs])

  const phaseIndex = getCurrentPhaseIndex(startDate)
  const phase = PHASES[phaseIndex]

  const updateSession = useCallback((dateStr, sessionId, state) => {
    setLogs(prev => ({
      ...prev,
      [dateStr]: {
        ...(prev[dateStr] || {}),
        [sessionId]: {
          ...(prev[dateStr]?.[sessionId] || { note: '' }),
          state,
        },
      },
    }))
  }, [])

  const updateNote = useCallback((dateStr, sessionId, note) => {
    setLogs(prev => ({
      ...prev,
      [dateStr]: {
        ...(prev[dateStr] || {}),
        [sessionId]: {
          ...(prev[dateStr]?.[sessionId] || { state: null }),
          note,
        },
      },
    }))
  }, [])

  const handleReset = useCallback(() => {
    const confirmed = window.confirm(
      'Reset akan menghapus semua data dan memulai ulang program. Lanjutkan?'
    )
    if (!confirmed) return
    const newStart = todayStr()
    localStorage.removeItem(LS_LOGS)
    localStorage.setItem(LS_START, newStart)
    setLogs({})
    setStartDate(newStart)
  }, [])

  return (
    <div className="min-h-screen bg-neutral-100" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-4">

        <header className="px-4  bg-white pt-5 pb-4 border-b border-gray-200 rounded-xl mb-8 ">
          <div className="flex items-baseline justify-between">
            <h1 className="text-base font-semibold text-gray-900 tracking-tight">Pod Tracker</h1>
            <span className="text-xs text-gray-400">Fase {phaseIndex + 1} / 5</span>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(today)}</p>
        </header>

        <main className="flex-1 pb-14 overflow-auto">
          {tab === 'today' ? (
            <div className=" flex flex-col gap-4">
              <PhaseCard
                phase={phase}
                startDate={startDate}
              />
              <DailyLog
                dateStr={today}
                dayLog={logs[today] || {}}
                phase={phase}
                phaseIndex={phaseIndex}
                onUpdateSession={updateSession}
                onUpdateNote={updateNote}
              />
            </div>
          ) : (
            <div className="px-4 py-4">
              <Stats
                logs={logs}
                phase={phase}
                phaseIndex={phaseIndex}
                today={today}
                startDate={startDate}
                onReset={handleReset}
              />
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto shadow-2xl bg-white border border-gray-200   border-gray-100">
          <div className="flex max-w-md mx-auto">
            {[['today', 'Hari Ini'], ['stats', 'Statistik']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                  tab === id ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

      </div>
    </div>
  )
}
