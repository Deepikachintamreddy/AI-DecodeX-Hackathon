import { FileQuestion, Loader2, Sparkles, Download } from 'lucide-react'

export default function PredictedPaper({ onPredict, paper, generating }) {
  const handleDownload = () => {
    if (!paper?.predicted_paper) return
    const p = paper.predicted_paper
    let txt = `${p.title}\n${'='.repeat(p.title.length)}\n\n${p.instructions}\n\nTotal Marks: ${p.total_marks}\n\n`
    p.sections?.forEach((s) => {
      txt += `\n${s.name} (${s.marks_each || ''} marks each)\n${'-'.repeat(40)}\n`
      s.questions?.forEach((q) => {
        txt += `Q${q.q_no}. ${q.text}  [${q.marks}m]\n     Topic: ${q.topic}\n\n`
      })
    })
    txt += `\n\nWhy this paper? — ${p.rationale}`
    const blob = new Blob([txt], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'predicted-paper.txt'
    a.click()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="glass rounded-2xl p-5">
        <h2 className="text-base font-semibold mb-1 flex items-center gap-2">
          <FileQuestion className="w-4 h-4 text-accent" /> AI-Predicted Next Paper
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Based on observed patterns, here's what we believe your next exam paper will look like — topic mix, mark distribution, and question style.
        </p>
        <button
          onClick={onPredict}
          disabled={generating}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent2 text-bg font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-40"
        >
          {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Predicting...</> : <><Sparkles className="w-4 h-4" /> Predict Next Paper</>}
        </button>
      </section>

      {paper?.predicted_paper && (
        <section className="glass rounded-2xl p-6 animate-slide-up">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold grad-text">{paper.predicted_paper.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{paper.predicted_paper.instructions}</p>
              <p className="text-sm mt-1">Total Marks: <span className="text-accent font-semibold">{paper.predicted_paper.total_marks}</span></p>
            </div>
            <button onClick={handleDownload} className="px-3 py-1.5 rounded-lg bg-elevated border border-border hover:border-accent/50 text-xs flex items-center gap-1">
              <Download className="w-3 h-3" /> Download
            </button>
          </div>

          {paper.predicted_paper.sections?.map((s, idx) => (
            <div key={idx} className="mb-5">
              <h4 className="text-sm font-semibold text-accent2 mb-2">{s.name} {s.marks_each ? `(${s.marks_each} marks each)` : ''}</h4>
              <ol className="space-y-2.5">
                {s.questions?.map((q, qi) => (
                  <li key={qi} className="p-3 rounded-lg bg-elevated/40 border border-border">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm flex-1"><strong className="text-accent mr-2">Q{q.q_no}.</strong>{q.text}</span>
                      <span className="text-xs text-gray-500 shrink-0">[{q.marks}m]</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Topic: {q.topic}</div>
                  </li>
                ))}
              </ol>
            </div>
          ))}

          <div className="mt-4 p-3 rounded-lg bg-accent/5 border border-accent/20">
            <div className="text-xs uppercase tracking-wide text-accent mb-1">Rationale</div>
            <p className="text-sm text-gray-300">{paper.predicted_paper.rationale}</p>
          </div>
        </section>
      )}
    </div>
  )
}
