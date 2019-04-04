const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const getColors = require('get-image-colors');
const { api } = require('./search');
const { getColorBucket } = require('../utils')

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
  try {
    const colorProfile = await getColors(path.join(__dirname, '../images/sunset.jpg'));

    const html = `
      <div
        style="
          display: flex;
        "
      >
        ${
          colorProfile.map(({ _rgb }) => (
              `<div style="
                width: 200px;
                height: 200px;
                background-color: rgba(${_rgb[0]}, ${_rgb[1]}, ${_rgb[2]}, ${_rgb[3]});
              "></div>`
          )).join('')
        }
      </div>
    `;

    res.send(html);
  } catch (e) {
    console.log(e)
  }
});

app.get('/search', async (req, res) => {
  try {
    const searchQuery = Object.keys(req.query).map(key => {
      const arr = [];
      const color = JSON.parse(req.query[key]);

      arr[0] = color.r;
      arr[1] = color.g;
      arr[2] = color.b;

      return getColorBucket(arr);
    });

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

app.listen(4000, () => {
  console.log('Listening on 4000');
})