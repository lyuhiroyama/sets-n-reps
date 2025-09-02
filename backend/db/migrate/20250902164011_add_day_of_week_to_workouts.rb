class AddDayOfWeekToWorkouts < ActiveRecord::Migration[8.0]
  def change
    add_column :workouts, :day_of_week, :string
  end
end
