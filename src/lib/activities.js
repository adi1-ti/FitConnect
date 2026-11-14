
import { supabase } from './supabase'

// Fetch activities belonging to the logged-in student
export async function getActivities() {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('activity_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error

  return data.map((a) => ({
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
  const { data, error } = await supabase
    .from('activities')
    .insert({
      activity_type: activity.type,
      duration_minutes: activity.duration,
      distance_km: activity.distance,
      activity_date: activity.date,
      points: activity.points,
      steps: activity.steps
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
