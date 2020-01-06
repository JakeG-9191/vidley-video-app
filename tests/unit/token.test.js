const { Register } = require('../../models/register');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('register.generateAuthToken', () => {
  it('should provide a valid json web token', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const register = new Register(payload);
    const token = register.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtPrivate'));
    expect(decoded).toMatchObject(payload);
  });
});
