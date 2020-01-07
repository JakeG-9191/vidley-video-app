const { Register } = require('../../models/register');
const { Genre } = require('../../models/genre');
const request = require('supertest');

describe('auth middleware', () => {
  beforeEach(() => {
    server = require('../../app');
  });
  afterEach(async () => {
    await Genre.remove({});
    server.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' });
  };

  beforeEach(() => {
    token = new Register().generateAuthToken();
  });

  it('should return 401 if no token is provided', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
