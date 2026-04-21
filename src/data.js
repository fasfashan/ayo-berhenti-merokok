export const SESSIONS = [
  { id: 1, period: 'Pagi', desc: 'Jalan ke parkiran → stasiun', conditional: false },
  { id: 2, period: 'Pagi', desc: 'Stasiun Rawa Buaya → kantor 800m', conditional: false },
  { id: 3, period: 'Siang', desc: 'Habis makan siang', time: '12:00–13:00', conditional: false },
  { id: 4, period: 'Sore', desc: 'Nongkrong habis kantor', time: '17:30–18:30', conditional: true },
  { id: 5, period: 'Malam', desc: 'Jalan kantor → stasiun', conditional: false },
  { id: 6, period: 'Malam', desc: 'Stasiun → parkiran motor', conditional: false },
  { id: 7, period: 'Malam', desc: 'Ngerjain freelance', conditional: true },
]

export const PHASES = [
  {
    id: 1,
    name: 'Fase 1 — Baseline',
    weekRange: 'Minggu 1–2',
    desc: 'Catat semua sesi. Kenali pola harianmu.',
    targetIds: [],
  },
  {
    id: 2,
    name: 'Fase 2',
    weekRange: 'Minggu 3–4',
    desc: 'Eliminasi sesi kondisional.',
    targetIds: [4, 7],
  },
  {
    id: 3,
    name: 'Fase 3',
    weekRange: 'Minggu 5–6',
    desc: 'Eliminasi sesi stasiun → kantor.',
    targetIds: [2],
  },
  {
    id: 4,
    name: 'Fase 4',
    weekRange: 'Minggu 7–8',
    desc: 'Eliminasi sesi kantor → stasiun malam.',
    targetIds: [5],
  },
  {
    id: 5,
    name: 'Fase 5',
    weekRange: 'Bulan 3',
    desc: 'Eliminasi parkiran pagi & malam.',
    targetIds: [1, 6],
  },
]

export function getCurrentPhaseIndex(startDateStr) {
  if (!startDateStr) return 0
  const startDay = new Date(startDateStr + 'T00:00:00')
  const today = new Date()
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const diff = Math.floor((todayDay - startDay) / 86400000)
  const week = Math.floor(diff / 7) + 1
  if (week <= 2) return 0
  if (week <= 4) return 1
  if (week <= 6) return 2
  if (week <= 8) return 3
  return 4
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function lastNDays(n) {
  const days = []
  const now = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}
