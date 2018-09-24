const request = require('supertest');
const app = require('../app');

describe('Test an inexistant URI', () => {
  test('It should response with a status code 404', async () => {
    const response = await request(app).get('/testing404');
    expect(response.statusCode).toBe(404);
  });
});

// will fail in local environment due settings
describe('Test root path', () => {
  test('It should response with a status code 404', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(404);
  });
});

describe('Test the URI /test', () => {
  test('It should response with a status code 500', async () => {
    const response = await request(app).get('/test');
    expect(response.statusCode).toBe(500);
  });
});

//
// Validate
//
describe('Test the URI /validate without specify version', () => {
  test('It should response with a status code 400', async () => {
    const response = await request(app).get('/validate');
    expect(response.statusCode).toBe(400);
  });
});

describe('Test the URI /validate with a unsupported version', () => {
  test('It should response with a status code 405', async () => {
    const response = await request(app).get('/validate?v=0.1');
    expect(response.statusCode).toBe(405);
  });
});

describe('Test the URI /validate with a supported version but without file name', () => {
  test('It should response with a status code 405', async () => {
    const response = await request(app).get('/validate?v=2.1');
    expect(response.statusCode).toBe(400);
  });
});

describe('Test the URI /validate with a supported version and unexistant file', () => {
  test('It should response with a status code 405', async () => {
    const response = await request(app).get('/validate?v=2.1&file=jesting');
    expect(response.statusCode).toBe(500);
  });
});

//
// Override
//
describe('Test the URI /override without specify version', () => {
  test('It should response with a status code 400', async () => {
    const response = await request(app).get('/override');
    expect(response.statusCode).toBe(400);
  });
});

describe('Test the URI /override with a unsupported version', () => {
  test('It should response with a status code 405', async () => {
    const response = await request(app).get('/override?v=0.1');
    expect(response.statusCode).toBe(405);
  });
});

describe('Test the URI /override with a supported version but without override type', () => {
  test('It should response with a status code 405', async () => {
    const response = await request(app).get('/override?v=0.1');
    expect(response.statusCode).toBe(405);
  });
});

describe('Test the URI /override with a supported version and type but without file name', () => {
  test('It should response with a status code 405', async () => {
    const response = await request(app).get('/override?v=2.1&type=test');
    expect(response.statusCode).toBe(400);
  });
});

describe('Test the URI /override with a supported version and type but with a unexistant file', () => {
  test('It should response with a status code 405', async () => {
    const response = await request(app).get('/override?v=2.1&type=test&file=jesting');
    expect(response.statusCode).toBe(500);
  });
});
