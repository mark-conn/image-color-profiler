const express = require('express');
const path = require('path');
const getColors = require('get-image-colors');
const { api } = require('./search');

const app = express();

app.get('/', async (req, res) => {
  try {
    const colorProfile = await getColors(path.join(__dirname, 'images/sunset.jpg'));

    // Index the picture
    // const result = await api.index(colorProfile.map(c => c.hex()));
    // console.log('RESULT: ', result);
  
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

app.listen(4000, () => {
  console.log('Listening on 4000');
})