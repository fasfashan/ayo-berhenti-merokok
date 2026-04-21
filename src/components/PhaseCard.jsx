import { SESSIONS } from '../data'

export default function PhaseCard({ phase, startDate }) {
  const startDay = new Date(startDate + 'T00:00:00')
  const now = new Date()
  const todayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.floor((todayDay - startDay) / 86400000)
  const dayNum = diffDays + 1
  const weekNum = Math.ceil(dayNum / 7)

  return (
    <div className="border bg-white border-gray-200 rounded-xl p-4 border-t-[3px] border-t-[#2563eb]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
            {phase.weekRange}
          </p>
          <h2 className="text-base font-semibold text-gray-900 mt-0.5">{phase.name}</h2>
          <p className="text-sm text-gray-500 mt-1 leading-snug">{phase.desc}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-400">Minggu {weekNum}</p>
          <p className="text-xs text-gray-400">Hari {dayNum}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        {phase.targetIds.length > 0 ? (
          <>
            <p className="text-xs font-medium text-gray-500 mb-2">Target sesi:</p>
            <div className="flex flex-col gap-1.5">
              {phase.targetIds.map(id => {
                const s = SESSIONS.find(s => s.id === id)
                return (
                  <div key={id} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#2563eb] text-white text-[10px] font-semibold flex items-center justify-center shrink-0">
                      {id}
                    </span>
                    <span className="text-sm text-gray-700">{s.period} — {s.desc}</span>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-400">Observasi saja — belum ada target skip</p>
        )}
      </div>
    </div>
  )
}
