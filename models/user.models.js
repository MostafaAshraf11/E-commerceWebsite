var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3
        },
        pass: {
            type: String,
            required: true,
        },
        cart: { type: [String] }
    })
var user = mongoose.model('user', userSchema);
module.exports = user;

