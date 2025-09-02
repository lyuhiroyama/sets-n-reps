class CreateMesocycles < ActiveRecord::Migration[8.0]
  def change
    create_table :mesocycles do |t|
      t.string :name
      t.integer :duration_weeks
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
