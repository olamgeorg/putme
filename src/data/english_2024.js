export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `English 2024 Question ${i + 1}: Choose the most appropriate synonym for 'BENEVOLENT'.`,
  options: ["Kind", "Cruel", "Selfish", "Harsh"],
  correctAnswer: i % 4,
  explanation: `Tests vocabulary knowledge.`
}))