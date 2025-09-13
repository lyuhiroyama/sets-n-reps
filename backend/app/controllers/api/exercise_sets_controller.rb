class API::ExerciseSetsController < ApplicationController
  # For development env. Remove in production:
  skip_before_action :verify_authenticity_token 

  before_action :authenticate_user!

  def update
    exercise = Exercise.find(params[:exercise_id])
    set = exercise.exercise_sets.find_or_initialize_by(
      exercise_id: params[:exercise_id],
        set_number: params[:id]
      )

    if set.update(exercise_set_params)
      head :ok
    else
      Rails.logger.info "Validation errors: #{set.errors.full_messages}" 
      render json: { errors: set.errors.full_messages }, status: :unprocessable_content
    end
  end

  private
  
  def exercise_set_params
    params.expect(
      exercise_set: [:weight, :rep_count, :completed, :set_number]
    )
  end
end