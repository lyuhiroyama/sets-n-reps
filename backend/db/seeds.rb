# Test user
user = User.create!(
  email: "lebron@example.com",
  password: "lebronjames"
)

# Create a meso
mesocycle = user.mesocycles.create!(
  name: "Push Pull Legs",
  duration_weeks: 4
)

# Create workouts
workouts = [
  { name: "Push Day", day_of_week: "Monday" },
  { name: "Pull Day", day_of_week: "Wednesday" },
  { name: "Legs Day", day_of_week: "Friday" }
].map do |workout_data|
  mesocycle.workouts.create!(
    day_of_week: workout_data[:day_of_week],
    week_number: 1,
    user: user
  )
end

# Create exercises for each workout
push_exercises = ["Bench Press", "Overhead Press", "Tricep Extension"]
pull_exercises = ["Barbell Row", "Pull-ups", "Bicep Curl"]
leg_exercises = ["Squat", "Romanian Deadlift", "Leg Press"]

workouts[0].exercises.create!(push_exercises.map { |name| { name: name } })
workouts[1].exercises.create!(pull_exercises.map { |name| { name: name } })
workouts[2].exercises.create!(leg_exercises.map { |name| { name: name } })

puts "Seed data created successfully"