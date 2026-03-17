import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',            label: 'Dashboard'     },
  { to: '/bot',         label: 'Study Bot'     },
  { to: '/deadlines',   label: 'Deadlines'     },
  { to: '/automations', label: 'Automations'   },
  { to: '/profile',     label: 'Profile & Setup' },
]

export default function Sidebar() {
  return (
    <div className='w-52 bg-white border-r border-gray-100 flex flex-col py-5 shrink-0 h-screen'>
      <div className='px-5 mb-5 pb-4 border-b border-gray-100'>
        <p className='text-base font-semibold text-indigo-600'>CampusAgent</p>
        <p className='text-xs text-gray-400 mt-1'>AI Academic Automation</p>
      </div>
      <nav className='flex flex-col gap-0.5 flex-1 px-2'>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'}
            className={({ isActive }) => `px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-500 hover:bg-gray-50'
            }`}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className='px-5 pt-4 border-t border-gray-100'>
        <p className='text-xs text-green-500 font-medium'>● Gemini connected</p>
      </div>
    </div>
  )
}