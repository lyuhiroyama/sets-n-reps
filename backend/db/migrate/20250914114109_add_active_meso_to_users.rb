class AddActiveMesoToUsers < ActiveRecord::Migration[8.0]
  def change
    add_reference :users, :active_meso, index: true, null: true
    add_foreign_key :users, :mesocycles, column: :active_meso_id, on_delete: :nullify
  end
end
