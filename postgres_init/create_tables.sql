CREATE TABLE Users (
    -- id SERIAL PRIMARY KEY,
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    pass VARCHAR(100) NOT NULL,
    emailVerified TIMESTAMP,
    image TEXT
);

CREATE TABLE Courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(100)
);

CREATE TYPE c_status AS ENUM ('Not Started', 'In Progess', 'Completed');

CREATE TABLE User_Courses (
    user_id int REFERENCES Users(id),
    course_id int REFERENCES Courses(course_id),
--    course_status ENUM('Not Started', 'In Progress', 'Completed'),
    course_status c_status,
    due_date Date,
    assigned_date DATE
);

CREATE TABLE Assignments (
    assignment_id SERIAL PRIMARY KEY,
    assignment_name VARCHAR(100),
    course_id int REFERENCES Courses(course_id),
    webgoat_info VARCHAR(200)
);

CREATE TABLE User_Assignments (
    user_id int REFERENCES Users(id),
    assignment_id int REFERENCES Assignments(assignment_id),
    completed BOOLEAN
);

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

CREATE TABLE Accounts (
    user_id 
)