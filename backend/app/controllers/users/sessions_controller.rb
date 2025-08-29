# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json

  # Disable Devise's flash message feature by overriding it to do nothing
  def set_flash_message(key, kind, options = {})
  end

  # Checks user authentication status
  def check_auth
    if current_user
      render json: { isAuthenticated: true }, status: :ok
    else
      render json: { isAuthenticated: false }, status: :unauthorized
    end
  end

  protected

  # Runs after successful sign-in
  def respond_with(resource, _opts = {})
    render json: { user: resource, message: "signed in successfully"}, status: :ok
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
