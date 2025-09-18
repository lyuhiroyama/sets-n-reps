class API::WorkoutsController < ApplicationController
  before_action :authenticate_user!

  def index
    workouts = current_user.workouts.includes(exercises: :exercise_sets)
    render json: workouts, include: { exercises: { include: :exercise_sets } }
  end

  def show
    workout = current_user.workouts.find(params[:id])
    render json: workout, include: { exercises: { include: :exercise_sets } }
  end

  def create
    workout = current_user.workouts.new(workout_params)
    if workout.save
      render json: workout
    else
      render json: { errors: workout.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    workout = current_user.workouts.find(params[:id])
    if workout.update(workout_params)
      head :ok
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
