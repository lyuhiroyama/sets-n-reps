Rails.application.routes.draw do
  # CSRF token route:
  get "/csrf-token", to: "csrf#show"
  devise_for :users,
    controllers: {
      sessions: "users/sessions",
      registrations: "users/registrations",
    }
  devise_scope :user do 
    get "users/check-auth", to: "users/sessions#check_auth"
  end
  get "up" => "rails/health#show", as: :rails_health_check
  namespace :api do
    resources :workouts, only: [ :index, :show, :create ]
  end
end
