CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    pass VARCHAR(100)
);

CREATE TABLE Courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(100)
);

CREATE TYPE c_status AS ENUM ('Not Started', 'In Progress', 'Completed');

CREATE TABLE User_Courses (
    user_course_id SERIAL PRIMARY KEY,
    user_id int REFERENCES Users(user_id),
    course_id int REFERENCES Courses(course_id),
--    course_status ENUM('Not Started', 'In Progress', 'Completed'),
    course_status c_status,
    due_date DATE,
    assigned_date DATE
);

CREATE TABLE Assignments (
    assignment_id SERIAL PRIMARY KEY,
    assignment_name VARCHAR(100),
    course_id int REFERENCES Courses(course_id),
    webgoat_info VARCHAR(200)
);

CREATE TABLE User_Assignments (
    user_assignment_id SERIAL PRIMARY KEY,
    user_id int REFERENCES Users(user_id),
    assignment_id int REFERENCES Assignments(assignment_id),
    completed BOOLEAN
);
