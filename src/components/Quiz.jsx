import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import QuestionCard from './QuestionCard'
import QuestionPalette from './QuestionPalette'
import Timer from './Timer'

export default function Quiz() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { selections } = location.state || {}
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [markedForReview, setMarkedForReview] = useState({})
  const [timeLeft, setTimeLeft] = useState(3600)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showPalette, setShowPalette] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!selections) {
      navigate('/')
      return
    }

    const loadQuestions = async () => {
      setLoading(true)
      setError(null)
      const allQuestions = []
      
      try {
        // Fetch questions for each subject/year combination
        for (const [subject, year] of Object.entries(selections)) {
          console.log(`Fetching questions for ${subject} ${year}`)
          
          // Cast year to integer for Supabase query
          const yearInt = parseInt(year)
          
          const { data, error: supabaseError } = await supabase
            .from('questions')
            .select('*')
            .eq('subject', subject)
            .eq('year', yearInt)

          if (supabaseError) {
            console.error(`Supabase error for ${subject} ${year}:`, supabaseError)
            setError(`Failed to load ${subject} ${year}: ${supabaseError.message}`)
            continue
          }

          if (!data || data.length === 0) {
            console.warn(`No questions found for ${subject} ${year}`)
            setError(`No questions found for ${subject} ${year}`)
            continue
          }

          console.log(`Found ${data.length} questions for ${subject} ${year}`)

          // Normalize each question to ensure it has an options array
          const normalizedData = data.map((q, index) => {
            // If options jsonb column exists and has data, use it
            let options = q.options || []
            
            // If options is empty or not an array, build from option_a, option_b, option_c, option_d
            if (!Array.isArray(options) || options.length === 0) {
              options = [
                q.option_a || '',
                q.option_b || '',
                q.option_c || '',
                q.option_d || ''
              ].filter(opt => opt && opt.trim() !== '')
            }

            // Find correct answer index
            let correctAnswer = 0
            const answerText = q.answer || ''
            if (answerText) {
              const answerIndex = options.findIndex(opt => 
                opt.toLowerCase().trim() === answerText.toLowerCase().trim()
              )
              if (answerIndex !== -1) correctAnswer = answerIndex
            }

            return {
              id: q.id || `q_${subject}_${year}_${index}`,
              question: q.question || 'Question not available',
              options: options,
              correctAnswer: correctAnswer,
              explanation: q.explanation || 'No explanation available'
            }
          })

          allQuestions.push(...normalizedData)
        }

        if (allQuestions.length === 0) {
          setError('No questions could be loaded. Please try again with different selections.')
        } else {
          console.log(`Total questions loaded: ${allQuestions.length}`)
          setQuestions(allQuestions)
        }
      } catch (err) {
        console.error('Error loading questions:', err)
        setError(`Failed to load questions: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [selections, navigate])

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
  }

  const toggleMarkForReview = (questionId) => {
    setMarkedForReview(prev => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const handleSubmit = async () => {
    if (isSubmitted) return
    setIsSubmitted(true)
    clearInterval(timerRef.current)

    let correct = 0
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++
    })

    const total = questions.length
    const score = correct * 4
    const percentage = (correct / total) * 100

    const subjectsObj = {}
    Object.entries(selections).forEach(([subject, year]) => {
      subjectsObj[subject] = parseInt(year)
    })

    try {
      const { error: insertError } = await supabase
        .from('test_results')
        .insert({
          user_id: user.id,
          subjects_json: subjectsObj,
          score: score,
          total: total,
          percentage: percentage,
          time_used: 3600 - timeLeft
        })

      if (insertError) {
        console.error('Error saving results:', insertError)
      }
    } catch (err) {
      console.error('Error saving results:', err)
    }

    navigate('/results', { state: { 
      score, total, percentage, timeUsed: 3600 - timeLeft,
      questions, answers, markedForReview
    }})
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-800 text-white">
        <div className="text-2xl mb-4">Loading questions...</div>
        <div className="text-slate-400 text-sm">Please wait while we prepare your test</div>
        <div className="mt-4 w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-800 text-white p-4">
        <div className="text-2xl text-red-500 mb-4">⚠️ Error</div>
        <div className="text-slate-300 text-center max-w-md mb-6">{error}</div>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600"
        >
          Go Back Home
        </button>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-800 text-white p-4">
        <div className="text-2xl mb-4">No Questions Available</div>
        <div className="text-slate-300 text-center max-w-md mb-6">
          No questions found for your selected subjects and years. Please try different selections.
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600"
        >
          Go Back Home
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen bg-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Timer timeLeft={timeLeft} />
          <div className="flex gap-2">
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-600"
            >
              {showPalette ? 'Hide' : 'Show'} Palette
            </button>
            <button
              onClick={handleSubmit}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600"
            >
              Submit
            </button>
          </div>
        </div>

        {showPalette && (
          <QuestionPalette
            total={questions.length}
            currentIndex={currentIndex}
            answers={answers}
            markedForReview={markedForReview}
            onSelect={setCurrentIndex}
          />
        )}

        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          total={questions.length}
          selectedAnswer={answers[currentQuestion.id]}
          markedForReview={markedForReview[currentQuestion.id]}
          onAnswer={handleAnswer}
          onMarkForReview={toggleMarkForReview}
          onNext={() => setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1))}
          onPrev={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
        />
      </div>
    </div>
  )
}