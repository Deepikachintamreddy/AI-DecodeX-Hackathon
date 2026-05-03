import { Upload, FileText, X, Loader2, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'

export default function UploadZone({ files, setFiles, syllabus, setSyllabus, onAnalyze, onSample, analyzing, progress }) {
  const inputRef = useRef(null)
  const [drag, setDrag] = useState(false)

  const handleFiles = (newFiles) => {
    const arr = [...newFiles].filter((f) => f.type === 'application/pdf' || f.type.startsWith('image/'))
    setFiles((prev) => [...prev, ...arr])
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div
        className={`relative rounded-2xl border-2 border-dashed transition-all p-12 text-center cursor-pointer
          ${drag ? 'border-accent bg-accent/5 glow-border' : 'border-border hover:border-accent/50 hover:bg-elevated/30'}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="application/pdf,image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent2/20 mb-4">
          <Upload className="w-7 h-7 text-accent" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Drop past papers here</h3>
        <p className="text-sm text-gray-400">PDF or image files. Multiple years across one subject works best.</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2 animate-slide-up">
          <div className="text-sm text-gray-400 flex items-center justify-between">
            <span>{files.length} paper{files.length > 1 ? 's' : ''} ready</span>
            <button onClick={() => setFiles([])} className="text-xs hover:text-accent">clear all</button>
          </div>
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-elevated/60 border border-border">
              <FileText className="w-4 h-4 text-accent2 shrink-0" />
              <span className="text-sm truncate flex-1">{f.name}</span>
              <span className="text-xs text-gray-500">{(f.size / 1024).toFixed(0)} KB</span>
              <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-gray-500 hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="text-sm text-gray-400 mb-2 block">Syllabus (optional, but unlocks gap analysis)</label>
        <textarea
          value={syllabus}
          onChange={(e) => setSyllabus(e.target.value)}
          rows={5}
          placeholder="Paste your syllabus here. One topic per line, or comma/bullet separated. Example:&#10;Unit 1: Database Normalization&#10;Unit 2: SQL Queries, Joins&#10;Unit 3: Concurrency Control..."
          className="w-full p-3 rounded-xl bg-elevated/60 border border-border text-sm resize-none focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onAnalyze}
          disabled={files.length === 0 || analyzing}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent to-accent2 text-bg font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {analyzing ? (<><Loader2 className="w-4 h-4 animate-spin" /> {progress || 'Analyzing...'}</>) : (<><Sparkles className="w-4 h-4" /> Analyze Papers</>)}
        </button>
        <button
          onClick={onSample}
          disabled={analyzing}
          className="px-6 py-3.5 rounded-xl bg-elevated border border-border hover:border-accent/50 hover:bg-elevated/80 transition-all text-sm font-medium disabled:opacity-40"
        >
          ✨ Try with sample data
        </button>
      </div>
    </div>
  )
}
