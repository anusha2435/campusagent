export default function Automations() {
  const workflows = [
    { name:'Study Bot',      desc:'Answers questions 24/7 on Telegram',              next:'Listening continuously',
      nodes:'Telegram Trigger → HTTP POST /api/chat → Telegram Send' },
    { name:'Weekly Brief',   desc:'Sends personalised study plan every Monday 8am',  next:'Next: Monday 8:00am',
      nodes:'Schedule (Mon 8am) → HTTP GET /api/data → HTTP POST /api/chat → Telegram Send' },
    { name:'Deadline Alert', desc:'Checks daily for 3-day deadlines and sends tips', next:'Checks every day at 9:00am',
      nodes:'Schedule (daily 9am) → HTTP GET /api/deadlines → Code node → IF node → HTTP POST /api/chat → Telegram Send' },
  ]
  return (
    <div className='max-w-2xl space-y-5'>
      <div>
        <h1 className='text-xl font-semibold text-gray-800'>Automations</h1>
        <p className='text-sm text-gray-400'>n8n workflows running 24/7 in the background</p>
      </div>
      <div className='bg-amber-50 border border-amber-100 rounded-xl p-4'>
        <p className='text-sm font-medium text-amber-700'>These run on n8n Cloud — build them in Step 8</p>
        <a href='https://n8n.io' target='_blank' rel='noreferrer' className='text-xs text-amber-600 underline mt-1 inline-block'>Open n8n →</a>
      </div>
      {workflows.map((w,i) => (
        <div key={i} className='bg-white border border-gray-100 rounded-xl p-5'>
          <div className='flex items-start gap-3'>
            <div className='w-2.5 h-2.5 rounded-full bg-green-400 mt-1 shrink-0' />
            <div className='flex-1'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='text-sm font-semibold text-gray-800'>{w.name}</p>
                  <p className='text-xs text-gray-500 mt-0.5'>{w.desc}</p>
                </div>
                <span className='text-xs px-2 py-0.5 rounded-md bg-green-50 text-green-600 shrink-0'>Active</span>
              </div>
              <p className='text-xs text-gray-400 mt-2'>{w.next}</p>
              <div className='mt-3 bg-gray-50 rounded-lg p-3'>
                <p className='text-xs font-medium text-gray-500 mb-1'>n8n nodes:</p>
                <p className='text-xs text-gray-500 font-mono'>{w.nodes}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}