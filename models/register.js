const Joi = require('joi');
const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 25
  }
});

const Register = mongoose.model('Register', registerSchema);

function validateNewRegister(register) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    email: Joi.string()
      .max(50)
      .required(),
    password: Joi.string()
      .min(6)
      .max(25)
  };
  return Joi.validate(register, schema);
}

module.exports.Register = Register;
module.exports.validate = validateNewRegister;
