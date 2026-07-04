import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const currentResult = location.state

  useEffect(() => {
    if (!currentResult) {
      loadResults()
    } else {
      setLoading(false)
    }
  }, [])

  const loadResults = async () => {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setResults(data)
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-800 text-white">Loading...</div>
  }

  // Show current result if available
  if (currentResult) {
    const { score, total, percentage, timeUsed, questions, answers, markedForReview } = currentResult
    const isPass = percentage >= 50
    const correctCount = score / 4

    return (
      <div className="min-h-screen bg-slate-800 p-4">
        <div className="max-w-md mx-auto bg-slate-700 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-center text-white mb-2">🎉 Congrats!</h2>
          <p className="text-center text-slate-400 mb-6">Quiz completed successfully</p>

          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-orange-500">{score}</div>
            <div className="text-slate-400">/ {total * 4}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-600 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{percentage.toFixed(1)}%</div>
              <div className="text-slate-400 text-sm">Score</div>
            </div>
            <div className="bg-slate-600 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${isPass ? 'text-green-500' : 'text-red-500'}`}>
                {isPass ? 'PASS' : 'FAIL'}
              </div>
              <div className="text-slate-400 text-sm">Status</div>
            </div>
          </div>

          <div className="bg-slate-600 rounded-xl p-4 mb-6">
            <div className="flex justify-between text-slate-300">
              <span>Time Used:</span>
              <span className="text-white">{Math.floor(timeUsed / 60)}m {timeUsed % 60}s</span>
            </div>
            <div className="flex justify-between text-slate-300 mt-2">
              <span>Correct Answers:</span>
              <span className="text-white">{correctCount} / {total}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-slate-600 text-white py-3 rounded-xl font-semibold hover:bg-slate-500"
            >
              Retake
            </button>
            <button
              onClick={() => navigate('/results')}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600"
            >
              Review
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show history
  return (
    <div className="min-h-screen bg-slate-800 p-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Test History</h2>
        
        {results.length === 0 ? (
          <div className="bg-slate-700 rounded-xl p-8 text-center text-slate-400">
            No tests taken yet
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="bg-slate-700 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white font-medium">{result.score} / {result.total * 4}</div>
                    <div className="text-slate-400 text-sm">{result.percentage.toFixed(1)}%</div>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-sm ${
                    result.percentage >= 50 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {result.percentage >= 50 ? 'PASS' : 'FAIL'}
                  </div>
                </div>
                <div className="mt-2 text-slate-400 text-xs">
                  {new Date(result.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}