import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const subjects = ['English', 'Economics', 'Government', 'CRK']
const years = ['2022', '2023', '2024', '2025']

export default function Home() {
  const navigate = useNavigate()
  const [selectedSubjects, setSelectedSubjects] = useState({
    English: '2022',
    Economics: '2022',
    Government: '2022',
    CRK: '2022'
  })

  const handleSubjectChange = (subject, year) => {
    setSelectedSubjects(prev => ({ ...prev, [subject]: year }))
  }

  const handleStartTest = () => {
    const selections = Object.entries(selectedSubjects)
    navigate('/quiz', { state: { selections } })
  }

  const allSelected = Object.values(selectedSubjects).every(y => y)

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">UI Post-UTME</h1>
        <p className="text-slate-400 text-sm">Select your subjects and year</p>
      </div>

      <div className="space-y-4">
        {subjects.map(subject => (
          <div key={subject} className="bg-slate-700 rounded-xl p-4">
            <label className="text-white font-medium block mb-2">{subject}</label>
            <select
              value={selectedSubjects[subject]}
              onChange={(e) => handleSubjectChange(subject, e.target.value)}
              className="w-full bg-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        onClick={handleStartTest}
        disabled={!allSelected}
        className="w-full mt-8 bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start Test
      </button>

      <div className="mt-4 text-center text-slate-500 text-xs">
        Developed by George
      </div>
    </div>
  )
}