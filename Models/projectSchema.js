import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending"},
    createdAt: {
        type: Date,
        default: Date.now()
    }
},{
    versionKey: false
})

const projectModel = mongoose.model("project", projectSchema)

export default projectModel ;