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
          bool: {
            should: [
              {
                term: {
                  color_spaces: {
                    value: searchQuery[0],
                    boost: 1.5
                  }
                }
              },
              {
                term: {
                  color_spaces: {
                    value: searchQuery[1],
                    boost: 1.5
                  }
                }
              },
              {
                term: {
                  color_spaces: {
                    value: searchQuery[2],
                    boost: 1.5
                  }
                }
              },
            ]
          }
        },
        highlight: {
          fields: {
            color_spaces: {
              fragment_size : 6,
              number_of_fragments : 3,
            }
          }
        }
      }
    })
  }
}

module.exports = { api };