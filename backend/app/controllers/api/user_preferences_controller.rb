class API::UserPreferencesController < ApplicationController
  # Memo: App doesn't send CSRF tokens from the frontend. When this changes, delete this line:
  skip_before_action :verify_authenticity_token
  
  before_action :authenticate_user!

  def update
    if current_user.update(user_preferences_params)
      head :ok
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_content
    end
  end

  private

  def user_preferences_params
    params.expect(user_preferences: [:active_meso_id])
  end
end