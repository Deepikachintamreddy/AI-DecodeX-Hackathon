import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'info', onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    warn: <AlertCircle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  }

  const colors = {
    success: 'border-green-500/50 bg-green-500/10',
    error: 'border-red-500/50 bg-red-500/10',
    warn: 'border-amber-500/50 bg-amber-500/10',
    info: 'border-blue-500/50 bg-blue-500/10',
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className={`glass border rounded-2xl p-4 shadow-2xl flex items-center gap-3 min-w-[300px] ${colors[type]}`}>
        {icons[type]}
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button onClick={() => setVisible(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  )
}
