class AddCompletedExerciseSets < ActiveRecord::Migration[8.0]
  def change
    add_column :exercise_sets, :completed, :boolean, null: false, default: false
  end
end
