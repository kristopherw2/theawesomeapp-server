CREATE TABLE exercises (
    exerciseId INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    exerciseName TEXT NOT NULL,
    sets TEXT NOT NULL,
    repetitions TEXT,
    exerciseweight INTEGER NOT NULL,
    time INTEGER NOT NULL,
    caloriesBurned INTEGER NOT NULL,
    workoutId INTEGER REFERENCES workouts(workoutId),
    userid INTEGER REFERENCES users(id)
);