class AddWeekNumberToWorkouts < ActiveRecord::Migration[8.0]
  def change
    add_column :workouts, :week_number, :integer
  end
end
