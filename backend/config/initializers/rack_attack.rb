if Rails.env.production?
  class Rack::Attack
    # Throttle sign-in attempts per IP
    throttle("logins/ip", limit: 5, period: 20.seconds) { |req| req.post? && req.path == "/users/sign_in" && req.ip }
    # Throttle sign-up attempts per IP
    throttle("signups/ip", limit: 3, period: 1.minute)  { |req| req.post? && req.path == "/users" && req.ip }
  end
end
