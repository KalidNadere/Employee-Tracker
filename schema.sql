DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

-- Create Department table
CREATE TABLE Departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Create Role table
CREATE TABLE Roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES Departments(id)
);

-- Create Employee table
CREATE TABLE Employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES Roles(id),
  FOREIGN KEY (manager_id) REFERENCES Employees(id)
);

