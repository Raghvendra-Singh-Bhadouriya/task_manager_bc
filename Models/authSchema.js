import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    username: {type: String, require: true},
    email: {type: String, require: true},
    mob: {type: Number, require: true},
    password: {type: String, require: true}
},{
    versionKey: false
})

const authModel = mongoose.model("auth", authSchema)

export default authModel ;