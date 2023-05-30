const mongoose = require("mongoose")
const objectId = mongoose.Types.ObjectId;
const validateMongoId = (id) =>{
    const isValid = objectId.isValid(id)
    if(!isValid) throw new Error("This id is not valid or not found");
}

module.exports = validateMongoId;