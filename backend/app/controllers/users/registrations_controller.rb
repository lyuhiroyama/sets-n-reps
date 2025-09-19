# # frozen_string_literal: true
class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json
  
  # Memo: App doesn't send CSRF tokens from the frontend. When this changes, delete this line:
  skip_before_action :verify_authenticity_token
  

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: { id: resource.id, email: resource.email }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_content
    end
  end
end
