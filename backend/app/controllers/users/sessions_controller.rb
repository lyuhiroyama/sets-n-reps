# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json

  # Skip CSRF check (because we're using httpOnly cookies, which prevent external sites from accessing the token anyways)
  skip_before_action :verify_authenticity_token, only: [:create, :destroy, :check_auth]

  # Disable Devise's flash message feature by overriding it to do nothing
  def set_flash_message(key, kind, options = {})
  end

  # Checks user authentication status
  def check_auth
    if current_user_from_token
      render json: { isAuthenticated: true }, status: :ok
    else
      render json: { 
        isAuthenticated: false,
        message: "Unauthorized: You are not signed in."
        }, status: :unauthorized
    end
  end

  protected

  # Runs after successful sign-in. Signs in user by setting httpOnly auth token cookie.
  # Purpose: To override Devise's session-based sign-in.
  def respond_with(resource, _opts = {})
    # Ensure user has a token
    resource.generate_auth_token if resource.auth_token.blank?
    resource.save! if resource.changed?

    # Set httpOnly cookie
    cookies[:auth_token] = {
      value: resource.auth_token,
      httponly: true,
      secure: Rails.env.production?,  # false in dev
      same_site: :lax
    }

    render json: { user: resource, message: "signed in successfully" }, status: :ok
  end

  # Runs after sign-out. Signs user out by deleting httpOnly auth token cookie.
  # Putpose: To override Devise's session-based sign-out.
  def respond_to_on_destroy
    cookies.delete(:auth_token, httpOnly: true)
    render json: { message: "Sign-out successful"}, status: :ok
  end

  # Helper. Returns currently authenticated user based on httpOnly auth token cookie.
  # Purpose: To override Devise's session-based sign-out.
  def current_user_from_token
    token = cookies[:auth_token]
    if token.present?
      User.find_by(auth_token: token)
    end
  end

end
