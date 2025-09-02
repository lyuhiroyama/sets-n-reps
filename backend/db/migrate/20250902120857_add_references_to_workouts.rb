class AddReferencesToWorkouts < ActiveRecord::Migration[8.0]
  def change
    add_reference :workouts, :mesocycle, null: false, foreign_key: true
    add_reference :workouts, :user, null: false, foreign_key: true
  end
end
