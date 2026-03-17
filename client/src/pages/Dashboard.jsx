import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const API    = import.meta.env.VITE_API || 'http://localhost:5000'
const COLORS = ['#378ADD','#7F77DD','#1D9E75','#EF9F27','#D85A30']

export default function Dashboard() {
  const [subjects,     setSubjects]     = useState([])
  const [deadlines,    setDeadlines]    = useState([])
  const [dangerWeek,   setDangerWeek]   = useState(null)
  const [emailDraft,   setEmailDraft]   = useState(null)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loading,      setLoading]      = useState(true)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    try {
      const res = await axios.get(API + '/api/data')
      const dl  = res.data.deadlines || []
      const sub = res.data.subjects  || []
      setSubjects(sub)
      setDeadlines(dl)
      detectDanger(dl)
    } catch (err) { console.error('Fetch error:', err.message) }
    setLoading(false)
  }

  function detectDanger(dl) {
    const map = {}
    dl.forEach(d => {
      const date = new Date(d.dueDate)
      const mon  = new Date(date)
      mon.setDate(date.getDate() - ((date.getDay() + 6) % 7))
      const key = mon.toISOString().slice(0,10)
      if (!map[key]) map[key] = []
      map[key].push(d)
    })
    const hit = Object.entries(map).find(([,arr]) => arr.length >= 3)
    setDangerWeek(hit ? { weekOf: hit[0], items: hit[1] } : null)
  }

  async function draftEmail() {
    if (!dangerWeek) return
    setLoadingEmail(true)
    try {
      const lowest = [...dangerWeek.items].sort((a,b) => (a.weightage||0)-(b.weightage||0))[0]
      const res    = await axios.post(API + '/api/email', {
        subject: lowest.subject,
        dueDate: new Date(lowest.dueDate).toDateString()
      })
      setEmailDraft(res.data)
    } catch (err) { alert('Email draft error: ' + err.message) }
    setLoadingEmail(false)
  }

  function openEmail() {
    if (!emailDraft) return
    const text = `Subject: ${emailDraft.subject}\n\n${emailDraft.body}`
    navigator.clipboard.writeText(text)
    alert('✅ Email copied to clipboard!\n\nSubject: ' + emailDraft.subject)
  }

  const soon        = deadlines.filter(d => { const days=(new Date(d.dueDate)-new Date())/86400000; return days>=0&&days<=14 }).length
  const healthScore = Math.max(10, 100 - soon*8 - (dangerWeek?20:0))
  const hsColor     = healthScore>=70?'text-green-500':healthScore>=50?'text-amber-500':'text-red-500'
  const hsLabel     = healthScore>=70?'Healthy':healthScore>=50?'At Risk':'Critical'
  const thisWeek    = deadlines.filter(d => { const days=(new Date(d.dueDate)-new Date())/86400000; return days>=0&&days<=7 }).length

  if (loading) return <div className='text-sm text-gray-400 p-4'>Loading...</div>

  return (
    <div className='max-w-4xl space-y-5'>
      <div>
        <h1 className='text-xl font-semibold text-gray-800'>Dashboard</h1>
        <p className='text-sm text-gray-400'>Your semester at a glance</p>
      </div>
      <div className='grid grid-cols-4 gap-3'>
        <div className='bg-white border border-gray-100 rounded-xl p-5'>
          <p className='text-xs text-gray-400 mb-2'>Health Score</p>
          <p className={`text-4xl font-semibold ${hsColor}`}>{healthScore}</p>
          <p className={`text-xs mt-1 ${hsColor}`}>{hsLabel}</p>
        </div>
        <div className='bg-white border border-gray-100 rounded-xl p-5'>
          <p className='text-xs text-gray-400 mb-2'>This week</p>
          <p className={`text-4xl font-semibold ${thisWeek>=3?'text-red-500':'text-gray-700'}`}>{thisWeek}</p>
          <p className='text-xs text-gray-400 mt-1'>deadlines</p>
        </div>
        <div className='bg-white border border-gray-100 rounded-xl p-5'>
          <p className='text-xs text-gray-400 mb-2'>Subjects</p>
          <p className='text-4xl font-semibold text-gray-700'>{subjects.length}</p>
          <p className='text-xs text-gray-400 mt-1'>loaded</p>
        </div>
        <div className='bg-white border border-gray-100 rounded-xl p-5'>
          <p className='text-xs text-gray-400 mb-2'>Automations</p>
          <p className='text-4xl font-semibold text-green-500'>3</p>
          <p className='text-xs text-gray-400 mt-1'>via n8n</p>
        </div>
      </div>
      {dangerWeek && (
        <div className='bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4'>
          <div className='w-2.5 h-2.5 rounded-full bg-red-500 shrink-0' />
          <p className='text-sm text-red-700 flex-1'>
            <span className='font-semibold'>Danger week detected</span> — week of {dangerWeek.weekOf} has {dangerWeek.items.length} deadlines clustering.
          </p>
          {!emailDraft ? (
            <button onClick={draftEmail} disabled={loadingEmail}
              className='text-xs px-3 py-2 border border-red-300 rounded-lg text-red-600 bg-white hover:bg-red-50 shrink-0 disabled:opacity-50'>
              {loadingEmail ? 'Drafting...' : 'Draft extension email'}
            </button>
          ) : (
            <button onClick={openEmail}
              className='text-xs px-3 py-2 border border-red-300 rounded-lg text-red-600 bg-white hover:bg-red-50 shrink-0 font-semibold'>
              Copy Email →
            </button>
          )}
        </div>
      )}
      {subjects.length === 0 ? (
        <div className='bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center'>
          <p className='text-sm font-medium text-indigo-600'>No syllabus uploaded yet</p>
          <p className='text-xs text-indigo-400 mt-1 mb-3'>Upload your syllabus PDF to get started</p>
          <Link to='/profile' className='inline-block text-xs px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700'>Go to Setup →</Link>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4'>
          <div className='bg-white border border-gray-100 rounded-xl p-5'>
            <h2 className='text-sm font-semibold text-gray-700 mb-3'>Subject priorities</h2>
            {[...subjects].sort((a,b)=>b.priority-a.priority).map((s,i)=>(
              <div key={i} className='flex items-center gap-3 py-2 border-b border-gray-50 last:border-0'>
                <div className='w-2 h-2 rounded-full shrink-0' style={{background:COLORS[i%5]}} />
                <span className='text-sm flex-1 text-gray-800'>{s.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-md ${
                  s.complexity==='High'?'bg-red-50 text-red-500':
                  s.complexity==='Medium'?'bg-amber-50 text-amber-500':'bg-green-50 text-green-500'
                }`}>{s.complexity}</span>
              </div>
            ))}
          </div>
          <div className='bg-white border border-gray-100 rounded-xl p-5'>
            <div className='flex justify-between items-center mb-3'>
              <h2 className='text-sm font-semibold text-gray-700'>Upcoming deadlines</h2>
              <Link to='/deadlines' className='text-xs text-indigo-500 hover:underline'>+ Add</Link>
            </div>
            {deadlines.length === 0 ? (
              <p className='text-xs text-gray-400'>No deadlines yet</p>
            ) : deadlines.slice(0,7).map((d,i) => {
              const days = Math.ceil((new Date(d.dueDate)-new Date())/86400000)
              return (
                <div key={i} className='flex items-center gap-3 py-2 border-b border-gray-50 last:border-0'>
                  <span className='text-xs text-gray-400 w-12 shrink-0'>{new Date(d.dueDate).toLocaleDateString('en-GB',{day:'2-digit',month:'short'})}</span>
                  <span className='text-xs flex-1 text-gray-700'>{d.subject} — {d.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-md shrink-0 ${days<=3?'bg-red-50 text-red-500':days<=7?'bg-amber-50 text-amber-500':'bg-gray-50 text-gray-400'}`}>
                    {days<0?'overdue':days===0?'today':days+'d'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}