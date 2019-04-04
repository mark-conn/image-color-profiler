const { Client } = require('@elastic/elasticsearch');
// const request = require('request');

const client = new Client({ node: 'http://localhost:9200' });

const api = {
  indexDocument: async ({colorProfile, source}) => {
    return client.index({
      index: 'images',
      body: {
        color_spaces: colorProfile,
        source: source,
      }
    })
  }
}

module.exports = { api };