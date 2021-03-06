import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

import App from './client/App';
import Html from './client/Html';

import Validate from './validate';

const app = express();
const validate = new Validate();
const PropertiesReader = require('properties-reader');
const path = require('path');

const properties = PropertiesReader('./src/config/server.ini');
const versions = properties.get('server.versions').split(',');
const overrideSchemas = properties.get('server.overrideSchemas').split(',');
const apidocs = path.join(__dirname, 'doc');
const useLocalDoc = Boolean(properties.get('server.useLocalDoc'));

if (useLocalDoc) {
  app.use(express.static('doc'));
} else {
  app.use(express.static(properties.get('server.docPath')));
}

/**
 * @api {get} /validate Request schema validation
 * @apiVersion 2.0.0
 * @apiName Validate
 * @apiGroup Server
 *
 * @apiParam {String} v Version of the schema to use, is MANDATORY
 *
 * @apiParam {String} file file name to validate located in the 'data' folder, is MANDATORY
 *
 * @apiSuccess {String} response JSON object as response generated by AJV
 *
 * @apiExample {js} Example usage:
            http://localhost:3000/validate?v=2.1
            http://localhost:3000/validate?v=2.2&file=myschema.json

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        AJV response
 *     }
*/
app.get('/validate', (req, res) => {
  let isValidCall = true;
  if (!req.query.v) {
    res.status(400).end(properties.get('errors.ApiVersionUnspecified'));
    isValidCall = false;
  }
  if (req.query.v && versions.indexOf(req.query.v.toString()) === -1) {
    res.status(405).end(properties.get('errors.UnsupportedApiVersion'));
    isValidCall = false;
  }
  if (!req.query.file) {
    res.status(400).end(properties.get('errors.FileUnspecified'));
    isValidCall = false;
  }

  if (isValidCall) {
    const navData = require(`./data/${req.query.file}`);
    const version = req.query.v;
    const response = validate.Process(version, navData, req.query.file);
    res.status(200).send(response);
  }
});

/**
 * @api {get} /override Request override schema validation
 * @apiVersion 2.0.0
 * @apiName Override
 * @apiGroup Server
 *
 * @apiParam {String} v Version of the schema to use, is MANDATORY
 *
 * @apiParam {String} Override schema to use located in the 'override' folder, is MANDATORY
 *
 * @apiParam {String} file file name to validate located in the 'data' folder, is MANDATORY
 *
 * @apiSuccess {String} response JSON object as response generated by AJV
 *
 * @apiExample {js} Example usage:
            http://localhost:3000/override?v=2.1
            http://localhost:3000/override?v=2.1&type=test
            http://localhost:3000/override?v=2.1&type=test&file=testData.json

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        AJV response
 *     }
*/
app.get('/override', (req, res) => {
  let isValidCall = true;
  if (!req.query.v) {
    res.status(400).end(properties.get('errors.ApiVersionUnspecified'));
    isValidCall = false;
  }
  if (req.query.v && versions.indexOf(req.query.v.toString()) === -1) {
    res.status(405).end(properties.get('errors.UnsupportedApiVersion'));
    isValidCall = false;
  }
  if (!req.query.type) {
    res.status(400).end(properties.get('errors.OverrideSchemaUnspecified'));
    isValidCall = false;
  }
  if (req.query.type && overrideSchemas.indexOf(req.query.type) === -1) {
    res.status(405).end(properties.get('errors.UnsupportedOverrideSchema'));
    isValidCall = false;
  }
  if (!req.query.file) {
    res.status(400).end(properties.get('errors.FileUnspecified'));
    isValidCall = false;
  }

  if (isValidCall) {
    const version = req.query.v;
    const overrideSchema = req.query.type;
    const localFile = require(`./data/${req.query.file}`);
    const result = validate.Override(version, overrideSchema, localFile, req.query.file);
    res.status(200).send(result);
  }
});

/**
 * @api {get} / Redirect to API docs
 * @apiVersion 2.0.0
 * @apiName Root
 * @apiGroup Server
 *
 * @apiSuccess {String} response API docs
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        Html
 *     }
 *
*/
app.get('/', (req, res) => {
  if (useLocalDoc) {
    res.sendFile('index.html', { root: apidocs });
  } else {
    res.sendFile('index.html', { root: properties.get('server.docPath') });
  }
});

/**
 * @api {get} /test A simple server-side rendering for a React web app
 * @apiVersion 2.0.0
 * @apiName Root
 * @apiGroup Server
 *
 * @apiSuccess {String} response React web app post-processed
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        Html
 *     }
 *
*/
app.get('/test', (req, res) => {
  const sheet = new ServerStyleSheet();
  const styles = sheet.getStyleTags();
  const body = renderToString(<App />);
  const title = 'CIAM - Schema validator';
  const result = Html({ body, styles, title });
  console.log(result);
  res.status(200).send(result);
});

module.exports = app;
