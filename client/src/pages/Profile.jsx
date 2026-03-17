import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API || 'http://localhost:5000'

export default function Profile() {
  const [uploading, setUploading] = useState(false)
  const [subjects,  setSubjects]  = useState([])
  const [done,      setDone]      = useState(false)
  const [error,     setError]     = useState(null)
  const [weekday,   setWeekday]   = useState(3)
  const [weekend,   setWeekend]   = useState(6)

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.name.endsWith('.pdf')) { setError('Please upload a PDF file'); return }
    setUploading(true); setError(null); setDone(false)
    try {
      const form = new FormData()
      form.append('pdf', file)
      const res = await axios.post(API + '/api/parse', form,
        { headers: { 'Content-Type': 'multipart/form-data' } })
      setSubjects(res.data.subjects)
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
    setUploading(false)
  }

  const inp = 'w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400'

  return (
    <div className='max-w-lg space-y-5'>
      <div>
        <h1 className='text-xl font-semibold text-gray-800'>Profile & Setup</h1>
        <p className='text-sm text-gray-400 mt-1'>Complete this once at the start of semester</p>
      </div>
      <div className='bg-white border border-gray-100 rounded-xl p-5 space-y-4'>
        <div>
          <h2 className='text-sm font-semibold text-gray-700 mb-1'>Step 1 — Upload Syllabus PDF</h2>
          <p className='text-xs text-gray-400 mb-3'>AI reads your syllabus and extracts every subject automatically</p>
          <input type='file' accept='.pdf' onChange={handleUpload}
            className='block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-200 file:text-sm file:bg-white hover:file:bg-gray-50 cursor-pointer' />
          {uploading && <p className='text-sm text-indigo-500 mt-2 animate-pulse'>AI is reading your syllabus...</p>}
          {error    && <p className='text-sm text-red-500 mt-2'>{error}</p>}
        </div>
        {done && (
          <div>
            <p className='text-sm font-medium text-green-600 mb-3'>✓ {subjects.length} subjects saved</p>
            {subjects.map((s,i) => (
              <div key={i} className='flex items-center gap-3 py-2 border-b border-gray-50 last:border-0'>
                <span className='text-sm flex-1 font-medium text-gray-800'>{s.name}</span>
                <span className='text-xs text-gray-400'>{s.credits} cr</span>
                <span className={`text-xs px-2 py-0.5 rounded-md ${
                  s.complexity==='High'?'bg-red-50 text-red-500':
                  s.complexity==='Medium'?'bg-amber-50 text-amber-500':'bg-green-50 text-green-500'
                }`}>{s.complexity}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='bg-white border border-gray-100 rounded-xl p-5 space-y-5'>
        <h2 className='text-sm font-semibold text-gray-700'>Step 2 — Your free study hours</h2>
        <div>
          <label className='text-sm text-gray-600 block mb-2'>Weekday hours: <span className='font-semibold'>{weekday}h</span></label>
          <input type='range' min={1} max={10} step={1} value={weekday} onChange={e=>setWeekday(+e.target.value)} className='w-full' />
        </div>
        <div>
          <label className='text-sm text-gray-600 block mb-2'>Weekend hours: <span className='font-semibold'>{weekend}h</span></label>
          <input type='range' min={1} max={16} step={1} value={weekend} onChange={e=>setWeekend(+e.target.value)} className='w-full' />
        </div>
      </div>
    </div>
  )
}