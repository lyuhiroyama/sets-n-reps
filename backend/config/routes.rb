Rails.application.routes.draw do
  # CSRF token route:
  get "/csrf-token", to: "csrf#show"
  devise_for :users,
    controllers: {
      sessions: "users/sessions",
      registrations: "users/registrations",
    }
  get "up" => "rails/health#show", as: :rails_health_check
  namespace :api do
    resources :workouts, only: [ :index, :show, :create ]
  end
end
