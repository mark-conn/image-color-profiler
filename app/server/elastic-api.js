const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });

const api = {
  indexDocument: async ({ hiResBuckets, lowResBuckets, source, ultraLoBuckets, originalColors }) => {
    return client.index({
      index: 'images',
      body: {
        hi_res: hiResBuckets,
        lo_res: lowResBuckets,
        ultra_lo: ultraLoBuckets,
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
                  ultra_lo: {
                    value: searchQuery.ultra_lo[0],
                    boost: 1.5
                  }
                }
              },
              {
                term: {
                  ultra_lo: {
                    value: searchQuery.ultra_lo[1],
                    boost: 1.5
                  }
                }
              },
              {
                term: {
                  ultra_lo: {
                    value: searchQuery.ultra_lo[2],
                    boost: 1.5
                  }
                }
              },
              {
                term: {
                  lo_res: {
                    value: searchQuery.lo_res[0],
                    boost: 2.3
                  }
                }
              },
              {
                term: {
                  lo_res: {
                    value: searchQuery.lo_res[1],
                    boost: 2.3
                  }
                }
              },
              {
                term: {
                  lo_res: {
                    value: searchQuery.lo_res[2],
                    boost: 2.3
                  }
                }
              },
              {
                term: {
                  hi_res: {
                    value: searchQuery.hi_res[0],
                    boost: 3.2
                  }
                }
              },
              {
                term: {
                  hi_res: {
                    value: searchQuery.hi_res[1],
                    boost: 3.2
                  }
                }
              },
              {
                term: {
                  hi_res: {
                    value: searchQuery.hi_res[2],
                    boost: 3.2
                  }
                }
              },
              {
                term: {
                  original_colors: {
                    value: searchQuery.original_colors[0],
                    boost: 8.8
                  }
                }
              },
              {
                term: {
                  original_colors: {
                    value: searchQuery.original_colors[1],
                    boost: 8.8
                  }
                }
              },
              {
                term: {
                  original_colors: {
                    value: searchQuery.original_colors[2],
                    boost: 8.8
                  }
                }
              },
            ]
          }
        },
        highlight: {
          fields: {
            ultra_lo: {
              fragment_size : 6,
              number_of_fragments : 3,
            },
            lo_res: {
              fragment_size : 6,
              number_of_fragments : 3,
            },
            hi_res: {
              fragment_size : 6,
              number_of_fragments : 3,
            },
            original_colors: {
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