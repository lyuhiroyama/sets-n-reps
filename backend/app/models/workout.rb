class Workout < ApplicationRecord
  validates :performed_on, presence: true
  has_many :exercises
  accepts_nested_attributes_for :exercises
end
