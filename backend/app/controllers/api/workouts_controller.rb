class API::WorkoutsController < ApplicationController
  def index
    workouts = Workout.includes(exercises: :exercise_sets).all
    render json: workouts, include: { exercises: { include: :exercise_sets } }
  end

  def show
    workout = Workout.find(params[:id])
    render json: workout, include: { exercises: { include: :exercise_sets } }
  end

  def create
    workout = Workout.new(workout_params)
    if workout.save
      render json: workout
    else
      render json: { errors: workout.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def workout_params
    params.expect(
      workout: [ :notes, :performed_on, exercises_attributes: [ [
        :name, :notes, exercise_sets_attributes: [ [
          :set_number, :weight, :rir, :rep_count
          ] ]
        ] ]
      ]
    )
  end
end
