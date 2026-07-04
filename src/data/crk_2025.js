export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `CRK 2025 Question ${i + 1}: According to Genesis, who built the ark?`,
  options: ["Abraham", "Moses", "Noah", "Adam"],
  correctAnswer: i % 4,
  explanation: `Noah built the ark.`
}))