const express = require('express');
const mongoose = require('mongoose');
const userSchema = require("../Schema/userSchema");
const adminOrManagerSchema = require("../Schema/adminOrManagerSchema");
const userTasks = require('../Schema/TaskSchema');
const ObjectId = mongoose.Types.ObjectId;
const Router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const _ = require("lodash")
const salt = 10;

Router.post('/userRegister', async (req, res) => {

    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    const hashPassword = bcrypt.hashSync(password.toString(), salt);
    let formData = {
        name: name,
        email: email,
        password: hashPassword,
    };
    // console.log(formData);

    const emailExists = await userSchema.findOne({ email: email });
    if (emailExists) {
        res.send({ Error: "Email Id Already Exists" });

    }
    else {
        const user = new userSchema(formData);
        const register = await user.save();
        res.send({ id: 1, data: register, Status: "Success" });
    }
})

Router.post("/userLogin", async (req, res) => {
    const emailExists = await userSchema.find({ email: req.body.email });
    const password = bcrypt.compareSync(req.body.password.toString(), emailExists[0].password);

    // console.log(password);
    if (emailExists) {
        if (password == true) {
            const userName = emailExists[0].name;
            const id = emailExists[0]._id;

            const token = jwt.sign({ userName, id }, 'jwt-secret-key', { expiresIn: '1d' });
            res.json({ Status: "Success", token: token, user_name: userName, user_id: id });
        }
        else {
            res.json({ Error: "Password incorrect" })
        }
    }
    else {
        res.json({ Error: "Email Id not Exists " })
    }
}
)


Router.post('/adminOrManagerRegister', async (req, res) => {

    let name = req.body.name;
    let role = req.body.role;
    let email = req.body.email;
    let password = req.body.password;

    const hashPassword = bcrypt.hashSync(password.toString(), salt);
    let formData = {
        name: name,
        role: role,
        email: email,
        password: hashPassword,
    };

    const emailExists = await adminOrManagerSchema.findOne({ email: email });
    if (emailExists) {
        res.send({ Error: "Email Id Already Exists" });
    }
    else {
        const user = new adminOrManagerSchema(formData);
        const register = await user.save();
        res.send({ id: 1, data: register, Status: "Success" });
    }
});

Router.post("/adminOrManagerLogin", async (req, res) => {
    // console.log("direct email",req.body.email);
    const emailExists = await adminOrManagerSchema.findOne({ email: req.body.email });
    const password = bcrypt.compareSync(req.body.password.toString(), emailExists.password);
    // console.log("emailExist-------------------",emailExists == null);
    if (emailExists !== null) {
        if (password) {
            const name = emailExists.name;
            const id = emailExists._id;
            const role = emailExists.role
            const token = jwt.sign({ name, id, role }, 'jwt-secret-key', { expiresIn: '1d' });
            res.send({ Status: "Success", token: token, name: name, id: id, role: role });
        }
        else {
            res.send({ Error: "Password not match" })
        }
    }
    else {
        res.send({ Error: "Email Id not Exists" })
    }
});


const verifyUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : "auth header error";

    if (!token) {
        return res.send({ Error: "You are not authenticated" });
    }
    else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                res.json({ Error: "Token is not okay" })
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


Router.get('/adminHome', verifyUser, async (req, res) => {
    const adminId = req.id;
    const adminHome = await adminOrManagerSchema.find({ _id: new ObjectId(adminId) });
    if (!adminHome) {
        res.send({ Error: "Fetching Admin Details Error" });
    }
    else {
        res.send({ data: adminHome, Status: "Success" });
    }
});

Router.get('/managerHome', verifyUser, async (req, res) => {
    const managerId = req.id;

    const Assigned = await adminOrManagerSchema.aggregate([{ $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "matchData" } }, { $match: { "_id": new ObjectId(managerId) } }, { $project: { "matchData": 1, "_id": 0 } }]);
    const data = Assigned[0].matchData;
    const managerHome = await adminOrManagerSchema.find({ _id: new ObjectId(managerId) });
    if (!managerHome) {
        res.send({ Error: "Fetching Admin Details Error" });
    }
    else {
        res.send({ data: managerHome, AssignData: data, Status: "Success" });
    }
})

Router.get('/userHome', verifyUser, async (req, res) => {
    const userId = req.id;
    // console.log(userId);
    const userHome = await userSchema.find({ _id: new ObjectId(userId) });
    const taskList = await userTasks.find({ userId: userId });

    if (!userHome) {
        res.send({ Error: "Fetching Admin Details Error" });
    }
    else {
        res.send({ data: userHome, tasks: taskList, Status: "Success" });
    }
})

Router.post('/userHome', verifyUser, async (req, res) => {
    const userId = Object(req.id);
    // console.log("userId----",userId);
    // console.log("data---------------",req.bo);
    let formData = {
        taskName: req.body.taskName,
        description: req.body.description,
        status: req.body.status,
        userId: userId,
    };

    const task = new userTasks(formData);
    if (!task) {
        res.send({ Error: "Please fill all fields" })
    }
    else {
        const addTask = await task.save();
        res.send({ Status: "Success", data: addTask });
    }
})

Router.get('/managerList', async (req, res) => {
    const managerDetails = await adminOrManagerSchema.find({ role: "Manager" });
    if (!managerDetails) {
        res.send({ Error: "Fetching Managers list is error" });
    }
    else {
        res.send({ data: managerDetails, Status: "Success" });
    }
});

Router.get('/managerHome/viewTasks/:id', verifyUser, async (req, res) => {
    const userId = req.params.id;
    const managerId = req.id;
    const checkAorN = await adminOrManagerSchema.find({ $and: [{ _id: new ObjectId(managerId) }, { userId: new ObjectId(userId) }] })

    const tasks = await userTasks.find({ userId: new ObjectId(userId) });
    if (checkAorN.length > 0) {
        if (!tasks) {
            res.send({ Error: "User don't have any tasks so you can assign" });
        }
        else {
            res.send({ Status: "Success", data: tasks });
        }
    }
    else {
        res.send({ Error: "You are not authenticated" });
    }

});


Router.post('/managerHome/viewTasks/:id', verifyUser, async (req, res) => {
    const userId = req.params.id;
    const managerId = req.id;

    console.log(req.body);

    const formData = {
        taskName: req.body.taskName,
        description: req.body.description,
        status: req.body.status,
        startedAt: req.body.deadline.startDate,
        endedAt: req.body.deadline.endDate,
        timeLimit: req.body.timeLimit,
        userId: userId,
        addedBy: managerId,
    }

    const newTask = new userTasks(formData);
    const register = await newTask.save();
    if (!register) {
        res.send({ Error: "Registering task throwing error" })
    }
    else {
        res.send({ data: register, Status: "Success" })
    }
})

Router.get('/adminHome/usersList', async (req, res) => {
    const usersList = await userSchema.find({});
    if (!usersList) {
        res.send({ Error: "Fetching Users List" });
    }
    else {
        res.send({ Status: "Success", data: usersList })
    }
})

Router.get('/adminHome/usersList/viewTasks/:id', async (req, res) => {
    const userId = req.params.id;
    const tasks = await userTasks.find({ userId: new ObjectId(userId) });
    if (tasks) {
        res.send({ data: tasks, Status: "Success" });
    }
    else {
        res.send({ Error: "Fetching error" });
    }
})

Router.post('/adminHome/usersList/viewTasks/:id', verifyUser, async (req, res) => {
    const userId = Object(req.params.id);
    const adminId = Object(req.id);

    let formData = {
        taskName: req.body.taskName,
        description: req.body.description,
        status: req.body.status,
        startedAt: req.body.deadline.startDate,
        endedAt: req.body.deadline.endDate,
        timeLimit: req.body.timeLimit,
        userId: userId,
        addedBy: adminId,
    };

    const assignTask = new userTasks(formData);
    const register = await assignTask.save();
    if (register) {
        res.send({ Status: "Success", data: register });
    }
    else {
        res.send({ Error: "Task did not assign" });
    }
})

Router.post('/delete', async (req, res) => {
    const taskDelete = req.body.deleteId;

    const deleteTask = await userTasks.deleteOne({ _id: new ObjectId(taskDelete) });
    if (!deleteTask) {
        res.send({ Error: "Not deleted" })
    }
    else {
        res.send({ message: "task delete successfully" });
    }
})

Router.get('/userHome/editTask/:id', async (req, res) => {
    const userId = req.params.id;
    const getDetails = await userTasks.find({ _id: new ObjectId(userId) });
    if (!getDetails) {
        res.send({ Error: "Edit facing errors" });
    }
    else {
        res.send({ data: getDetails, Status: "Success" });
    }
});

Router.post('/userHome/editTask/:id', async (req, res) => {
    const taskId = Object(req.params.id);

    const formData = {
        taskName: req.body.taskName,
        description: req.body.description,
        status: req.body.status,
    };
    const update = await userTasks.findByIdAndUpdate(taskId, formData, { new: true });
    if (!update) {
        res.send({ Error: "Your data not updated" })
    }
    else {
        res.send({ Status: "Success", data: update });
    }
});

Router.get('/usersList/:id', async (req, res) => {
    const managerId = req.params.id
    const assigned = await adminOrManagerSchema.aggregate([{ $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "matchData" } }, { $match: { "_id": new ObjectId(managerId) } }, { $project: { "matchData": 1, "_id": 0 } }]);
    const match = assigned[0].matchData;
    const matched = match.map(ok => ({ ...ok, status: true }));
    // console.log(matched);
    const usersList = await userSchema.find({});

    const unMatch = _.differenceWith(usersList, match, (o1, o2) => String(o1._id) === String(o2._id));
    const unMatched = unMatch.map(data => ({ ...data.toObject(), stauts: false }))

    const finalArray = [...unMatched, ...matched]

    if (!finalArray) {
        res.send({ Error: "fetching UserList throwing error" });
    }
    else {
        res.send({ data: finalArray, Status: "Success" });
    }
})

Router.post(('/adminHome/managerList'), async (req, res) => {
    const managerId = req.body.managerId;
    const userId = req.body.userId;

    const userIdAorN = await adminOrManagerSchema.find({ $and: [{ _id: new ObjectId(managerId) }, { userId: new ObjectId(userId) }] });

    if (userIdAorN == 0) {
        const assignUser = await adminOrManagerSchema.updateOne({ _id: new ObjectId(managerId) }, { $push: { userId: new ObjectId(userId) } });

        if (!assignUser) {
            res.send({ Error: "Assigning is Error" });
        }
        else {
            res.send({ Status: "Success", data: assignUser });
        }
    }
    else {
        res.send({ Error: "Already Assigned" });
    }

})

module.exports = Router;