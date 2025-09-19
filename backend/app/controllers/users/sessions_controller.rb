# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json
  skip_before_action :verify_authenticity_token

  def respond_with(resource, _opts = {})
    render json: { id: resource.id, email: resource.email }, status: :ok
  end

  def respond_to_on_destroy
    head :no_content
  end

  def set_flash_message(key, kind, options = {})
  end

  # Checks user authentication status
  def check_auth
    if current_user
      render json: {
         isAuthenticated: true, 
         user: current_user.slice(:id, :email, :created_at, :active_meso_id)
      }
    else
      render json: { isAuthenticated: false }
    end
  end
end
