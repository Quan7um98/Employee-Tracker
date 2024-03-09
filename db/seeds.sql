USE employeet_db;

INSERT INTO department (name) VALUES ('Legal'), ('Sales');

INSERT INTO role (title, salary, department_id) VALUES ('Sales Manager', 1000, 2), ('Me', 2000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Isaac', 'Peck', 2, NULL), ('Ragnar', 'Peck', 1, 1);