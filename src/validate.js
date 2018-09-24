import AnalyticsLogger from './logAnalytics';

export default class Validate {

  constructor() {
    this.schema = 'http://ciam.nestle.com/schemas/importschema.json#';
    this.logger = new AnalyticsLogger('QualityChecker');
  }

  Process(version, navData, fileName) {
    if (!version || !navData || !fileName) {
      return {
        isValid: false,
        data: {},
      };
    }
    const winston = require('winston');
    const Ajv = require('ajv');
    const ajv = Ajv({
      allErrors: true,
      logger: winston,
      verbose: false,
      validateSchema: 'log',
      schemas: [
        require(`./schemas/${version}/importschema`),
        require(`./schemas/${version}/definitions`),
        require(`./schemas/${version}/accountImport`),
        require(`./schemas/${version}/profile`),
        require(`./schemas/${version}/data`),
        require(`./schemas/${version}/child`),
        require(`./schemas/${version}/pet`),
        require(`./schemas/${version}/interest`),
        require(`./schemas/${version}/externalIdentity`),
        require(`./schemas/${version}/identities`),
        require(`./schemas/${version}/loginIDs`),
        require(`./schemas/${version}/password`),
        require(`./schemas/${version}/passwordSettings`),
        require(`./schemas/${version}/subscriptions`),
      ],
    });

    const ajvValidate = ajv.getSchema(this.schema);
    const result = ajvValidate(navData);
    winston.warn(ajvValidate.errors);

    // Log Analytics write
    this.logger.Error(fileName, ajvValidate.errors);

    const response = {
      isValid: result,
      data: ajvValidate.errors,
    };
    return response;
  }

  Override(version, overrideSchema, navData, fileName) {
    if (!version || !overrideSchema || !navData || !fileName) {
      return {
        isValid: false,
        data: {},
      };
    }
    const winston = require('winston');
    const Ajv = require('ajv');
    const ajv = Ajv({
      allErrors: true,
      logger: winston,
      verbose: false,
      validateSchema: 'log',
      schemas: [
        require(`./override/${version}/${overrideSchema}/importschema`),
        require(`./override/${version}/${overrideSchema}/definitions`),
        require(`./override/${version}/${overrideSchema}/accountImport`),
        require(`./override/${version}/${overrideSchema}/profile`),
        require(`./override/${version}/${overrideSchema}/data`),
        require(`./override/${version}/${overrideSchema}/identities`),
        require(`./override/${version}/${overrideSchema}/loginIDs`),
        require(`./override/${version}/${overrideSchema}/password`),
        require(`./override/${version}/${overrideSchema}/passwordSettings`),
        require(`./override/${version}/${overrideSchema}/subscriptions`),
        require(`./override/${version}/${overrideSchema}/child`),
        require(`./override/${version}/${overrideSchema}/pet`),
        require(`./override/${version}/${overrideSchema}/interest`),
        require(`./override/${version}/${overrideSchema}/externalIdentity`),
      ],
    });

    const ajvValidate = ajv.getSchema(this.schema);
    const result = ajvValidate(navData);
    winston.warn(ajvValidate.errors);

    // Log Analytics write
    this.logger.Error(fileName, ajvValidate.errors);

    const response = {
      isValid: result,
      data: ajvValidate.errors,
    };
    return response;
  }
}
