module.exports = function(err, req, res, next) {
  // Log exception to be added
  res.status(500).send('Something Failed');
};
