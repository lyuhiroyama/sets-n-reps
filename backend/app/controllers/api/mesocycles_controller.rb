class API::MesocyclesController < ApplicationController
  # For development env. Remove in production:
  skip_before_action :verify_authenticity_token 

  before_action :authenticate_user!

  def index
    mesocycles = current_user.mesocycles.order(created_at: :desc)
    render json: mesocycles, status: :ok
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