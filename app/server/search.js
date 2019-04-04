const { Client } = require('@elastic/elasticsearch');

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
  },
  search: async (searchQuery) => {
    return client.search({
      index: 'images',
      body: {
        query: {
          terms: {
            color_spaces: searchQuery
          }
        }
      }
    })
  }
}

module.exports = { api };