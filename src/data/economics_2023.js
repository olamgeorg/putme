export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `Economics 2023 Question ${i + 1}: Which of these is NOT a factor of production?`,
  options: ["Land", "Labor", "Capital", "Currency"],
  correctAnswer: i % 4,
  explanation: `Land, labor, and capital are factors of production. Currency is not.`
}))