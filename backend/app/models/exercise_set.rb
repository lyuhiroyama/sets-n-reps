class ExerciseSet < ApplicationRecord
  validates :set_number, presence: true
  belongs_to :exercise
end
