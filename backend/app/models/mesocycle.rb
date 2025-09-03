class Mesocycle < ApplicationRecord
  belongs_to :user
  has_many :workouts, dependent: :destroy

  accepts_nested_attributes_for :workouts

  validates :name, :duration_weeks, presence: true
end
