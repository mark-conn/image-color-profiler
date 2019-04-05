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
    const html = `
      <div
        style="
          display: flex;
        "
      >
      Hello world
      <div style="
        width: 200px;
        height: 200px;
        background-color: rgba(187, 123, 17, 1);
      "></div>

      <div style="
        width: 200px;
        height: 200px;
        background-color: rgba(234, 9, 187, 1);
      "></div>

      <div style="
        width: 200px;
        height: 200px;
        background-color: rgba(10, 143, 87, 1);
      "></div>

      <div style="
        width: 200px;
        height: 200px;
        background-color: rgba(100, 08, 100, 1);
      "></div>

      <div style="
        width: 200px;
        height: 200px;
        background-color: rgba(200, 9, 20, 1);
      "></div>
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
        id: h._id
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