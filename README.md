# [Sets-n-Reps](https://sets-n-reps.com)                                                                                                                                                                                                                                                                                                                    

[Sets-n-Reps](https://sets-n-reps.com) is a browser-based workout tracker designed for both desktop and mobile.
It offers three key features:

**(1) Mesocycle Creation**
- Build mesocycles of your choice (between 4-8 weeks), with each week automatically reflecting its target RIRs (Reps in Reserve).

**(2) Workout tracking**
- Choose a workout from the drop-down menu and log your data (weight, reps, and checkbox).

**(3) Exercise history look-back**
- Quickly review past performance for any exercise across previous workouts or mesocycles.

## Table of Contents

- [Technologies](#technologies)
- [Demo](#demo)
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

## Demo

## Features

#### (1) Mesocycle Creation
- Create customized mesocycles ranging from 4-8 weeks
- Automatic RIR (Reps in Reserve) progression system:
  - Starts at an RIR based on mesocycle length (e.g., 4-week meso starts at 2 RIR)
  - Progressively decreases RIR each week until the deload week
  - Final week is automatically set as a deload week
- Each exercise contains 5 sets by default
#### (2) Workout Tracking
- Workout picker drop-down with visual status indicators:
  - Completed workouts
  - Currently active workouts
  - Uncompleted workouts
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
    - Prevents JavaScript from reading the cookie, reducing risk from XSS attacks.
- Scoped styling with CSS modules
- Responsive design for mobile devices
- Internationalization with i18n library
- Font Awesome icons for UI elements
#### Backend architecture
- Ruby on Rails API backend
- RESTful API design with namespaced endpoints using `/api/`
- Auto-save with immediate PATCH requests on input changes
- PostgreSQL database with table relationships:
  - `users → mesocycles → workouts → exercises → exercise_sets`
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

## Challenges & Learning Points

## License