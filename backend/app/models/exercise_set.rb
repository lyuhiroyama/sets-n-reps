class ExerciseSet < ApplicationRecord
  validates :set_number, :weight, :rep_count, presence: true
  belongs_to :exercise
end
