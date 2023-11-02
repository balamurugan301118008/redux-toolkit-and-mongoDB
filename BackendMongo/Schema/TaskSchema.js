const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    taskName: String,
    description: String,
    status: String,
    startedAt: Date,
    endedAt: Date,
    timeLimit: Number,
    userId: mongoose.Schema.Types.ObjectId,
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model('userTasks', taskSchema);
