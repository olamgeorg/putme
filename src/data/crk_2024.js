export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `CRK 2024 Question ${i + 1}: Who is the author of the first gospel?`,
  options: ["Matthew", "Mark", "Luke", "John"],
  correctAnswer: i % 4,
  explanation: `Matthew is the first gospel.`
}))