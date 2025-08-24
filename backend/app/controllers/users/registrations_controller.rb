# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  # Disable Devise's flash message feature by overriding it to do nothing
  def set_flash_message(key, kind, options = {})
  end
  
  private

  # Customize sign-up parameters to un-require password confirmation
  def sign_up_params
    params.expect(user: [:email, :password])
  end

  # Runs when a user signs up
  def respond_with(resource, _opts = {}) 
    if resource.persisted?
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
