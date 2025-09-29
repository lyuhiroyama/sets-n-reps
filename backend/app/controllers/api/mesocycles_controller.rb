class API::MesocyclesController < ApplicationController
  # Memo: App doesn't send CSRF tokens from the frontend. When this changes, delete this line:
  skip_before_action :verify_authenticity_token
  
  before_action :authenticate_user!

  def index
    mesocycles = current_user.mesocycles

    if params[:exercise].present?
      mesocycles = mesocycles
        .joins(workouts: :exercises) # Join by associations: mesocycles → workouts → exercises
        .includes(workouts: { exercises: :exercise_sets }) # Include exercise_sets data
        .where(exercises: {name: params[:exercise]}) 
        .distinct # Ensure each mesocycle appears only once, even if multiple workouts/exercises match the filter
        .order(created_at: :desc)
    else
      mesocycles = current_user.mesocycles.order(created_at: :desc)
    end
    
    render json: mesocycles,
    include: { workouts: { include: { exercises: { include: :exercise_sets }}}},
    status: :ok
  end

  def show
    mesocycle = current_user
      .mesocycles
      .includes(workouts: { exercises: :exercise_sets })
      .find(params[:id])

    render json: 
      mesocycle,
      include: { workouts: { include: { exercises: { include: :exercise_sets }}}},
      status: :ok
  end

  def create
    mesocycle = current_user.mesocycles.build(mesocycle_params)
    mesocycle.workouts.each { |w| w.user = current_user }

    if mesocycle.save
      render json: mesocycle, status: :created
    else
      render json: { errors: mesocycle.errors.full_messages }, status: :unprocessable_content
    end
  end

  private

  def mesocycle_params
    params.expect(
      mesocycle: [
        :name,
        :duration_weeks,
        workouts_attributes: [[
          :day_of_week,
          :week_number,
          exercises_attributes: [[ 
            :name,
            exercise_sets_attributes: [[ :set_number, :rir ]]
          ]]
        ]]
      ]
    )
  end
end