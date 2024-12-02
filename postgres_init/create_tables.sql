CREATE TABLE Users (
    -- id SERIAL PRIMARY KEY,
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    pass VARCHAR(255) NOT NULL,
    emailVerified TIMESTAMP,
    image TEXT,
    webgoatusername VARCHAR(45) NOT NULL UNIQUE,
    webgoatpassword VARCHAR(10) NOT NULL
);

CREATE TABLE Courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(255)
);

CREATE TYPE c_status AS ENUM ('Not Started', 'In Progress', 'Completed');

CREATE TABLE User_Courses (
    user_course_id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES Users(id),
    course_id int REFERENCES Courses(course_id),
    course_status c_status,
    due_date DATE,
    assigned_date DATE
);

CREATE TABLE Assignments (
    assignment_id SERIAL PRIMARY KEY,
    assignment_name VARCHAR(255),
    course_id int REFERENCES Courses(course_id),
    webgoat_info VARCHAR(255)
);

CREATE TABLE User_Assignments (
    user_assignment_id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES Users(id),
    assignment_id int REFERENCES Assignments(assignment_id),
    completed BOOLEAN
);

CREATE TABLE Accounts (
    userId TEXT REFERENCES Users(id) NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    providerAccountId TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INT,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT
);

INSERT INTO Courses(course_name) VALUES ('NONE COURSE');
INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
    VALUES ('Admin', 'admin@mitre.com', 'changeme', 'adminn', 'changeme');
