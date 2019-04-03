const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
const request = require('request');

const api = {
  indexDocument: async (colorProfile) => {
    return client.index({
      index: 'images',
      body: {
        color_spaces: colorProfile
      }
    })
  }
}

module.exports = { api };