class API::MesocyclesController < ApplicationController
  # For development env. Remove in production:
  skip_before_action :verify_authenticity_token 

  before_action :authenticate_user!

  def index
    mesocycles = current_user.mesocycles.order(created_at: :desc)
    render json: mesocycles, status: :ok
  end

  def create
    mesocycle = current_user.mesocycles.build(mesocycle_params)

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
        workouts_attributes: [
          :day_of_week,
          exercises_attributes: [ :name ]
        ]
      ]
    )
  end
end