Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  devise_for :users,
    controllers: {
      sessions: "users/sessions",
      registrations: "users/registrations",
    }
  devise_scope :user do 
    get "users/check-auth", to: "users/sessions#check_auth"
  end
  namespace :api do
    resources :workouts, only: [ :index, :show, :create ]

    resources :mesocycles, only: [ :index, :show, :create ] do
      resources :workouts, only: [ :index, :show ] do
        resources :exercises, only: [] do
          resources :exercise_sets, only: [:update]
        end
      end
    end
  end
end
