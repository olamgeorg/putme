import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getQuestions(subject, year) {
  let query = supabase
    .from('questions')
    .select('*')
    .eq('subject', subject.toUpperCase())
    .limit(40)
  
  if (year && year !== 'random') {
    query = query.eq('year', Number(year))
  }
  
  const { data, error } = await query
  
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
    subject: q.subject,
    year: q.year
  }))
}
