
import { supabase } from './supabase'

// Register a new student
export async function registerUser(name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name
      }
    }
  })

  if (error) throw error

  return data
}

// Login an existing student
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error

  return data
}

// Logout
export async function logoutUser() {
  const { error } = await supabase.auth.signOut()

  if (error) throw error
}
