# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_09_19_182817) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "exercise_sets", force: :cascade do |t|
    t.integer "set_number"
    t.decimal "weight"
    t.integer "rir"
    t.integer "rep_count"
    t.bigint "exercise_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "completed", default: false, null: false
    t.index ["exercise_id"], name: "index_exercise_sets_on_exercise_id"
  end

  create_table "exercises", force: :cascade do |t|
    t.string "name"
    t.text "notes"
    t.bigint "workout_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["workout_id"], name: "index_exercises_on_workout_id"
  end

  create_table "mesocycles", force: :cascade do |t|
    t.string "name"
    t.integer "duration_weeks", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_mesocycles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "active_meso_id"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.index ["active_meso_id"], name: "index_users_on_active_meso_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  create_table "workouts", force: :cascade do |t|
    t.text "notes"
    t.date "performed_on"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "mesocycle_id", null: false
    t.bigint "user_id", null: false
    t.string "day_of_week"
    t.integer "week_number"
    t.index ["mesocycle_id"], name: "index_workouts_on_mesocycle_id"
    t.index ["user_id"], name: "index_workouts_on_user_id"
  end

  add_foreign_key "exercise_sets", "exercises"
  add_foreign_key "exercises", "workouts"
  add_foreign_key "mesocycles", "users"
  add_foreign_key "users", "mesocycles", column: "active_meso_id", on_delete: :nullify
  add_foreign_key "workouts", "mesocycles"
  add_foreign_key "workouts", "users"
end
