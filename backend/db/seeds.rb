# Test user
user = User.create!(
  email: "lyu@gmail.com",
  password: "gohornets"
)

# Create a meso
mesocycle = user.mesocycles.create!(
  name: "Actual Workout",
  duration_weeks: 4
)

# Days we train each week
workout_dows = %w[Monday Tuesday Wednesday Thursday Friday Saturday]

# Create workouts for every week, assigning each to the user
workouts = []
(1..mesocycle.duration_weeks).each do |wk|
  workout_dows.each do |dow|
    workouts << mesocycle.workouts.create!(
      day_of_week: dow,
      week_number: wk,
      user: user
    )
  end
end

# Create exercises for each workout based on day-of-week
push_exercises = ["Seated Chest Press Machine", "Seated Shoulder Press Machine"]
pull_exercises = ["Assisted Pull-ups", "Seated Hammer Row Machine"]
leg_exercises  = ["Barbell Deadlift", "Cable Tricep Pushdowns (Bar)"]

workouts.each do |w|
  case w.day_of_week
  when "Monday", "Thursday"
    w.exercises.create!(push_exercises.map { |name| { name: name } })
  when "Tuesday", "Friday"
    w.exercises.create!(pull_exercises.map { |name| { name: name } })
  when "Wednesday", "Saturday"
    w.exercises.create!(leg_exercises.map  { |name| { name: name } })
  end
end

puts "Seed data created successfully"