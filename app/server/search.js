const { Client } = require('@elastic/elasticsearch');
// const request = require('request');

const client = new Client({ node: 'http://10.128.49.81:9200' });

const api = {
  indexDocument: async ({colorBuckets, source, originalColors}) => {
    return client.index({
      index: 'images',
      body: {
        color_spaces: colorBuckets,
        original_colors: originalColors,
        source: source,
      }
    })
  }
}

module.exports = { api };