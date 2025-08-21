Rails.application.routes.draw do
  devise_for :users
  get "up" => "rails/health#show", as: :rails_health_check
  namespace :api do
    resources :workouts, only: [ :index, :show, :create ]
  end
end
