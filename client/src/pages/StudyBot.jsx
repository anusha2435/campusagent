import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API || 'http://localhost:5000'

export default function StudyBot() {
  const [messages, setMessages] = useState([{ role:'ai', text:'Hi! Ask me anything about your subjects — concepts, quiz questions, exam prep.' }])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  async function send() {
    const msg = input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(m => [...m, { role:'user', text:msg }])
    setLoading(true)
    try {
      const res = await axios.post(API + '/api/chat', { message: msg })
      setMessages(m => [...m, { role:'ai', text:res.data.answer }])
    } catch {
      setMessages(m => [...m, { role:'ai', text:'Error — check your Gemini API key in server/.env' }])
    }
    setLoading(false)
  }

  return (
    <div className='max-w-2xl flex flex-col' style={{height:'calc(100vh - 80px)'}}>
      <div className='mb-4'>
        <h1 className='text-xl font-semibold text-gray-800'>Study Bot</h1>
        <p className='text-sm text-gray-400'>Powered by Gemini — answers any subject question</p>
      </div>
      <div className='flex-1 overflow-y-auto bg-white border border-gray-100 rounded-xl p-4 space-y-4 mb-4'>
        {messages.map((m,i) => (
          <div key={i} className={`flex gap-2 ${m.role==='user'?'flex-row-reverse':''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
              m.role==='ai'?'bg-indigo-100 text-indigo-600':'bg-emerald-100 text-emerald-600'
            }`}>{m.role==='ai'?'AI':'You'}</div>
            <div className={`text-sm px-3 py-2.5 rounded-xl max-w-[82%] whitespace-pre-wrap leading-relaxed ${
              m.role==='ai'?'bg-gray-50 text-gray-800':'bg-indigo-600 text-white'
            }`}>{m.text}</div>
          </div>
        ))}
        {loading && <div className='flex gap-2'><div className='w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium'>AI</div><div className='text-sm px-3 py-2.5 rounded-xl bg-gray-50 text-gray-400 italic'>Thinking...</div></div>}
        <div ref={bottomRef} />
      </div>
      <div className='flex gap-2'>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
          placeholder='Ask anything — explain B+ trees, give me 5 MCQs on OS...'
          className='flex-1 text-sm px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-300' />
        <button onClick={send} disabled={loading} className='px-5 py-3 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 disabled:opacity-50'>Send</button>
      </div>
    </div>
  )
}