import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'

export default function ChatCoach({ onSend, ranked }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hey! I've analyzed your papers. Top topic right now: **${ranked[0]?.name || '...'}** (score ${ranked[0]?.score || '...'}/100). Ask me anything — like "what should I study tonight if I have 2 hours?" or "explain why X is high priority."` },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || busy) return
    const userMsg = { role: 'user', content: input.trim() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setBusy(true)
    try {
      const reply = await onSend(userMsg.content, messages)
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, something went wrong.' }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="glass rounded-2xl flex flex-col h-[70vh] animate-fade-in">
      <header className="p-4 border-b border-border">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center"><Bot className="w-4 h-4 text-bg" /></span>
          Study Coach
        </h2>
        <p className="text-xs text-gray-500 mt-1">Personalized advice based on your past-paper analysis</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-accent2/20' : 'bg-accent/20'}`}>
              {m.role === 'user' ? <User className="w-4 h-4 text-accent2" /> : <Bot className="w-4 h-4 text-accent" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${m.role === 'user' ? 'bg-accent2/10 border border-accent2/20' : 'bg-elevated border border-border'}`}>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center"><Bot className="w-4 h-4 text-accent" /></div>
            <div className="rounded-2xl p-3 bg-elevated border border-border"><Loader2 className="w-4 h-4 animate-spin" /></div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t border-border flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask your study coach..."
          disabled={busy}
          className="flex-1 p-2.5 rounded-lg bg-elevated border border-border text-sm focus:outline-none focus:border-accent transition-colors"
        />
        <button onClick={send} disabled={busy || !input.trim()} className="p-2.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-bg disabled:opacity-40">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
