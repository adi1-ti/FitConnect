
import { supabase } from './supabase'

// Fetch activities belonging to the logged-in student
export async function getActivities() {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('activity_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map((a) => ({
    id: a.id,
    type: a.activity_type,
    duration: a.duration_minutes,
    distance: Number(a.distance_km || 0),
    date: a.activity_date,
    points: a.points,
    steps: a.steps
  }))
}

// Save a new activity
export async function saveActivity(activity) {
  // Get the currently authenticated user
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError) throw userError

  if (!user) {
    throw new Error('Please log in before saving an activity.')
  }

  const { data, error } = await supabase
    .from('activities')
    .insert({
      user_id: user.id,
      activity_type: activity.type,
      duration_minutes: Number(activity.duration),
      distance_km: Number(activity.distance || 0),
      activity_date: activity.date,
      points: Number(activity.points),
      steps: Number(activity.steps || 0)
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    type: data.activity_type,
    duration: data.duration_minutes,
    distance: Number(data.distance_km || 0),
    date: data.activity_date,
    points: data.points,
    steps: data.steps
  }
}

// Delete an activity
export async function deleteActivity(id) {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id)

  if (error) throw error
}
