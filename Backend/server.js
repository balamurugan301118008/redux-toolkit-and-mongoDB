import express from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import _ from 'lodash';
import bodyParser from "body-parser"

const PORT = 5051;
// import cookieParser from "cookie-parser";
const salt = 10;
const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
}));

// While using cookie storage we used cookieParser
// app.use(cookieParser());
app.use(bodyParser.json());


//DataBase connection with MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "dckap",
    password: "Dckap2023Ecommerce",
    database: 'adminUsers'
});
// Storing new user data in Database
app.post('/userRegister', (req, res) => {
    const exists = "SELECT * FROM users WHERE email = ?"
    const sql = "INSERT INTO users (`user_name`,`email`,`password`) VALUES(?)";
    db.query(exists, [req.body.email], (err, data) => {
        if (err) throw err;
        else if (data.length > 0) {
            return res.json({ Error: "Email already exists" })
        }
        else {
            bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
                if (err) return res.json({ Error: "Error for hashing password" });
                const values = [
                    req.body.name,
                    req.body.email,
                    hash
                ];
                db.query(sql, [values], (err, result) => {
                    if (err) return res.json({ Error: "Inserting datas in server" })
                    else {
                        return res.json({ Status: "Success" })
                    }
                })
            })
        }
    })

})


// Admin or Manager Register
app.post('/adminOrManagerRegister', (req, res) => {
    const exists = "SELECT * FROM adminManager WHERE email = ?";
    const sql = "INSERT INTO adminManager (`name`,`role`,`email`,`password`) VALUES(?)";
    db.query(exists, [req.body.email], (err, data) => {
        if (err) throw err;
        else if (data.length > 0) {
            return res.json({ Error: "Email id already exists" })
        }
        else {
            bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
                if (err) return res.json({ Error: "Error for hashing password" });
                const values = [
                    req.body.name,
                    req.body.role,
                    req.body.email,
                    hash
                ]; db.query(sql, [values], (err, result) => {
                    if (err) return res.json({ Error: "Inserting admin data is error" });
                    else {
                        return res.json({ Status: "Success" })
                    }
                })

            })
        }
    })
})

// User login
app.post('/userLogin', (req, res) => {
    const sql = 'SELECT * from users where email = ?'
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            return res.json({ Error: 'Login error in server' })
        }
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: 'password compare error' })
                if (response) {
                    const name = data[0].user_name;
                    const id = data[0].id;
                    const token = jwt.sign({ name, id }, 'jwt-secret-key', { expiresIn: '1d' });
                    return res.json({ Status: 'Success', user_id: id, user_name: name, token: token, })
                }
                else {
                    return res.json({ Error: 'Password not matched' })
                }
            })
        } else {
            return res.json({ Error: 'No email existed' })
        }
    })
})

// Admin or Manager Login
app.post('/adminOrManagerLogin', (req, res) => {
    const sql = 'SELECT * FROM adminManager WHERE email = ?';
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            return res.json({ Error: "Login error" })
        }
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password compare error" })
                if (response) {
                    const name = data[0].name;
                    const id = data[0].id;
                    const role = data[0].role;
                    const token = jwt.sign({ name, id }, 'jwt-secret-key', { expiresIn: '1d' });
                    return res.json({ Status: 'Success', name: name, id: id, token: token, role: role })
                }
                else {
                    return res.json({ Error: 'Password not matched' })
                }
            })
        }
        else {
            return res.json({ Error: 'No email existed' })
        }
    })
})

/*After generating the token. The token is decoded here and storing in req. When we call the
verifyUser function we the get Data of an User or Manager or Admin by calling this function; */
const verifyUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : "auth header error";
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    }
    else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                res.json({ Error: "your token has been expired now" })
            }
            else {
                req.name = decoded.name;
                req.id = decoded.id;
                req.role = decoded.role;
                next();
            }
        });
    }
}

// After Logged in user can add task [Inserting tasks]
app.post('/userHome', verifyUser, (req, res) => {
    // console.log(req.body.total_days);
    const userId = req.id;
    const sql = "INSERT INTO userTasks (`task_name`,`description`,`status`,`deadline_start`,`deadline_end`,`total_days`,`user_id`) VALUES(?)";
    const values = [
        req.body.taskName,
        req.body.description,
        req.body.status,
        req.body.deadline.startDate,
        req.body.deadline.endDate,
        req.body.total_days,
        userId,
    ];
    db.query(sql, [values], (err, data) => {
        if (err) return res.json({ Error: "Task adding error" });
        return res.json({ data, Status: "Success", });
    })
})

// User viewing their task;
app.get('/userHome', verifyUser, (req, res) => {
    const sql = `SELECT * FROM userTasks where user_id = ${req.id}`;
    db.query(sql, (err, data) => {
        if (err) return res.json({ Error: "Fetch Failure in userhome router" })
        else {
            return res.json({ data, Status: "Success", user_name: req.name, id: req.id });
        }
    })
})

// Showing manager list for the admin after clicking the manager list
app.get('/managerList', (req, res) => {
    const sql = `SELECT * FROM adminManager WHERE role = 'Manager'`;
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({ Error: "Fetch Manager Failed" });
        }
        else {
            return res.json({ data, Status: "Success" });
        }
    })
})

// Assiging user for a manager
app.post('/adminHome/managerList', (req, res) => {
    const exists = `SELECT * FROM assignedUsers WHERE manager_id= ${req.body.managerId} and user_id = ${req.body.userId}`;
    const sql = "INSERT INTO assignedUsers (`manager_id`,`user_id`) VALUES(?)";

    db.query(exists, (err, data) => {

        if (err) throw err;
        if (data.length === 0) {
            const values = [
                req.body.managerId,
                req.body.userId
            ];
            db.query(sql, [values], (err, data) => {
                if (err) throw err;
                else {
                    return res.json({ data, Status: "Success" })
                }
            })
        }
        else {
            return res.json({ Error: "Already Assigned" });
        }

    })
})

// Admin Homepage
app.get('/adminHome', verifyUser, (req, res) => {
    // if (req.name) {
    return res.json({ Status: "Success", name: req.name, id: req.id });
    // }
    // else {
    //     return res.json({ Error: "user name not found" });
    // }
})

// Manager Home page 
app.get('/managerHome', verifyUser, (req, res) => {
    // console.log(req)
    const sql = `SELECT * FROM assignedUsers LEFT JOIN users ON assignedUsers.user_id = users.id WHERE manager_id = ?`
    db.query(sql, [req.id], (err, data) => {
        if (err) {
            return res.json({ Error: "Fetching assigned users error" });
        }
        else {
            return res.json({ data, Status: "Success", name: req.name, id: req.id });
        }
    })
})

// Manager view for users task and stopping the manager who are not assigned to the manager 
app.get('/managerHome/viewTasks/:id', verifyUser, (req, res) => {
    const managerId = req.id;
    const userId = req.params.id;

    const exists = `SELECT * FROM assignedUsers WHERE manager_id = ${managerId} AND user_id = ${userId}`;
    const sql = `SELECT * FROM userTasks WHERE user_id = ${userId}`;

    db.query(exists, (err, data) => {
        if (err) throw err;
        else if (data.length == 0) {
            return res.json({ Error: "You are not authenticated to view this user task" });
        }
        else {
            db.query(sql, (err, data) => {
                if (err) {
                    throw err;
                }
                else {
                    return res.json({ data, Status: "Success" });
                }
            })
        }

    })
})

// Admin viewing users list after clicking users list btn
app.get('/adminHome/usersList', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({ Error: 'Can not fetch the user lists' })
        }
        else {
            return res.json({ data, Status: "Success" });
        }
    })
})

// Admin view task of the specified user
app.get('/adminHome/usersList/viewTasks/:user_id', (req, res) => {
    const userId = req.params.user_id
    const sql = `SELECT * FROM userTasks WHERE user_id = ${userId}`;
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({ Error: "Users fetch failure" });
        }
        else {
            return res.json({ data, Status: "Success" });
        }
    })
})

// Specific user list to the assigned manager
app.get('/usersList/:id', (req, res) => {

    const managerId = req.params.id;
    const assignedUsers = `SELECT * FROM assignedUsers inner join users on assignedUsers.user_id = users.id WHERE assignedUsers.manager_id = ${managerId}`
    const sql = "SELECT * FROM users";

    db.query(assignedUsers, (wrong, right) => {
        if (wrong) throw wrong;
        else {
            // console.log(right)

            db.query(sql, (err, data) => {
                if (err) {
                    return res.json({ Error: "Users fetch failure" });
                }
                else {

                    let Matchresult = data.filter(o1 => right.some(o2 => o1.id === o2.user_id));

                    Matchresult = Matchresult.map(t => ({ ...t, status: true }))

                    let UnMatchresult = _.differenceWith(data, right, (o1, o2) => o1['id'] === o2['user_id']);

                    UnMatchresult = UnMatchresult.map(f => ({ ...f, status: false }))


                    let finalArray = [...Matchresult, ...UnMatchresult]

                    return res.json({ finalArray, Status: "Success" })

                }
            })
        }
    })

})

// Getting userId for edit Purpose through Params
app.get('/userHome/editTask/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const sql = `SELECT * FROM userTasks WHERE id = ${taskId}`;
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({ Error: "Fetching assigned users error" })
        }
        else {
            return res.json({ data, Status: "Success" });
        }
    })
});

// After Edit updating the column through use Params Id
app.post('/userHome/editTask/:id', (req, res) => {
    // console.log(req.body);
    const taskId = parseInt(req.params.id);
    const { taskName, description, status } = req.body
    const sql = `UPDATE userTasks SET task_name = ?, description = ?,status = ? WHERE id = ?`
    db.query(sql, [taskName, description, status, taskId], (err, result) => {
        if (err) {
            return res.json({ Error: "Can update the task details" })
        }
        else {
            return res.json({ result, Status: "Success", SuccessStatus: "Data Updated Successfully" })
        }
    })
})


// Deleting task of the user
app.post("/delete", (req, res) => {
    const { deleteId } = req.body;
    const sql = `DELETE FROM userTasks WHERE id=${deleteId}`;
    db.query(sql, (err, data) => {
        if (err) {
            res.json({ Error: "Can not delete the task" })
        }
        else {
            return res.json({ message: 'task delete successfully' })
        }
    })
})

//Manager adding task to a user
app.post('/managerHome/viewTasks/:id', verifyUser, (req, res) => {
    const userId = req.params.id;
    const managerId = req.id;
    // console.log(req.body.deadline);
    // console.log("userId,----------------", userId);
    // console.log("umanagerId,----------------", managerId);


    const sql = 'INSERT INTO userTasks (`task_name`,`description`,`status`,`deadline_start`,`deadline_end`,`user_id`,`added_by`) VALUES(?)';
    const values = [
        req.body.taskName,
        req.body.description,
        req.body.status,
        req.body.deadline.startDate,
        req.body.deadline.endDate,
        userId,
        managerId
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json({ Error: "Unable to store data" });
        }
        else {
            return res.json({ data, Status: "Success" });
        }
    })
})

//Admin adding task to a user
app.post('/adminHome/usersList/viewTasks/:id', verifyUser, (req, res) => {
    const userId = parseInt(req.params.id);
    const managerId = req.id;
    const sql = 'INSERT INTO userTasks (`task_name`,`description`,`status`,`user_id`,`added_by`) VALUES(?)';
    const values = [
        req.body.taskName,
        req.body.description,
        req.body.status,
        userId,
        managerId
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json({ Error: "Unable to store data" })
        }

        return res.json({ data, Status: "Success" });
    })
})

// Running Port...
app.listen(PORT, () => {
    console.log(`Server running on the ${PORT} port...`)
});
