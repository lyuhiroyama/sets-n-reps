class Exercise < ApplicationRecord
  belongs_to :workout
  has_many :exercise_sets
  accepts_nested_attributes_for :exercise_sets
end
