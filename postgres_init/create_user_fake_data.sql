-- CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin_password';
-- GRANT ALL PRIVILEGES ON * . * TO 'admin'@'localhost';
-- FLUSH PRIVILEGES;

-- USER CREATION

INSERT INTO Users(name, email, pass) 
    VALUES ('John Smith', 'jsmith@gmail.com', 'jsmithiscool123');

INSERT INTO Users(name, email, pass) 
    VALUES ('Will Smith', 'wsmith@gmail.com', 'wsmithiscool123');

INSERT INTO Users(name, email, pass) 
    VALUES ('Micheal Scott', 'dmifflin@gmail.com', 'theoffice');

INSERT INTO Users(name, email, pass) 
    VALUES ('Sponge Bob', 'sbob@gmail.com', 'pineapple');

INSERT INTO Users(name, email, pass) 
    VALUES ('Pat Rick', 'pat@gmail.com', 'appdev');

INSERT INTO Users(name, email, pass) 
    VALUES ('Bob Ross', 'bross@hotmail.com', 'bobbyross');

-- COURSES CREATION
INSERT INTO Courses(course_name)
    VALUES ('CMSC216');

INSERT INTO Courses(course_name)
    VALUES ('CMSC330');

INSERT INTO Courses(course_name)
    VALUES ('CMSC351');

INSERT INTO Courses(course_name)
    VALUES ('Math240');

-- Assignments Creation

INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
    VALUES ('216 task 1', 1, 'puzzle box');

INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
    VALUES ('216 project 2', 1, 'nelsons shellito');

INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
    VALUES ('330 project 1', 2, 'lexer parser interpreter');

INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
    VALUES ('330 project 2', 2, 'optimizer');

INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
    VALUES ('330 project 3', 2, 'microcaml');

INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
    VALUES ('330 project 4', 2, 'rust project');

INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
    VALUES ('351 exam', 3, 'graphs and trees');


-- User Courses


INSERT INTO User_Courses (user_id, course_id, course_status, due_date, assigned_date)
    VALUES (1, 1, 'Not Started', '2024-06-01', '2024-05-01');

INSERT INTO User_Courses (user_id, course_id, course_status, due_date, assigned_date)
    VALUES (1, 2, 'In Progress', '2024-08-01', '2024-01-01');

INSERT INTO User_Courses (user_id, course_id, course_status, due_date, assigned_date)
    VALUES (2, 3, 'Completed', '2024-05-01', '2024-01-07');

INSERT INTO User_Courses (user_id, course_id, course_status, due_date, assigned_date)
    VALUES (2, 4, 'In Progress', '2024-08-06', '2024-01-07');

INSERT INTO User_Courses (user_id, course_id, course_status, due_date, assigned_date)
    VALUES (3, 1, 'Not Started', '2024-04-01', '2024-01-07');

INSERT INTO User_Courses (user_id, course_id, course_status, due_date, assigned_date)
    VALUES (5, 2, 'Completed', '2024-04-01', '2024-01-07');

-- User Assignments

INSERT INTO User_Assignments (user_id, assignment_id, completed)
    VALUES (1, 3, TRUE);

INSERT INTO User_Assignments (user_id, assignment_id, completed)
    VALUES (1, 4, TRUE);

INSERT INTO User_Assignments (user_id, assignment_id, completed)
    VALUES (1, 5, FALSE);

INSERT INTO User_Assignments (user_id, assignment_id, completed)
    VALUES (2, 7, TRUE);

INSERT INTO User_Assignments (user_id, assignment_id, completed)
    VALUES (3, 1, TRUE);

INSERT INTO User_Assignments (user_id, assignment_id, completed)
    VALUES (3, 2, FALSE);


