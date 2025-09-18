class API::ExerciseSetsController < ApplicationController
  skip_before_action :verify_authenticity_token # For development environment. Remove in production.
  before_action :authenticate_user!
  before_action :set_exercise

  def update
    set = @exercise.exercise_sets.find_or_initialize_by(set_number: params[:id])

    if set.update(exercise_set_params)
      head :ok
    else
      Rails.logger.info "Validation errors: #{set.errors.full_messages}" 
      render json: { errors: set.errors.full_messages }, status: :unprocessable_content
    end
  end

  private

  def set_exercise
    workout = current_user.workouts.find_by(
      id: params[:workout_id],
      mesocycle_id: params[:mesocycle_id]
    )
    return head :forbidden unless workout

    @exercise = workout.exercises.find_by(id: params[:exercise_id])
    return head :forbidden unless @exercise
  end
  
  def exercise_set_params
    params.expect(
      exercise_set: [:weight, :rep_count, :completed, :set_number]
    )
  end
end