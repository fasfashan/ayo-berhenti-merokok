import { useState } from 'react'

const STATES = [
  { id: 'skipped', label: 'Skip ✓' },
  { id: 'did_it', label: 'Did it' },
  { id: 'na', label: 'N/A' },
]

const ACTIVE_COLORS = {
  skipped: 'bg-[#16a34a]',
  did_it:  'bg-[#dc2626]',
  na:      'bg-[#6b7280]',
}

function btnCls(btnId, currentState, locked) {
  const base = 'flex-1 py-2.5 text-xs font-medium rounded-lg border select-none'
  if (!locked) return `${base} bg-white text-gray-500 border-gray-200 transition-colors`
  if (btnId === currentState) return `${base} ${ACTIVE_COLORS[btnId]} text-white border-transparent cursor-default`
  return `${base} bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed`
}

export default function SessionItem({ session, log, isTargeted, onUpdateState, onUpdateNote }) {
  const [noteOpen, setNoteOpen] = useState(false)
  const { state, note } = log
  const locked = state !== null && state !== undefined

  return (
    <div className={`rounded-xl border p-3.5 ${isTargeted ? 'border-gray-200 bg-white border-l-[3px] border-l-[#2563eb]' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start gap-2 mb-3">
        <span className={`mt-0.5 w-5 h-5 rounded-full text-[10px] font-semibold flex items-center justify-center shrink-0 ${
          isTargeted ? 'bg-[#2563eb] text-white' : 'bg-gray-100 text-gray-500'
        }`}>
          {session.id}
        </span>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span className="font-semibold text-gray-700">{session.period}</span>
            {session.conditional && (
              <span className="text-[10px] text-gray-400  border border-gray-200 rounded px-1 leading-4">kondisional</span>
            )}
            {isTargeted && (
              <span className="text-[10px] text-[#2563eb] border border-blue-200 rounded px-1 leading-4 bg-blue-50">target</span>
            )}
          </div>
          <p className="text-sm text-gray-500 leading-snug text-sm">{session.desc}</p>
          {session.time && <p className="text-xs text-gray-400 mt-0.5">{session.time}</p>}
        </div>
      </div>

      <div className="flex gap-1.5">
        {STATES.map(s => (
          <button
            key={s.id}
            onClick={locked ? undefined : () => onUpdateState(s.id)}
            disabled={locked && s.id !== state}
            className={btnCls(s.id, state, locked)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-2">
        {noteOpen ? (
          <textarea
            autoFocus
            value={note || ''}
            onChange={e => onUpdateNote(e.target.value)}
            onBlur={() => setNoteOpen(false)}
            placeholder="Seberapa kuat craving-nya? Situasi apa?"
            rows={2}
            className="w-full text-xs text-gray-700 bg-white border border-gray-200 rounded-lg px-2.5 py-2 resize-none focus:outline-none focus:border-gray-400"
          />
        ) : note ? (
          <button
            onClick={() => setNoteOpen(true)}
            className="text-xs text-gray-500 text-left w-full italic leading-relaxed"
          >
            {note}
          </button>
        ) : (
          <button
            onClick={() => setNoteOpen(true)}
            className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
          >
            + catatan
          </button>
        )}
      </div>
    </div>
  )
}
