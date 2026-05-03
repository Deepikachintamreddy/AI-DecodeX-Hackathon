import { Loader2, Calendar, Target, Clock, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function StudyPlanner({ ranked, onGenerate, plan, generating }) {
  const [days, setDays] = useState(14)
  const [hours, setHours] = useState(3)

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="glass rounded-2xl p-5">
        <h2 className="text-base font-semibold mb-1 flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" /> Smart Study Planner</h2>
        <p className="text-xs text-gray-400 mb-4">AI builds a day-by-day plan front-loaded with your highest-yield topics.</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Days until exam</label>
            <input type="number" min={1} max={90} value={days} onChange={(e) => setDays(+e.target.value)}
              className="w-full p-2.5 rounded-lg bg-elevated border border-border text-sm focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Hours per day</label>
            <input type="number" min={1} max={16} value={hours} onChange={(e) => setHours(+e.target.value)}
              className="w-full p-2.5 rounded-lg bg-elevated border border-border text-sm focus:outline-none focus:border-accent" />
          </div>
        </div>

        <button
          onClick={() => onGenerate({ days, hours })}
          disabled={generating}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-accent to-accent2 text-bg font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-40"
        >
          {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Crafting plan...</> : <><Sparkles className="w-4 h-4" /> Generate My Study Plan</>}
        </button>
      </section>

      {plan && (
        <section className="space-y-4 animate-slide-up">
          {plan.strategy_note && (
            <div className="glass rounded-2xl p-4 border-l-4 border-accent">
              <div className="text-xs uppercase tracking-wide text-accent mb-1">Coach's Strategy Note</div>
              <p className="text-sm">{plan.strategy_note}</p>
            </div>
          )}
          <div className="grid gap-3">
            {plan.plan?.map((d) => (
              <article key={d.day} className="glass rounded-2xl p-4 hover:border-accent/30 transition-colors">
                <header className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/30 to-accent2/30 flex items-center justify-center text-sm font-bold">D{d.day}</div>
                    <div>
                      <div className="font-semibold">{d.focus}</div>
                      <div className="text-xs text-gray-500">{d.date_offset}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {d.expected_hours}h</div>
                </header>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {d.topics?.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent border border-accent/20">{t}</span>
                  ))}
                </div>
                <ul className="space-y-1.5">
                  {d.tasks?.map((task, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <Target className="w-3.5 h-3.5 text-accent2 mt-1 shrink-0" />
                      <span className="text-gray-300">{task}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
