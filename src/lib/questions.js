import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getQuestions(subject) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('subject', subject)
    .limit(40)
  
  if (error) {
    console.error('Error fetching questions:', error)
    return []
  }
  
  return data.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation || '',
    subject: q.subject
  }))
}
