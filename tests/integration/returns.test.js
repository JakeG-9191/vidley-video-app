const moment = require('moment');
const request = require('supertest');
const { Register } = require('../../models/register');
const { Movie } = require('../../models/movie');
const { Rental } = require('../../models/rental');
const mongoose = require('mongoose');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;
  let movie;

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require('../../app');

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new Register().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: '123',
      dailyRentalRate: 2,
      genre: { name: '12345' },
      numberInStock: 10
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '123',
        phone: '1234567899'
      },
      movie: {
        _id: movieId,
        title: '123',
        dailyRentalRate: 2
      }
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.remove({});
    await Movie.remove({});
  });

  it('should work', async () => {
    const result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
  });

  it('should return 401 if client is not logged in', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if customerId is not provided', async () => {
    customerId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if movieId is not provided', async () => {
    movieId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 404 if no rental found for customer or movie', async () => {
    await Rental.remove({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it('should return 400 if rental return has already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if rental request is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should set the return date if input is valid', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it('should set the rental fee if input is valid', async () => {
    rental.dateOut = moment()
      .add(-7, 'days')
      .toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it('should increase the stock for movie if input is valid', async () => {
    const res = await exec();

    const movieInDB = await Movie.findById(movieId);
    expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
  });

  it('should should return rental in body of response', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(res.body).toHaveProperty('dateOut');
    expect(res.body).toHaveProperty('dateReturned');
    expect(res.body).toHaveProperty('rentalFee');
    expect(res.body).toHaveProperty('customer');
    expect(res.body).toHaveProperty('movie');
  });
});
