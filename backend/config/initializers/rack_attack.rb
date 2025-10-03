if Rails.env.production?
  class Rack::Attack
    # Throttle sign-in attempts (10 attempts per 20 seconds)
    throttle("logins/ip", limit: 10, period: 20.seconds) { |req| req.post? && req.path == "/users/sign_in" && req.ip }
    # Throttle sign-up attempts (5 attempts per minute)
    throttle("signups/ip", limit: 5, period: 1.minute)  { |req| req.post? && req.path == "/users" && req.ip }
    # Throttle read operations that has 'api' namespaced endpoints (300 requests per 5 mins)
    throttle("authenticated_api/ip", limit: 300, period: 5.minutes) do |req|
      if req.path.start_with?("/api/") && req.env['warden'].authenticated?
        req.ip
      end
    end
    # Throttle write operations that has 'api' namespaced endpoints (300 requests per 5 mins)
    throttle("authenticated_api_writes/ip", limit: 300, period: 5.minutes) do |req|
      if req.path.start_with?("/api/") && req.env['warden'].authenticated? && !req.get?
        req.ip
      end
    end
  end
end
