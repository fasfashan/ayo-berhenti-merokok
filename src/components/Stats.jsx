import { useState, useMemo } from 'react'
import { SESSIONS, lastNDays } from '../data'
import { generateDemoLogs } from '../demoData'

function computeAllStats(logs) {
  const days = lastNDays(7)
  let totalSkipped = 0
  let totalApplicable = 0

  const perSession = SESSIONS.map(session => {
    let skipped = 0
    let didIt = 0
    let streak = 0
    let streakBroken = false

    for (let i = 0; i < days.length; i++) {
      const st = logs[days[i]]?.[session.id]?.state ?? null

      if (!streakBroken) {
        if (st === 'skipped') streak++
        else if (st === 'na') {}
        else if (st === null && i === 0) {}
        else streakBroken = true
      }

      if (st === 'skipped') skipped++
      else if (st === 'did_it') didIt++
    }

    const applicable = skipped + didIt
    totalSkipped += skipped
    totalApplicable += applicable
    const rate = applicable > 0 ? Math.round((skipped / applicable) * 100) : null

    return { session, skipped, applicable, rate, streak }
  })

  const overallPct = totalApplicable > 0 ? Math.round((totalSkipped / totalApplicable) * 100) : null
  return { perSession, totalSkipped, totalApplicable, overallPct }
}

export default function Stats({ logs, phase, today, startDate, onReset }) {
  const [demoMode, setDemoMode] = useState(false)

  const demoLogs = useMemo(() => generateDemoLogs(today), [today])
  const activeLogs = demoMode ? demoLogs : logs

  const { perSession, totalSkipped, totalApplicable, overallPct } = useMemo(
    () => computeAllStats(activeLogs),
    [activeLogs]
  )

  return (
    <div className="flex flex-col gap-6">

      {demoMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center justify-between">
          <p className="text-xs font-medium text-amber-700">Mode Demo — data tidak nyata</p>
          <button
            onClick={() => setDemoMode(false)}
            className="text-xs text-amber-600 font-medium underline underline-offset-2"
          >
            Tutup
          </button>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">7 Hari Terakhir</p>
        <div className="border border-gray-200 rounded-xl p-4">
          {totalApplicable > 0 ? (
            <>
              <p className="text-2xl font-semibold text-gray-900">
                {totalSkipped}
                <span className="text-sm font-normal text-gray-400 ml-1.5">/ {totalApplicable} sesi diskip</span>
              </p>
              <div className="mt-3">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all"
                    style={{ width: `${overallPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">{overallPct}% berhasil skip minggu ini</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">Belum ada data minggu ini</p>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Per Sesi</p>
        <div className="flex flex-col gap-2">
          {perSession.map(({ session, rate, streak, skipped, applicable }) => {
            const isTargeted = phase.targetIds.includes(session.id)
            return (
              <div
                key={session.id}
                className={`rounded-xl border p-3.5 ${isTargeted ? 'border-gray-200 border-l-[3px] border-l-[#2563eb] bg-white' : 'border-gray-100 bg-white'}`}
              >
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 w-5 h-5 rounded-full text-[10px] font-semibold flex items-center justify-center shrink-0 ${
                    isTargeted ? 'bg-[#2563eb] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {session.id}
                  </span>
                  <div className="flex-1 min-w-0  space-y-2">
                    <p className="text-sm font-medium text-gray-800 leading-snug">
                      {session.period} — {session.desc}
                    </p>
                    {rate !== null ? (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isTargeted ? 'bg-[#2563eb]' : 'bg-gray-400'}`}
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-600 w-8 text-right">{rate}%</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {skipped}/{applicable} hari
                          {streak > 0 && <span className="ml-2 text-gray-500">· streak {streak} hari</span>}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1">Belum ada data</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Pengaturan</p>
        <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-700">Tanggal mulai program</p>
              <p className="text-sm text-gray-500">{startDate}</p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Digunakan untuk menentukan fase dan minggu saat ini.
            </p>
          </div>

          

          <button
            onClick={onReset}
            className="w-full py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
          >
            Reset Program
          </button>
        </div>
      </div>

    </div>
  )
}
