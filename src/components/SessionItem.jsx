import { useState, useEffect } from 'react'

const STATES = [
  { id: 'skipped', label: 'Diskip ✓' },
  { id: 'did_it', label: 'Dihisap' },
  { id: 'na', label: 'N/A' },
]

const ACTIVE_COLORS = {
  skipped: 'bg-[#16a34a]',
  did_it:  'bg-[#dc2626]',
  na:      'bg-[#6b7280]',
}

function btnCls(btnId, currentState, selectionMade, isBaseline) {
  const base = 'flex-1 py-2.5 text-xs font-medium rounded-lg border select-none transition-colors'
  const baselineSkip = isBaseline && btnId === 'skipped'

  if (!selectionMade) {
    return baselineSkip
      ? `${base} bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed`
      : `${base} bg-white text-gray-500 border-gray-200`
  }
  if (btnId === currentState) {
    return `${base} ${ACTIVE_COLORS[btnId]} text-white border-transparent cursor-default`
  }
  return `${base} bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed`
}

const GRACE_SECONDS = 10

export default function SessionItem({ session, log, isTargeted, isBaseline, onUpdateState, onUpdateNote }) {
  const [pendingState, setPendingState] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [noteOpen, setNoteOpen] = useState(false)

  const { state: confirmedState, note } = log
  const inGracePeriod = pendingState !== null
  const currentState = pendingState ?? confirmedState
  const selectionMade = currentState !== null

  useEffect(() => {
    if (pendingState === null) return
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id)
          setPendingState(null)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [pendingState])

  const handleSelect = (stateId) => {
    if (selectionMade) return
    if (isBaseline && stateId === 'skipped') return
    setTimeLeft(GRACE_SECONDS)
    setPendingState(stateId)
    onUpdateState(stateId)
  }

  const handleUndo = () => {
    setPendingState(null)
    onUpdateState(null)
  }

  return (
    <div className={`rounded-xl border p-3.5 ${
      isTargeted ? 'border-gray-200 bg-white border-l-[3px] border-l-[#2563eb]' : 'border-gray-200 bg-white'
    }`}>

      <div className="flex items-start gap-2 mb-3">
        <span className={`mt-0.5 w-5 h-5 rounded-full text-[10px] font-semibold flex items-center justify-center shrink-0 ${
          isTargeted ? 'bg-[#2563eb] text-white' : 'bg-gray-100 text-gray-500'
        }`}>
          {session.id}
        </span>
        <div className="flex-1 min-w-0 ">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span className="text-xs font-semibold text-gray-700">{session.period}</span>
            {session.conditional && (
              <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1 leading-4">kondisional</span>
            )}
            {isTargeted && (
              <span className="text-[10px] text-[#2563eb] border border-blue-200 rounded px-1 leading-4 bg-blue-50">target</span>
            )}
          </div>
          <p className="text-xs text-gray-800 leading-snug">{session.desc}</p>
          {session.time && <p className="text-xs text-gray-400 mt-0.5">{session.time}</p>}
        </div>
      </div>

      <div className="flex gap-1.5">
        {STATES.map(s => (
          <button
            key={s.id}
            onClick={() => handleSelect(s.id)}
            disabled={selectionMade || (isBaseline && s.id === 'skipped')}
            className={btnCls(s.id, currentState, selectionMade, isBaseline)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {isBaseline && !selectionMade && (
        <p className="text-[10px] text-gray-400 mt-1.5">Diskip tersedia mulai Fase 2</p>
      )}

      {inGracePeriod && (
        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex-1 h-0.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-300 rounded-full transition-[width] duration-1000 ease-linear"
              style={{ width: `${(timeLeft / GRACE_SECONDS) * 100}%` }}
            />
          </div>
          <button
            onClick={handleUndo}
            className="text-xs text-gray-500 hover:text-gray-700 shrink-0 transition-colors"
          >
            Batalkan ({timeLeft}s)
          </button>
        </div>
      )}

      {confirmedState && !inGracePeriod && (
        <div className="mt-2 flex flex-col gap-1.5">
          {confirmedState === 'skipped' && (
            <p className="text-xs font-medium text-[#16a34a]">
              {isTargeted ? 'Target tercapai! 🎯' : 'Bagus! Tetap semangat 💪'}
            </p>
          )}

          {noteOpen ? (
            <textarea
              autoFocus
              value={note || ''}
              onChange={e => onUpdateNote(e.target.value)}
              onBlur={() => setNoteOpen(false)}
              placeholder="Situasi, level craving 1–10, pemicunya apa..."
              rows={2}
              className="w-full text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 resize-none focus:outline-none focus:border-gray-400"
            />
          ) : note ? (
            <button
              onClick={() => setNoteOpen(true)}
              className="text-xs text-gray-500 text-left italic leading-relaxed"
            >
              {note}
            </button>
          ) : (
            <button
              onClick={() => setNoteOpen(true)}
              className={`text-xs text-left transition-colors ${
                confirmedState === 'did_it'
                  ? 'text-gray-500 font-medium hover:text-gray-700'
                  : 'text-gray-300 hover:text-gray-500'
              }`}
            >
              {confirmedState === 'did_it' ? '+ Catat craving' : '+ catatan'}
            </button>
          )}
        </div>
      )}

    </div>
  )
}
