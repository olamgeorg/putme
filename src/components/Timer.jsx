import { useEffect, useState } from 'react'

export default function Timer({ timeLeft }) {
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    setIsWarning(timeLeft <= 300)
  }, [timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className={`font-mono text-xl font-bold ${isWarning ? 'text-red-500' : 'text-orange-500'}`}>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  )
}