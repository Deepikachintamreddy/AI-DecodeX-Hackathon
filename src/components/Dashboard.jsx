import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, Legend } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Award, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

const COLORS = ['#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa']

export default function Dashboard({ ranked, years, gaps }) {
  const [selected, setSelected] = useState(null)

  const top10 = ranked.slice(0, 10)

  // Year-trend chart data
  const trendData = years.map((y) => {
    const row = { year: y }
    top10.slice(0, 5).forEach((t) => { row[t.name] = t.yearCounts[y] || 0 })
    return row
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Topics Identified" value={ranked.length} icon={<Award className="w-4 h-4" />} />
        <StatCard label="Years Analyzed" value={years.length} sub={years.join(' → ')} />
        <StatCard label="Top Topic Score" value={ranked[0]?.score || 0} sub={ranked[0]?.name} />
        <StatCard label="Syllabus Gaps" value={gaps?.gaps.length || '—'} sub={gaps ? `${gaps.covered.length} covered` : 'no syllabus'} variant={gaps?.gaps.length > 0 ? 'warn' : 'ok'} />
      </div>

      {/* Top topics bar chart */}
      <Panel title="🎯 High-Yield Topics — Ranked by AI Importance Score">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={top10} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a36" />
            <XAxis type="number" stroke="#6b7280" fontSize={11} domain={[0, 100]} />
            <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={11} width={160} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1c1c2680' }} />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} onClick={(d) => setSelected(d)}>
              {top10.map((_, i) => <Cell key={i} fill={`url(#grad${i % 3})`} />)}
            </Bar>
            <defs>
              <linearGradient id="grad0" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#60a5fa" /></linearGradient>
              <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#60a5fa" /><stop offset="1" stopColor="#34d399" /></linearGradient>
              <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#34d399" /><stop offset="1" stopColor="#fbbf24" /></linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-2">💡 Click any bar to see breakdown. Score = 40% frequency + 30% recency + 20% trend + 10% marks.</p>
      </Panel>

      {/* Year-wise trend */}
      {years.length > 1 && (
        <Panel title="📈 Year-Wise Trends (Top 5 Topics)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a36" />
              <XAxis dataKey="year" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ background: '#1c1c26', border: '1px solid #2a2a36', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {top10.slice(0, 5).map((t, i) => (
                <Line key={t.name} type="monotone" dataKey={t.name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      )}

      {/* Heatmap */}
      <Panel title="🔥 Topic × Year Heatmap">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 font-medium text-gray-400">Topic</th>
                {years.map((y) => <th key={y} className="p-2 font-medium text-gray-400 text-center">{y}</th>)}
                <th className="p-2 font-medium text-gray-400 text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {top10.map((t) => (
                <tr key={t.name} className="border-t border-border">
                  <td className="p-2 text-sm">{t.name}</td>
                  {years.map((y) => {
                    const c = t.yearCounts[y] || 0
                    const intensity = Math.min(1, c / 3)
                    return (
                      <td key={y} className="p-2 text-center">
                        <div
                          className="w-9 h-9 rounded mx-auto flex items-center justify-center text-xs font-medium"
                          style={{
                            background: c > 0 ? `rgba(167, 139, 250, ${0.15 + intensity * 0.6})` : '#13131a',
                            color: c > 0 ? '#fff' : '#4b5563',
                          }}
                        >{c}</div>
                      </td>
                    )
                  })}
                  <td className="p-2 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-semibold">{t.score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Detailed list with breakdown */}
      <Panel title="📊 Full Topic Breakdown">
        <div className="space-y-2">
          {ranked.map((t, i) => (
            <details key={t.name} className="rounded-lg bg-elevated/40 border border-border group">
              <summary className="cursor-pointer p-3 flex items-center gap-3 hover:bg-elevated/70 transition-colors">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-accent/30 to-accent2/30 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="flex-1 font-medium text-sm">{t.name}</span>
                <TrendIndicator slope={t.trendSlope} />
                <span className="text-xs text-gray-500">{t.frequency}× · avg {t.avgMarks}m</span>
                <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-semibold w-12 text-center">{t.score}</span>
              </summary>
              <div className="p-4 pt-2 border-t border-border text-sm space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <Mini label="Frequency" val={`${t.breakdown.frequency}%`} />
                  <Mini label="Recency" val={`${t.breakdown.recency}%`} />
                  <Mini label="Trend" val={`${t.breakdown.trend}%`} />
                  <Mini label="Marks weight" val={`${t.breakdown.marks}%`} />
                </div>
                <div className="text-xs text-gray-400">
                  Difficulty: <span className="text-green-400">Easy {t.difficulties.Easy || 0}</span> · <span className="text-yellow-400">Medium {t.difficulties.Medium || 0}</span> · <span className="text-red-400">Hard {t.difficulties.Hard || 0}</span>
                </div>
                <div className="text-xs text-gray-500">
                  <strong className="text-gray-300">Sample questions asked:</strong>
                  <ul className="mt-1 space-y-1">
                    {t.questions.slice(0, 3).map((q, j) => (
                      <li key={j} className="pl-3 border-l-2 border-accent/30">"{q.text}" <span className="text-accent2">({q.year}, {q.marks}m)</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          ))}
        </div>
      </Panel>

      {/* Syllabus gaps */}
      {gaps && (
        <Panel title="🧭 Syllabus Coverage Analysis">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Gaps — In syllabus but rarely asked</h4>
              {gaps.gaps.length === 0 ? (
                <p className="text-xs text-gray-500">All syllabus topics appear in past papers ✓</p>
              ) : (
                <ul className="space-y-1">
                  {gaps.gaps.map((g) => (
                    <li key={g} className="text-sm px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/20">{g}</li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-gray-500 mt-2">Don't ignore — these may appear this year.</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-green-400 mb-2">✓ Covered with high frequency</h4>
              <ul className="space-y-1">
                {gaps.covered.slice(0, 8).map((c) => (
                  <li key={c.topic} className="text-sm px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/20 flex justify-between">
                    <span>{c.topic}</span>
                    <span className="text-xs text-green-400">score {c.score}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Panel>
      )}
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="text-base font-semibold mb-4">{title}</h2>
      {children}
    </section>
  )
}

function StatCard({ label, value, sub, variant, icon }) {
  const accent = variant === 'warn' ? 'from-amber-400/20 to-red-400/20 text-amber-300' : 'from-accent/20 to-accent2/20 text-accent'
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        {icon && <span className={`p-1.5 rounded-lg bg-gradient-to-br ${accent}`}>{icon}</span>}
      </div>
      <div className="text-2xl font-bold grad-text">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1 truncate">{sub}</div>}
    </div>
  )
}

function Mini({ label, val }) {
  return (
    <div className="rounded-lg bg-bg/60 p-2">
      <div className="text-[10px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-sm font-semibold">{val}</div>
    </div>
  )
}

function TrendIndicator({ slope }) {
  if (slope > 0.2) return <TrendingUp className="w-4 h-4 text-green-400" title="Rising" />
  if (slope < -0.2) return <TrendingDown className="w-4 h-4 text-red-400" title="Declining" />
  return <Minus className="w-4 h-4 text-gray-500" title="Stable" />
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="glass rounded-lg p-3 text-xs">
      <div className="font-semibold mb-1">{d.name}</div>
      <div className="text-accent">Score: {d.score}/100</div>
      <div className="text-gray-400">Asked {d.frequency}× across {d.yearsAppeared.length} year(s)</div>
      <div className="text-gray-500">avg {d.avgMarks} marks</div>
    </div>
  )
}
