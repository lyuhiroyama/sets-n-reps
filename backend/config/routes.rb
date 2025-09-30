Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Disable sign-ups in production environment:
  if Rails.env.production?
    devise_for :users, controllers: { sessions: "users/sessions" }, skip: [:registrations]
  else
    devise_for :users, controllers: { sessions: "users/sessions", registrations: "users/registrations" }
  end

  devise_scope :user do 
    get "users/check-auth", to: "users/sessions#check_auth"
  end
  namespace :api do
    resources :workouts, only: [ :index, :show, :create, :update ]

    resources :mesocycles, only: [ :index, :show, :create, :destroy ] do
      resources :workouts, only: [ :index, :show ] do
        resources :exercises, only: [] do
          resources :exercise_sets, only: [:update]
        end
      end
    end

    resource :user_preferences, only: [:update]
  end
end
