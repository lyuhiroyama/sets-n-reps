class RemoveAuthTokenFromUsers < ActiveRecord::Migration[8.0]
  def change
    remove_index :users, :auth_token
    remove_column :users, :auth_token, :string
  end
end
