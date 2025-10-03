# [Sets-n-Reps](https://sets-n-reps.com)                                                                                                                                                                                                                                                                                                                    

Sets-n-Reps is a browser-based workout tracker designed for both desktop and mobile.
It essentially offers three key features:
- Mesocycle creation: Build mesocycles of your choice (between 4-8 weeks), with each week automatically reflecting its target RIRs (Reps in Reserve).
- Workout tracking: Choose a workout from the drop-down menu and log your data (weight, reps, and checkbox).
- Exercise history look-back: Quickly review past performance for any exercise across previous workouts or mesocycles.

## Technologies

- [Ruby](https://www.ruby-lang.org/en/) & [Ruby on Rails](https://rubyonrails.org/) for the back-end
- [TypeScript](https://www.typescriptlang.org/) & [React](https://react.dev/) for the front-end
- [CSS Modules](https://github.com/css-modules/css-modules) for styles
- [PostgreSQL](https://www.postgresql.org/) for the DB
- [Vultr VPS](https://www.vultr.com/) for hosting

## Tables

**mesocycles**
- id: integer
- name: string
- duration_weeks: integer
- user_id: integer [indexed foreign key for users]
- ........................................................
- belongs_to: user
- has_many: workouts

**workouts**
- id: integer
- notes: text
- performed_on: date
- mesocycle_id: integer [indexed foreign key for mesocycles] 
- user_id: integer [indexed foreign key for users]
- created_at: datetime
- updated_at: datetime
- ........................................................
- belongs_to: user 
- belongs_to: mesocycle
- has_many: exercises

**exercises**
- id: integer
- name: string
- notes: text
- workout_id: integer [indexed foreign key for workouts]
- created_at: datetime
- updated_at: datetime
- ........................................................
- belongs_to: workout
- has_many: exercise_sets

**exercise_sets**
- id: integer
- set_number: integer
- weight: decimal
- rir: integer
- rep_count: integer
- exercise_id: [indexed foreign key for exercises]
- created_at: datetime
- updated_at: datetime
- ........................................................
- belongs_to: exercise

**users**
- id: integer
- email: string
- encrypted_password: string
- reset_password_token: string
- reset_password_sent_at: datetime
- remember_created_at: datetime
- created_at: datetime
- updated_at: datetime
- ........................................................
- has_many: mesocycles