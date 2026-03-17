import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API || 'http://localhost:5000'

export default function Deadlines() {
  const [deadlines, setDeadlines] = useState([])
  const [form,      setForm]      = useState({ subject:'', type:'Assignment', dueDate:'', weightage:'' })
  const [saving,    setSaving]    = useState(false)

  useEffect(() => { fetchDL() }, [])

  async function fetchDL() {
    try {
      const res = await axios.get(API + '/api/deadlines')
      setDeadlines(res.data)
    } catch (err) { console.error(err) }
  }

  async function add() {
    if (!form.subject.trim()) return alert('Subject is required')
    if (!form.dueDate)        return alert('Due date is required')
    setSaving(true)
    try {
      await axios.post(API + '/api/deadlines', { ...form, weightage: Number(form.weightage)||0 })
      setForm({ subject:'', type:'Assignment', dueDate:'', weightage:'' })
      fetchDL()
    } catch (err) { alert(err.message) }
    setSaving(false)
  }

  async function remove(id) {
    try {
      await axios.delete(API + '/api/deadlines/' + id)
      fetchDL()
    } catch (err) { console.error(err) }
  }

  const inp = 'w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400'

  return (
    <div className='max-w-2xl space-y-5'>
      <div>
        <h1 className='text-xl font-semibold text-gray-800'>Deadlines</h1>
        <p className='text-sm text-gray-400'>Add deadlines as professors announce them</p>
      </div>
      <div className='bg-white border border-gray-100 rounded-xl p-5'>
        <h2 className='text-sm font-semibold text-gray-700 mb-4'>Add new deadline</h2>
        <div className='grid grid-cols-2 gap-3 mb-4'>
          <div>
            <label className='text-xs text-gray-400 block mb-1'>Subject *</label>
            <input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder='e.g. Data Structures' className={inp} />
          </div>
          <div>
            <label className='text-xs text-gray-400 block mb-1'>Type</label>
            <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className={inp}>
              {['Assignment','Internal','Lab','Presentation'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className='text-xs text-gray-400 block mb-1'>Due date *</label>
            <input type='date' value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} className={inp} />
          </div>
          <div>
            <label className='text-xs text-gray-400 block mb-1'>Weightage % (optional)</label>
            <input type='number' value={form.weightage} placeholder='e.g. 20' onChange={e=>setForm({...form,weightage:e.target.value})} className={inp} />
          </div>
        </div>
        <button onClick={add} disabled={saving} className='text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50'>
          {saving?'Saving...':'+ Add deadline'}
        </button>
      </div>
      <div className='bg-white border border-gray-100 rounded-xl p-5'>
        <h2 className='text-sm font-semibold text-gray-700 mb-3'>All deadlines ({deadlines.length})</h2>
        {deadlines.length===0 ? <p className='text-xs text-gray-400'>No deadlines yet</p> : deadlines.map(d => {
          const days = Math.ceil((new Date(d.dueDate)-new Date())/86400000)
          return (
            <div key={d._id} className='flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0'>
              <span className='text-xs text-gray-400 w-16 shrink-0'>{new Date(d.dueDate).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'})}</span>
              <span className='text-sm flex-1'><span className='font-medium'>{d.subject}</span> — {d.type}</span>
              {d.weightage>0 && <span className='text-xs text-gray-400 shrink-0'>{d.weightage}%</span>}
              <span className={`text-xs px-2 py-0.5 rounded-md shrink-0 ${days<=3?'bg-red-50 text-red-500':days<=7?'bg-amber-50 text-amber-500':'bg-gray-50 text-gray-400'}`}>
                {days<0?'overdue':days===0?'today':days+'d'}
              </span>
              <button onClick={()=>remove(d._id)} className='text-xs text-gray-300 hover:text-red-400 shrink-0'>✕</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}