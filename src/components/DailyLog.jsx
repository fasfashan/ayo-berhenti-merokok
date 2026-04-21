import { useMemo } from 'react'
import { SESSIONS } from '../data'
import SessionItem from './SessionItem'

export default function DailyLog({ dateStr, dayLog, phase, phaseIndex, onUpdateSession, onUpdateNote }) {
  const isBaseline = phaseIndex === 0

  const { logged, skipped } = useMemo(() => {
    let logged = 0, skipped = 0
    SESSIONS.forEach(s => {
      const st = dayLog[s.id]?.state
      if (st) logged++
      if (st === 'skipped') skipped++
    })
    return { logged, skipped }
  }, [dayLog])

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Sesi Hari Ini</p>
        <p className="text-xs text-gray-400">
          {logged}/{SESSIONS.length} diisi
          {skipped > 0 && <span className="text-[#16a34a] font-medium"> · {skipped} diskip</span>}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {SESSIONS.map(session => (
          <SessionItem
            key={session.id}
            session={session}
            log={dayLog[session.id] || { state: null, note: '' }}
            isTargeted={phase.targetIds.includes(session.id)}
            isBaseline={isBaseline}
            onUpdateState={state => onUpdateSession(dateStr, session.id, state)}
            onUpdateNote={note => onUpdateNote(dateStr, session.id, note)}
          />
        ))}
      </div>
    </div>
  )
}
