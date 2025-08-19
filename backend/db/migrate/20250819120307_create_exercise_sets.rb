class CreateExerciseSets < ActiveRecord::Migration[8.0]
  def change
    create_table :exercise_sets do |t|
      t.integer :set_number
      t.decimal :weight
      t.integer :rir
      t.integer :rep_count
      t.references :exercise, null: false, foreign_key: true

      t.timestamps
    end
  end
end
