# Sets-n-Reps

- A workout tracker web app.

## Technologies

- Ruby on Rails for the back-end
- React & TypeScript for the front-end
- PostgreSQL for the DB
- VPS for hosting

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