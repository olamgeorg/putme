export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `Government 2023 Question ${i + 1}: Which arm of government interprets laws?`,
  options: ["Executive", "Legislative", "Judicial", "Administrative"],
  correctAnswer: i % 4,
  explanation: `The Judiciary interprets laws.`
}))