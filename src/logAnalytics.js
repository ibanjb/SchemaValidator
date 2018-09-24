//
// private trace object
//
const trace = {
  read(logName, subscription, resource, workspaceId, workspaceName, sharedKey, apiVersion, query) {
    const logsUrl = `https://api.loganalytics.io/v1/workspaces/${workspaceId}/query`;
    this.call(workspaceId, sharedKey, apiVersion, logsUrl, logName, query);
  },
  write(logName, workspaceId, sharedKey, apiVersion, jsonData) {
    const logsUrl = `https://${workspaceId}.ods.opinsights.azure.com/api/logs?api-version=${apiVersion}`;
    this.call(workspaceId, sharedKey, apiVersion, logsUrl, logName, jsonData);
  },
  call(workspaceId, sharedKey, apiVersion, logsUrl, logName, bodyMessage) {
    const request = require('request');
    const crypto = require('crypto');
    const postBody = JSON.stringify(bodyMessage);
    const contentLength = Buffer.byteLength(postBody, 'utf8');
    const processingDate = new Date().toUTCString();
    const stringToSign = `POST\n${contentLength}\napplication/json\nx-ms-date:${processingDate}\n/api/logs`;
    const signature = crypto.createHmac('sha256', new Buffer(sharedKey, 'base64')).update(stringToSign, 'utf-8').digest('base64');
    const authorization = `SharedKey ${workspaceId}:${signature}`;

    const postHeaders = {
      'content-type': 'application/json',
      Authorization: authorization,
      'Log-Type': logName,
      'x-ms-date': processingDate,
    };

    const postUrl = {
      url: logsUrl,
      headers: postHeaders,
      body: postBody,
    };

    request.post(postUrl, (error, response, body) => {
      console.log('statusCode:', response && response.statusCode, error, body);
    });
  },
};

//
// AnalyticsLogger class
//
export default class AnalyticsLogger {

  constructor(logName) {
    this.subscriptionId = '06b56530-6cb1-4dab-a815-8a5b06c7e41a';
    this.resourceGroupName = 'defaultresourcegroup-weu';
    this.workspaceId = 'c5f8b1be-9212-412b-8900-64b953d9f92e';
    this.workspaceName = 'DefaultWorkspace-06b56530-6cb1-4dab-a815-8a5b06c7e41a-WEU';
    this.sharedKey = 'L1hlEO+1XyiFlOSepOaDJev1UhaI1sF6lkrEs5Sq/6oj7ngR8nepJeXOz4yRyvD4EESM/V1QkxRpQTGj8iZUgw==';
    this.apiVersion = '2016-04-01';
    this.logName = logName;
  }

  Debug(fileName, message) {
    const jsonData = [{
      type: 'debug',
      file: fileName,
      data: message,
    }];
    trace.write(this.logName, this.workspaceId, this.sharedKey, this.apiVersion, jsonData);
  }

  Info(fileName, message) {
    const jsonData = [{
      type: 'info',
      file: fileName,
      data: message,
    }];
    trace.write(this.logName, this.workspaceId, this.sharedKey, this.apiVersion, jsonData);
  }

  Warn(fileName, message) {
    const jsonData = [{
      type: 'warning',
      file: fileName,
      data: message,
    }];
    trace.write(this.logName, this.workspaceId, this.sharedKey, this.apiVersion, jsonData);
  }

  Error(fileName, message) {
    const jsonData = [{
      type: 'error',
      file: fileName,
      data: message,
    }];
    trace.write(this.logName, this.workspaceId, this.sharedKey, this.apiVersion, jsonData);
  }

  Get(type) {
    const jsonData = {
      query: `${this.logName}_CL | where type_s == "${type}"  | order by TimeGenerated desc`,
    };
    trace.read(this.logName,
      this.subscriptionId,
      this.resourceGroupName,
      this.workspaceId,
      this.workspaceName,
      this.sharedKey,
      this.apiVersion,
      jsonData);
  }
}
