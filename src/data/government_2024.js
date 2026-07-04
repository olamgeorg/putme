export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `Government 2024 Question ${i + 1}: The principle of separation of powers was advocated by:`,
  options: ["Montesquieu", "Locke", "Hobbes", "Rousseau"],
  correctAnswer: i % 4,
  explanation: `Montesquieu advocated for separation of powers.`
}))