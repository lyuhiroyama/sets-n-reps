# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  # Skip CSRF check (because we're using httpOnly cookies, which prevent external sites from accessing the token anyways)
  skip_before_action :verify_authenticity_token, only: [:create, :destroy, :check_auth]  

  # Disable Devise's flash message feature by overriding it to do nothing
  def set_flash_message(key, kind, options = {})
  end

  # Override Dvise's #create, to generate httpOnly auth token on sign-up
  def create
    build_resource(sign_up_params)

    resource.generate_auth_token if resource.auth_token.blank?
    resource.save!

    respond_with(resource)
  end
  
  private

  # Customize sign-up parameters to un-require password confirmation
  def sign_up_params
    params.expect(user: [:email, :password])
  end

  # Runs when a user signs up
  def respond_with(resource, _opts = {}) 
    if resource.persisted?

      resource.generate_auth_token if resource.auth_token.blank?
      resource.save! if resource.changed?

      cookies[:auth_token] = {
        value: resource.auth_token,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax
      }

      render json: { user: resource, message: "Signed up successfully" }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_content
    end
  end

  # Runs when a user account is deleted
  def respond_to_on_destroy
    head :no_content # Return HTTP 204 no content response
  end
end
