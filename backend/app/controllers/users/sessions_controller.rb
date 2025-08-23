# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  # Runs after successful sign-in
  def respond_with(resource, _opts = {})
    render json: { user: resource, message: "signed in successfully"}, status: ok
  end

  # Runs after sign-out
  def respond_to_on_destroy
    if current_user
      render json: { message: "signed out successfully"}, status: :ok
    else
      render json: { message: "No active session" }, status: :unauthorized
    end
  end

end
