const { Rental } = require('../../models/rental');
const mongoose = require('mongoose');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;

  beforeEach(() => {
    server = require('../../app');

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    const rental = new Rental({
      customer: {
        _id: customerId,
        name: '123',
        phone: '1234567899'
      },
      movie: {
        _id: movieId,
        title: '123'
      }
    });
  });
  afterEach(async () => {
    server.close();
  });
});
