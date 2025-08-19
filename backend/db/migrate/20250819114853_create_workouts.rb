class CreateWorkouts < ActiveRecord::Migration[8.0]
  def change
    create_table :workouts do |t|
      t.text :notes
      t.date :performed_on

      t.timestamps
    end
  end
end
