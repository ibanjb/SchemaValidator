const request = require('supertest');
const app = require('../src/app');

describe('Test the validate path -> /validate', () => {
  test('It should response with a status code 200 and the schema validation\'s result', async () => {
    const response = await request(app).get('/validate');
    expect(response.statusCode).toBe(200);
  });
});

describe('Test an inexistant URI', () => {
  test('It should response with a status code 404', async () => {
    const response = await request(app).get('/testing404');
    expect(response.statusCode).toBe(404);
  });
});
