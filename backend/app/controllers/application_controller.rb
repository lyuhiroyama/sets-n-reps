class ApplicationController < ActionController::Base
  # Skip origin check for JSON requests in development environment
  protect_from_forgery with: :exception, unless: -> { 
    Rails.env.development? && request.headers["Origin"] == "http://localhost:3001"
  }
end
