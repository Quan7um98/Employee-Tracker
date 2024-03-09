const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: "employeet_db"
}, console.log('Connected to the employee database')
);

const inquirer = require("inquirer")

function start(){

    inquirer.prompt([
        {
            type: "list",
            name: "userChoice",
            message: "What would you like to do?",
            choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee"]
        }
    ]).then(function (results){
        // console.log(results)
    
        switch (results.userChoice) {
            case 'view all departments':
                viewAllDepartments()
                break;
            case 'view all roles':
                viewAllRoles()
                break;
            case 'view all employees':
                viewAllEmployees()
                break;
            case 'add a department':
                addNewDepartment()
                break;
            // case 'add a role':
            //     addNewRole()
            //     break;
            case 'add an employee':
                addNewEmployee()
                break;
            
            default:
                break;
        }
    });
}

start()


function viewAllDepartments(){
    db.query("SELECT * FROM department", (error, results)=>{
        if(error){
            throw error
        }
        console.log("List of all deparments")
        console.table(results)
        start()
    });
}

function viewAllRoles(){
    //job title, role id, the department that role belongs to, and the salary for that role
    db.query("SELECT role.title, role.id, department.name AS department_name, role.salary FROM role JOIN department ON role.department_id = department.id;", (error, results)=>{
        if(error){
            throw error
        }
        console.log("List of all roles")
        console.table(results)
        start()
    });
}

function viewAllEmployees(){
    // employee ids, first names, last names, job titles, departments, salaries, and managers
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;", (error, results)=>{
        if(error){
            throw error
        }
        console.log("List of all employees")
        console.table(results)
        start()
    });
}

function addNewDepartment(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What department are you adding?'
        }
    ]).then((answers)=> {
        console.log(answers);
        db.query(`INSERT INTO department (name) VALUES ('${answers.addDepartment}')`)
        start()
    });
}

// function addNewRole(){
//     const newRole = {}
//     inquirer.prompt([
//         {
//             type: 'input',
//             name: 'addRole',
//             message: 'What role are you adding?'
//         },
//         {
//             type: 'input',
//             name:  'addSalary',
//             message: 'What is the salary for this role?'
//         }
//     ]).then((answers)=> {
//         console.log(answers)
//         newRole.addRole = answers.addRole;
//         newRole.addSalary = answers.addSalary;
//         db.query('SELECT id, name FROM department', (err, results) => {
//             if (err) throw err;
//             const departments = results.map(department => ({
//                 name: department.name,
//                 value: department.id
//             }));
//             inquirer.prompt([
//                 {
//                     type: 'list',
//                     name: 'newDepartment',
//                     message: 'What department is this role in?',
//                     choices: departments
//                 }
//             ])
//         })
//     }).then((answers)=> {
//         console.log(answers);
//        newRole.newDepartment= answers.newDepartment;
//         db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${newRole.addRole}', '${newRole.addSalary}', '${newRole.newDepartment}')`)
//         start()
//     });
// }

function addNewEmployee(){
    const newEmployee = {}
    inquirer.prompt([
        {
            type: 'input',
            name:  'addFirst',
            message: 'What is the employees first name?'
        },
        {
            type: 'input',
            name:  'addLast',
            message: 'What is the employees last name?'
        }
    ]).then((answers)=> {
    //    console.log(answers)
       newEmployee.addFirst= answers.addFirst;
       newEmployee.addLast= answers.addLast;
        db.query('SELECT id, title FROM role', (err, results) => {
            if (err) throw err;
            const roles = results.map(role => ({
                name:  role.title,
                value: role.id
            }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'newRole',
                    message: 'Which role does this employee belong to?',
                    choices: roles
                }
            ]).then((answers)=> {
                // console.log(answers)
                newEmployee.newRole = answers.newRole;
                db.query('SELECT id, first_name, last_name FROM employee', (err, results) => {
                    if (err) throw err;
                    const manager = results.map(employee => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    }));
                    manager.unshift({
                        name: "None",
                        value: null
                    })
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'newManger',
                            message: 'Who is this employees manager, if any?',
                            choices: manager
                        }
                    ]).then((answers)=> {
                        // console.log(answers)
                        newEmployee.newManager = answers.newManger;
                        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('${newEmployee.addFirst}', '${newEmployee.addLast}', '${newEmployee.newRole}', ${newEmployee.newManager})`)
                        start();
                    })
                })
            })
        })
    })
};
