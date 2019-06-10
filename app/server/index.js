const express = require('express');
const cors = require('cors');
const { api } = require('./elastic-api');
const { getColorBucket, rgbToHex } = require('../utils')

const app = express();

app.use(cors());

function buildSearchQuery(query, resolution) { 
  return Object.keys(query).map(key => {
    const arr = [];
      const color = JSON.parse(query[key]);

      arr[0] = color.r;
      arr[1] = color.g;
      arr[2] = color.b;

      if (!resolution) return rgbToHex(arr);

      return getColorBucket(arr, resolution);
  })
}

app.get('/search', async (req, res) => {
  try {
    const searchQuery = {
      ultra_lo: buildSearchQuery(req.query, 64),
      lo_res: buildSearchQuery(req.query, 32),
      hi_res: buildSearchQuery(req.query, 16),
      original_colors: buildSearchQuery(req.query),
    };

    const documents = await api.search(searchQuery);

    const imageHits = documents.body.hits
      && documents.body.hits.hits.length
      && documents.body.hits.hits.map(h => ({
        source: h._source,
        score: h._score,
        id: h._id,
        highlight: h.highlight
      }))

    const response = {
      images: imageHits.length ? imageHits : [],
    };

    res.send(response);
  } catch (e) {
    res.send(e);
  }
})

app.listen(process.env.PORT || 4000, () => {
  console.log('Listening on ', process.env.PORT || 4000);
})