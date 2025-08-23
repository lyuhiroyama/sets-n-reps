# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json
  
  private

  # Runs when a user signs up
  def respond_with(resource, _opts = {}) 
    if resource.persisted?
      render json: { user: resource, message: "Signed up successfully" }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Runs when a user account is deleted
  def respond_to_on_destroy
    head :no_content # Return HTTP 204 no content response
  end
end
