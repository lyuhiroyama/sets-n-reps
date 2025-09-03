class Workout < ApplicationRecord
  belongs_to :user
  belongs_to :mesocycle
  has_many :exercises, dependent: :destroy

  accepts_nested_attributes_for :exercises
end
