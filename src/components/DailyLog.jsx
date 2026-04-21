import { SESSIONS } from '../data'
import SessionItem from './SessionItem'

export default function DailyLog({ dateStr, dayLog, phase, onUpdateSession, onUpdateNote }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Sesi Hari Ini</p>
      <div className="flex flex-col gap-2">
        {SESSIONS.map(session => (
          <SessionItem
            key={session.id}
            session={session}
            log={dayLog[session.id] || { state: null, note: '' }}
            isTargeted={phase.targetIds.includes(session.id)}
            onUpdateState={state => onUpdateSession(dateStr, session.id, state)}
            onUpdateNote={note => onUpdateNote(dateStr, session.id, note)}
          />
        ))}
      </div>
    </div>
  )
}
