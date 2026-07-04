export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `Economics 2025 Question ${i + 1}: Inflation is best described as:`,
  options: [
    "Increase in general price level",
    "Decrease in general price level",
    "Increase in wages",
    "Decrease in production"
  ],
  correctAnswer: i % 4,
  explanation: `Inflation is a sustained increase in general price levels.`
}))