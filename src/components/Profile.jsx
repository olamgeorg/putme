import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(true)
  const [stats, setStats] = useState({
    testsTaken: 0,
    averageScore: 0,
    bestScore: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const { data, error } = await supabase
      .from('test_results')
      .select('score, percentage')
      .eq('user_id', user.id)

    if (!error && data) {
      const tests = data.length
      const avg = tests > 0 ? data.reduce((sum, r) => sum + r.percentage, 0) / tests : 0
      const best = tests > 0 ? Math.max(...data.map(r => r.percentage)) : 0
      setStats({
        testsTaken: tests,
        averageScore: avg,
        bestScore: best
      })
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-800 text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-800 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-slate-700 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl text-white font-bold">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <h3 className="text-white text-lg font-semibold">{user.email}</h3>
            <p className="text-slate-400 text-sm">Student</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.testsTaken}</div>
            <div className="text-slate-400 text-xs">Tests Taken</div>
          </div>
          <div className="bg-slate-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.averageScore.toFixed(1)}%</div>
            <div className="text-slate-400 text-xs">Average</div>
          </div>
          <div className="bg-slate-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{stats.bestScore.toFixed(1)}%</div>
            <div className="text-slate-400 text-xs">Best</div>
          </div>
        </div>

        <div className="bg-slate-700 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-white">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-12 h-6 bg-slate-600 rounded-full relative transition"
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-orange-500 rounded-full transition ${
                darkMode ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>

        <div className="mt-8 pt-6 border-t border-slate-700 text-center text-slate-500 text-sm">
          Developed by George
        </div>
      </div>
    </div>
  )
}