const { Rental } = require('../models/rental');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send('CustomerId not provided');
  if (!req.body.movieId)
    return res.status(400).send('MovieId was not provided');

  const rental = await Rental.findOne({
    'customer._id': req.body.customerId,
    'movie._id': req.body.movieId
  });

  if (!rental)
    return res.status(404).send('No rental found for customer or movie');

  if (rental.dateReturned)
    return res.status(400).send('This rental return has already processed');

  rental.dateReturned = 1;
  await rental.save();

  return res.status(200).send('Valid request, proceeding now');
});

module.exports = router;
