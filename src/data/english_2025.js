export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `English 2025 Question ${i + 1}: Select the correct sentence structure.`,
  options: [
    "She is going to market.",
    "She going to market.",
    "She is go to market.",
    "She are going to market."
  ],
  correctAnswer: i % 4,
  explanation: `Tests sentence structure and grammar.`
}))