
workout = Workout.create!(notes: "", performed_on: Date.today)
exercise = workout.exercises.create!(name: "Assisted Pull-up", notes: "Stretch lats on eccentric")
exercise.exercise_sets.create!(set_number: 1, weight: 26, rep_count: 10, rir: 0)
exercise.exercise_sets.create!(set_number: 2, weight: 26, rep_count: 8, rir: 0)
