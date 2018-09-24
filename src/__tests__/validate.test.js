// const Validate = require('../validate');
import Validate from '../validate';

describe('Validate.Process without version', () => {
  test('It should response with an object with the property isValid set to false and no results', async () => {
    const validate = new Validate();
    const result = validate.Process(null, null, null);
    expect(result).toEqual({ data: {}, isValid: false });
  });
});

describe('Validate.Process with version but without navData', () => {
  test('It should response with an object with the property isValid set to false and no results', async () => {
    const validate = new Validate();
    const result = validate.Process('2.1', null, null);
    expect(result).toEqual({ data: {}, isValid: false });
  });
});

describe('Validate.Process with version and navData but without fileName', () => {
  test('It should response with an object with the property isValid set to false and no results', async () => {
    const navData = require('../data/testing.json');
    const validate = new Validate();
    const result = validate.Process('2.1', navData, null);
    expect(result).toEqual({ data: {}, isValid: false });
  });
});

describe('Validate.Override without version', () => {
  test('It should response with an object with the property isValid set to false and no results', async () => {
    const validate = new Validate();
    const result = validate.Override(null, null, null, null);
    expect(result).toEqual({ data: {}, isValid: false });
  });
});

describe('Validate.Override with version but without overrideSchema', () => {
  test('It should response with an object with the property isValid set to false and no results', async () => {
    const validate = new Validate();
    const result = validate.Override('2.1', null, null, null);
    expect(result).toEqual({ data: {}, isValid: false });
  });
});

describe('Validate.Override with version and overrideSchema but without navData', () => {
  test('It should response with an object with the property isValid set to false and no results', async () => {
    const validate = new Validate();
    const result = validate.Override('2.1', 'test', null, null);
    expect(result).toEqual({ data: {}, isValid: false });
  });
});

describe('Validate.Override with version, overrideSchema and navData but without fileName', () => {
  test('It should response with an object with the property isValid set to false and no results', async () => {
    const navData = require('../data/testing.json');
    const validate = new Validate();
    const result = validate.Override('2.1', 'test', navData, null);
    expect(result).toEqual({ data: {}, isValid: false });
  });
});
