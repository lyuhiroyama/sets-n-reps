class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :mesocycles, dependent: :destroy
  has_many :workouts, dependent: :destroy

  # Memo: “There is a column in the users table that stores the id of a Mesocycle record.”
  belongs_to :active_meso, class_name: "Mesocycle", optional: true
end
