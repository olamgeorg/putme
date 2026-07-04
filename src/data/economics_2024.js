export const QUESTIONS = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  question: `Economics 2024 Question ${i + 1}: What does GDP stand for?`,
  options: [
    "Gross Domestic Product",
    "General Development Plan",
    "Global Demand Price",
    "Gross Development Program"
  ],
  correctAnswer: i % 4,
  explanation: `GDP means Gross Domestic Product.`
}))