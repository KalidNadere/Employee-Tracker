-- Department data
INSERT INTO Department (name)
VALUES
('HR'),
('Finance'),
('Sales'),
('Engineering'),
('Tech'),
('Legal');

-- Role data
INSERT INTO Role (title, salary, department_id)
VALUES
('Manager', 70000, 1),
('Accountant', 95000, 2),
('Sales Lead', 85000, 3),
('Engineer', 90000, 4),
('Software Engineer', 105000, 5),
('Barrister', 110000, 6);

-- Employee data
INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 1, 1),
('Michael', 'Johnson', 3, 1),
('Alec', 'Baldwin', 4, 3),
('Tom', 'Cruise', 5, 1),
('Al', 'Pacino', 6, 3),
('Jean', 'Claude', 3, 1);