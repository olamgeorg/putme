import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { useEffect } from 'react'

export default function QuestionCard({
  question,
  index,
  total,
  selectedAnswer,
  markedForReview,
  onAnswer,
  onMarkForReview,
  onNext,
  onPrev
}) {
  if (!question) return null

  const handleOptionClick = (optionIndex) => {
    if (selectedAnswer !== undefined) return // Prevent changing answer
    onAnswer(question.id, optionIndex)
    
    // Play sound based on correctness
    const isCorrect = optionIndex === question.correctAnswer
    const audio = new Audio(isCorrect ? '/correct.mp3' : '/wrong.mp3')
    audio.play().catch(() => {})
  }

  const getOptionClass = (optionIndex) => {
    if (selectedAnswer === undefined) {
      return 'bg-slate-700 hover:bg-slate-600'
    }
    if (optionIndex === question.correctAnswer) {
      return 'bg-green-600 border-green-400'
    }
    if (selectedAnswer === optionIndex && selectedAnswer !== question.correctAnswer) {
      return 'bg-red-600 border-red-400'
    }
    return 'bg-slate-700 opacity-60'
  }

  const getOptionIcon = (optionIndex) => {
    if (selectedAnswer === undefined) return null
    if (optionIndex === question.correctAnswer) {
      return <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
    }
    if (selectedAnswer === optionIndex && selectedAnswer !== question.correctAnswer) {
      return <XCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
    }
    return null
  }

  return (
    <div className="bg-slate-700 rounded-xl p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
        <span className="text-slate-400 text-sm whitespace-nowrap">
          Question {index + 1} of {total}
        </span>
        <button
          onClick={() => onMarkForReview(question.id)}
          className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${
            markedForReview ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-600 text-slate-300'
          }`}
        >
          {markedForReview ? '★ Marked' : '☆ Mark for Review'}
        </button>
      </div>

      <h3 className="text-white text-base sm:text-lg mb-6 break-words whitespace-normal">
        {question.question}
      </h3>

      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(idx)}
            className={`w-full p-3 sm:p-4 rounded-lg text-left flex items-start gap-3 transition ${getOptionClass(idx)} overflow-hidden`}
            disabled={selectedAnswer !== undefined}
          >
            <span className="text-white text-sm sm:text-base break-words whitespace-normal flex-1 min-w-0">
              {option}
            </span>
            {getOptionIcon(idx)}
          </button>
        ))}
      </div>

      {selectedAnswer !== undefined && question.explanation && (
        <div className="mt-4 p-4 bg-slate-600 rounded-lg overflow-hidden">
          <p className="text-slate-300 text-sm break-words whitespace-normal">
            {question.explanation}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-between mt-6">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="px-4 sm:px-6 py-2 bg-slate-600 text-white rounded-lg disabled:opacity-50 hover:bg-slate-500 text-sm sm:text-base flex-1 sm:flex-none min-w-[80px]"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={index === total - 1}
          className="px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 hover:bg-orange-600 text-sm sm:text-base flex-1 sm:flex-none min-w-[80px]"
        >
          Next
        </button>
      </div>
    </div>
  )
}