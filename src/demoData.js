// Generates 14 days of realistic Phase-1 sample data (today-1 to today-14).
// Patterns reflect baseline behaviour: mostly did_it, session 2 building a streak,
// session 3 sporadic skips, conditionals 4 & 7 getting na on off-days.

const PATTERNS = {
  // 1 = yesterday … 14 = two weeks ago
  //          1           2           3           4           5           6           7           8           9          10          11          12          13          14
  1: ['did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it'],
  2: ['skipped','skipped','skipped','skipped','skipped','skipped','did_it','did_it','skipped','did_it','did_it','did_it','did_it','did_it'],
  3: ['skipped','did_it','skipped','did_it','skipped','did_it','did_it','skipped','did_it','did_it','skipped','did_it','did_it','did_it'],
  4: ['na','na','did_it','na','na','did_it','na','na','did_it','na','did_it','na','na','did_it'],
  5: ['did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it'],
  6: ['did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it','did_it'],
  7: ['na','na','na','did_it','na','na','did_it','na','na','did_it','na','na','did_it','na'],
}

export function generateDemoLogs(todayStr) {
  const logs = {}
  const base = new Date(todayStr + 'T00:00:00')

  for (let offset = 1; offset <= 14; offset++) {
    const d = new Date(base)
    d.setDate(d.getDate() - offset)
    const dateStr = d.toISOString().slice(0, 10)
    logs[dateStr] = {}
    for (const id of [1, 2, 3, 4, 5, 6, 7]) {
      logs[dateStr][id] = { state: PATTERNS[id][offset - 1], note: '' }
    }
  }

  return logs
}
