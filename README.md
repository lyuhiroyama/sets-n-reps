# Sets-n-reps

- A workout tracker web app.
<br>
## Technologies
- Ruby on Rails for the back-end
- React & TypeScript for the front-end
- PostgreSQL for the DB
- VPS for hosting

# Tables

(Table: **workouts**)
- id: integer
- notes: text
- performed_on: date
- created_at: datetime
- updated_at: datetime
- ........................................................
- has_many: exercises

(Table: **exercises**)
- id: integer
- name: string
- notes: text
- workout_id: integer [indexed foreign key for workouts]
- created_at: datetime
- updated_at: datetime
- ........................................................
- belongs_to: workout
- has_many: sets

(Table: **sets**)
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