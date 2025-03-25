-- CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin_password';
-- GRANT ALL PRIVILEGES ON * . * TO 'admin'@'localhost';
-- FLUSH PRIVILEGES;

-- USER CREATION

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('John Smith', 'jsmith@gmail.com', 'jsmithiscool123', 'jsmith', 'jsmithpw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('Will Smith', 'wsmith@gmail.com', 'wsmithiscool123', 'wsmith', 'wsmithpw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('Micheal Scott', 'dmifflin@gmail.com', 'theoffice', 'dmifflin', 'dmifflinpw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('Sponge Bob', 'sbob@gmail.com', 'pineapple', 'sbob', 'sbobpw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('Pat Rick', 'pat@gmail.com', 'appdev', 'pat', 'patpw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('Bob Ross', 'bross@hotmail.com', 'bobbyross', 'bross', 'brosspw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('User 1', 'u1@hotmail.com', 'u1', 'u1', 'u1pw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('User 2', 'u2@hotmail.com', 'u2', 'u2', 'u2pw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('User 3', 'u3@hotmail.com', 'u3', 'u3', 'u3pw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('User 4', 'u4@hotmail.com', 'u4', 'u4', 'u4pw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('User 5', 'u5@hotmail.com', 'u5', 'u5', 'u5pw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('User 6', 'u6@hotmail.com', 'u6', 'u6', 'u6pw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('User 7', 'u7@hotmail.com', 'u7', 'u7', 'u7pw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword) 
--     VALUES ('User 8', 'u8@hotmail.com', 'u8', 'u8', 'u8pw');

-- INSERT INTO Users(name, email, pass, webgoatusername, webgoatpassword )
--     VALUES ('User 9', 'u9@hotmail.com', 'u9', 'u9', 'u9pw');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('John Smith', 'jsmith@gmail.com', 'jsmithiscool123');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('Will Smith', 'wsmith@gmail.com', 'wsmithiscool123');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('Micheal Scott', 'dmifflin@gmail.com', 'theoffice');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('Sponge Bob', 'sbob@gmail.com', 'pineapple');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('Pat Rick', 'pat@gmail.com', 'appdev');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('Bob Ross', 'bross@hotmail.com', 'bobbyross');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('User 1', 'u1@hotmail.com', 'u1');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('User 2', 'u2@hotmail.com', 'u2');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('User 3', 'u3@hotmail.com', 'u3');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('User 4', 'u4@hotmail.com', 'u4');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('User 5', 'u5@hotmail.com', 'u5');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('User 6', 'u6@hotmail.com', 'u6');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('User 7', 'u7@hotmail.com', 'u7');

-- -- INSERT INTO Users(name, email, pass) 
-- --     VALUES ('User 8', 'u8@hotmail.com', 'u8');

-- -- INSERT INTO Users(name, email, pass)
-- --     VALUES ('User 9', 'u9@hotmail.com', 'u9');

-- -- COURSES CREATION
-- INSERT INTO Courses(course_name)
--     VALUES ('CMSC216');

-- INSERT INTO Courses(course_name)
--     VALUES ('CMSC330');

-- INSERT INTO Courses(course_name)
--     VALUES ('CMSC351');

-- INSERT INTO Courses(course_name)
--     VALUES ('Math240');

-- -- Assignments Creation

-- INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
--     VALUES ('216 task 1', 2, 'puzzle box');

-- INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
--     VALUES ('216 project 2', 2, 'nelsons shellito');

-- INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
--     VALUES ('330 project 1', 3, 'lexer parser interpreter');

-- INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
--     VALUES ('330 project 2', 3, 'optimizer');

-- INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
--     VALUES ('330 project 3', 3, 'microcaml');

-- INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
--     VALUES ('330 project 4', 3, 'rust project');

-- INSERT INTO Assignments (assignment_name, course_id, webgoat_info)
--     VALUES ('351 exam', 4, 'graphs and trees');
