import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar     from './components/Sidebar'
import Dashboard   from './pages/Dashboard'
import StudyBot    from './pages/StudyBot'
import Deadlines   from './pages/Deadlines'
import Automations from './pages/Automations'
import Profile     from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <div className='flex h-screen bg-gray-50 text-gray-900 overflow-hidden'>
        <Sidebar />
        <main className='flex-1 overflow-y-auto p-6'>
          <Routes>
            <Route path='/'            element={<Dashboard   />} />
            <Route path='/bot'         element={<StudyBot    />} />
            <Route path='/deadlines'   element={<Deadlines   />} />
            <Route path='/automations' element={<Automations />} />
            <Route path='/profile'     element={<Profile     />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}