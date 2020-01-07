module.exports = function(req, res, next) {
  if (!req.register.isAdmin)
    return res.status(403).send('Invalid Admin Credentials');

  next();
};
