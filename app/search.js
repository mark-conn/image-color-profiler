const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

const api = {
  index: async (colorProfile) => {
    return client.index({
      index: 'images',
      body: {
        color_spaces: colorProfile
      }
    })
  }
}

module.exports = { api };