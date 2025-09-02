class Workout < ApplicationRecord
  validates :performed_on, presence: true
  belongs_to :user
  belongs_to :mesocycle
  has_many :exercises
  accepts_nested_attributes_for :exercises
end
