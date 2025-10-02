class AddWeightAutoFillToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :weight_auto_fill, :boolean, default: true, null: false
  end
end
