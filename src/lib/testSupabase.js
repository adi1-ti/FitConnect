import { supabase } from './supabase'

async function testConnection() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Connection failed:', error.message)
    return
  }

  console.log('Supabase connected successfully!')
  console.log('Current session:', data.session)
}

testConnection()