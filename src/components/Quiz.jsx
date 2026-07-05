import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getQuestions } from '../lib/questions'
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
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showPalette, setShowPalette] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [questionsLoaded, setQuestionsLoaded] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!selections || Object.keys(selections).length === 0) {
      navigate('/')
      return
    }

    const loadQuestions = async () => {
      setLoading(true)
      setError(null)
      setQuestionsLoaded(0)
      
      try {
        const allQuestions = []
        const subjectKeys = Object.keys(selections)
        
        // Load questions for each subject/year combination
        for (const subject of subjectKeys) {
          const year = selections[subject]
          
          try {
            const data = await getQuestions(subject, year)
            
            if (data && data.length > 0) {
              // Normalize the data to match the expected format
              const normalizedData = data.map((q, index) => {
                // Determine which option is correct based on correct_option field
                let correctAnswer = 0
                if (q.correct_option) {
                  const optionMap = {
                    'a': 0,
                    'b': 1,
                    'c': 2,
                    'd': 3
                  }
                  correctAnswer = optionMap[q.correct_option.toLowerCase()] || 0
                }
                
                return {
                  id: q.id || `q_${subject}_${year}_${index}`,
                  question: q.question_text || q.question || 'Question not available',
                  options: [
                    q.option_a || '',
                    q.option_b || '',
                    q.option_c || '',
                    q.option_d || ''
                  ].filter(opt => opt && opt.trim() !== ''),
                  correctAnswer: correctAnswer,
                  explanation: q.explanation || 'No explanation available'
                }
              })
              
              allQuestions.push(...normalizedData)
              setQuestionsLoaded(prev => prev + data.length)
            } else {
              console.warn(`No questions found for ${subject} ${year}`)
            }
          } catch (err) {
            console.error(`Error loading ${subject} ${year}:`, err)
            setError(`Failed to load questions for ${subject} ${year}: ${err.message}`)
          }
        }
        
        if (allQuestions.length === 0) {
          setError('No questions could be loaded. Please try different subject/year selections.')
        } else {
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
    if (isSubmitted) return
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
  }

  const toggleMarkForReview = (questionId) => {
    if (isSubmitted) return
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
    const score = correct * 4 // Each question is worth 4 marks
    const percentage = (correct / total) * 100
    const timeUsed = 3600 - timeLeft

    // Save results to Supabase
    try {
      const { supabase } = await import('../lib/supabase')
      
      const subjectsObj = {}
      Object.entries(selections).forEach(([subject, year]) => {
        subjectsObj[subject] = parseInt(year)
      })

      const { error: insertError } = await supabase
        .from('test_results')
        .insert({
          user_id: user.id,
          subjects_json: subjectsObj,
          score: score,
          total: total,
          percentage: percentage,
          time_used: timeUsed
        })

      if (insertError) {
        console.error('Error saving results:', insertError)
      }
    } catch (err) {
      console.error('Error saving results:', err)
    }

    navigate('/results', { 
      state: { 
        score, 
        total, 
        percentage, 
        timeUsed,
        questions, 
        answers, 
        markedForReview 
      } 
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 text-white p-4">
        <div className="text-2xl font-bold mb-4">Loading Questions...</div>
        {questionsLoaded > 0 && (
          <div className="text-slate-400 text-sm mb-4">
            Loaded {questionsLoaded} questions so far
          </div>
        )}
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="mt-4 text-slate-400 text-sm">
          Please wait while we prepare your test
        </div>
        {Object.keys(selections).length > 0 && (
          <div className="mt-6 text-slate-500 text-xs">
            Selected: {Object.entries(selections).map(([subject, year]) => `${subject} ${year}`).join(', ')}
          </div>
        )}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 text-white p-4">
        <div className="text-3xl text-red-500 mb-4">⚠️ Error</div>
        <div className="text-slate-300 text-center max-w-md mb-6">
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
        >
          Go Back Home
        </button>
      </div>
    )
  }

  // No questions state
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 text-white p-4">
        <div className="text-3xl mb-4">📚</div>
        <div className="text-2xl font-bold mb-4">No Questions Available</div>
        <div className="text-slate-300 text-center max-w-md mb-6">
          No questions found for your selected subjects and years. Please try different selections.
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
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
              className="bg-slate-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-600 transition"
            >
              {showPalette ? 'Hide' : 'Show'} Palette
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitted ? 'Submitting...' : 'Submit'}
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

        <div className="mt-4 flex justify-between text-slate-400 text-sm">
          <span>Questions Loaded: {questions.length}</span>
          <span>Total Marks: {questions.length * 4}</span>
          <span>Time Remaining: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s</span>
        </div>
      </div>
    </div>
  )
}
