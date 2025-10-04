# [Sets-n-Reps](https://sets-n-reps.com)                                                                      

[Sets-n-Reps](https://sets-n-reps.com) is a browser-based workout tracker designed for both desktop and mobile.

It offers three key features:

**(1) Mesocycle Creation ([demo]())**
- Build [mesocycles](https://youtu.be/DVYcnQF0PJg?t=21) of your choice (between 4-8 weeks), <br/>with each week automatically reflecting its target RIRs ([Reps in Reserve](https://rpstrength.com/blogs/video-guides/how-to-estimate-reps-in-reserve-for-muscle-growth?srsltid=AfmBOopJY6eLMhTDjRUhlJBqIOhVTBMk8ebFSj5RpzcKdDZINWDI-gFl#:~:text=Getting%20stronger%20isn%E2%80%99t%20just%20about%20moving%20more%20weight%E2%80%94it%E2%80%99s%20about%20knowing%20when%20to%20stop.%20One%20of%20the%20most%20effective%20strategies%20for%20growth%20without%20burning%20out%20is%20using%20Reps%20In%20Reserve%20(RIR).
)).

**(2) Workout tracking ([demo]())**
- Choose a workout from the drop-down menu and log your data (weight, reps, and checkbox).

**(3) Exercise history look-back ([demo]())**
- Quickly review past performance for any exercise across previous workouts or mesocycles.

## Table of Contents

- [Technologies](#technologies)
- [Full Demo](#full-demo)
- [Features](#features)
- [Technical Overview](#technical-overview)
- [Installation](#installation)
- [Challenges & Learning Points](#challenges--learning-points)
- [License](#license)

## Technologies

- [TypeScript](https://www.typescriptlang.org/) & [React](https://react.dev/) for the front-end
- [Ruby](https://www.ruby-lang.org/en/) & [Ruby on Rails](https://rubyonrails.org/) for the back-end
- [CSS Modules](https://github.com/css-modules/css-modules) for styles
- [PostgreSQL](https://www.postgresql.org/) for the DB
- [Vultr VPS](https://www.vultr.com/) for hosting

## Full Demo

## Features

#### (1) Mesocycle Creation
- Create customized mesocycles ranging from 4-8 weeks
- Automatic RIR (Reps in Reserve) progression system:
  - Starts at an RIR based on mesocycle length (e.g., 4-week mesocycle starts at 2 RIR)
  - Progressively decreases RIR each week until the deload week
  - Final week is automatically set as a deload week (0 RIR)
- Each exercise contains 5 sets by default
#### (2) Workout Tracking
- Workout picker drop-down with visual status indicators:
  - Completed workouts (green)
  - Currently active workouts (red)
  - Uncompleted workouts (uncolored)
- Track key metrics for each set:
  - Weight (e.g. 12kg)
  - Reps (e.g. 20 reps)
  - Set completion status (e.g. ✅)
- Weight auto-fill feature (optional):
    - Entering a weight automatically fills subsequent sets with the same value
    - Can be disabled in settings page
#### (3) Exercise history look-back
- View and compare performance with previous workouts or mesocycles via a dialog showing:
  - Weights used
  - Reps performed
  - When it was performed (mesocycle name & week #)

## Technical Overview

#### Frontend architecture
- TypeScript for type safety
- React for component-based architecture
- RESTful requests (GET, POST, PATCH, DELETE) from the front-end
- Sends httpOnly cookies along with requests by setting `credentials: "include"`
    - Prevents JavaScript from reading the cookie, reducing risk from XSS attacks
- Scoped styling with CSS modules
- Responsive design for mobile devices
- Internationalization with i18n library
- Icons with Font Awesome icons
#### Backend architecture
- Ruby on Rails API backend
- RESTful API design with namespaced endpoints using `/api/`
- Auto-save with immediate PATCH requests on input
- PostgreSQL database with table relationships:
  - `users → mesocycles → workouts → exercises → exercise_sets`
  - *Some relationships are not strictly linear:
    - `users -> workouts`
    - `users → mesocycles` via `active_meso_id` (custom foreign key for tracking the active mesocycle)
- Nested attributes for updating multiple table records at once
#### Authentication & Security
- Devise for user authentication
- Rate limiting with rack-attack gem's `throttle()`:
  - 10 sign-in attempts per 20 seconds
  - 5 sign-up attempts per 60 seconds
  - 300 read operations per 5 minutes
  - 300 write operations per 5 minutes
- Configured CORS (Cross-Origin Resource Sharing) to:
  - Allow frontend to access API
  - Block requests from unauthorized domains
  - Enable sending of httpOnly cookies from the front-end with `credentails: true`

## Installation
First, ensure you have these installed:
- [Homebrew](https://brew.sh/)
- [rbenv](https://github.com/rbenv/rbenv) for Ruby version management
- [PostgreSQL](https://www.postgresql.org/) (`brew install postgresql@14`)
- [Yarn](https://yarnpkg.com/) (`npm install -g yarn`)

#### Then:
1. Clone the repository
   ```bash
   git clone https://github.com/lyuhiroyama/sets-n-reps.git
   cd sets-n-reps
   ```

2. Install Ruby 3.4.2
   ```bash
   rbenv install 3.4.2
   rbenv local 3.4.2
   # If 'ruby' command still points to another ruby version, do:
   # (for bash):
   echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
   echo 'eval "$(rbenv init - bash)"' >> ~/.bashrc
   source ~/.bashrc
   # (for zsh):
   echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.zshrc
   echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc
   source ~/.zshrc
   # Confirm ruby version is 3.4.2:
   ruby --version
   ```
3. Install Rails
   ```bash
   gem install rails
   ```
4. Install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) & node
   ```bash
   # nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
   # Reload shell configuration
   # (for bash):
   source ~/.bashrc
   # (for zsh):
   source ~/.zsh
   # Node v22.19.0
   nvm install 22.19.0
   ```

#### In backend directory:
```bash
cd backend
# Install ruby gems
bundle install
rbenv rehash

# Start PostgreSQL 
brew services start postgresql@14

# If you don't yet a PostgreSQL username created:
psql -U postgres -d postgres
CREATE ROLE your_user_name WITH LOGIN CREATEDB PASSWORD 'your_password';
# Export credentials temporarily (lasts duration of terminal session)
export DATABASE_USERNAME=your_user_name
export DATABASE_PASSWORD=your_password

# Creates, migrates, and seeds the database
rails db:setup
# Starts server at http://localhost:3000
rails s
```

#### In frontend directory:
```bash
cd frontend
yarn install   # Install dependencies defined in package.json & yarn.lock
yarn start     # Starts app at http://localhost:3001
```
## Challenges & Learning Points

## Improvements to be made

## License


