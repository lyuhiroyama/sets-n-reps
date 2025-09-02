class Mesocycle < ApplicationRecord
  belongs_to :user
  has_many :workouts
end
