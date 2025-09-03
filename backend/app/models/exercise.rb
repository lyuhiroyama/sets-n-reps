class Exercise < ApplicationRecord
  validates :name, presence: true
  belongs_to :workout
  has_many :exercise_sets, dependent: :destroy
  accepts_nested_attributes_for :exercise_sets
end
