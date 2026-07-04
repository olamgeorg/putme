export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `English 2023 Question ${i + 1}: Identify the correctly spelt word.`,
  options: ["Achieve", "Acheive", "Acheeve", "Achiev"],
  correctAnswer: i % 4,
  explanation: `This tests spelling rules in English.`
}))