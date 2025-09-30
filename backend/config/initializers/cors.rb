Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Fetch env variable. If unset -> default to localhost
    origins ENV.fetch('CORS_ORIGIN') {'http://localhost:3001'}


    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true # To allow cookies to be sent/received
  end
end
