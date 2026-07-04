export default function QuestionPalette({ total, currentIndex, answers, markedForReview, onSelect }) {
  return (
    <div className="bg-slate-700 rounded-xl p-4 mb-4 max-h-48 overflow-y-auto">
      <div className="grid grid-cols-8 gap-2">
        {Array.from({ length: total }, (_, i) => {
          let bgColor = 'bg-slate-600'
          if (i === currentIndex) bgColor = 'bg-orange-500'
          else if (markedForReview[i + 1]) bgColor = 'bg-yellow-500'
          else if (answers[i + 1] !== undefined) bgColor = 'bg-green-500'
          
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`w-10 h-10 rounded-lg text-sm font-medium hover:opacity-80 transition ${bgColor} text-white`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
      <div className="flex justify-center gap-4 mt-3 text-xs text-slate-400">
        <span><span className="inline-block w-3 h-3 bg-orange-500 rounded mr-1"></span> Current</span>
        <span><span className="inline-block w-3 h-3 bg-green-500 rounded mr-1"></span> Answered</span>
        <span><span className="inline-block w-3 h-3 bg-yellow-500 rounded mr-1"></span> Review</span>
        <span><span className="inline-block w-3 h-3 bg-slate-600 rounded mr-1"></span> Unanswered</span>
      </div>
    </div>
  )
}