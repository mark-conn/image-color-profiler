import React, { Component } from 'react';
import axios from 'axios';
import ColorPicker from './components/colorPicker';
import styled from 'styled-components';
import logo from './logo.png';

const Wrapper = styled.div`
  display: flex;
`;

const SwatchWrapper = styled.div``;
const PicturesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 2rem;
`;

const ColorsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Color = styled.div`
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  background-color: ${({ color }) => `${color}`};
  margin: .25rem;
  border: ${({ highlight }) => highlight && '8px dotted white'};
`;

const Logo = styled.div`
  padding: 1rem;
`;

class App extends Component {
  constructor() {
    super();

    this.pickers = [1,2,3];
    this.state = {
      swatches: {
        1: { r: 243, g: 55, b: 15 },
        2: { r: 14, g: 224, b: 161 },
        3: { r: 227, g: 216, b: 13 },
        // 4: { r: 19, g: 40, b: 225 },
        // 5: { r: 232, g: 14, b: 221 },
      },
      images: []
    }
  }

  rgbToHex(rgb) {
    const hexRGBValues = rgb.map(v => {
      const hexValue = Number(v).toString(16)
      return hexValue.length < 2 ? '0'+hexValue : hexValue
    })
    return hexRGBValues.join('')
  };
  
  getColorBucket(color = [0, 0, 0], regionSize = 16) {
    /** (terms "Region" and "Bucket" are used interchangeably)
     * Theory:
     * Divide the rgb cube along all 3 dimensions resulting in a 3D map of 16x16x16 regions.
     * The ID of a region is equivalent to the coordinate of its lower-bounds.
     * ie: [0,0,0] represents the region bounded by R=0-15, G=0-15, B=0-15
     * and [80,144,224]  represents the region bounded by R=80-95, G=144-159, B=224-239
     *
     * @param {Array} color - An array of rgb color values ([r,g,b] in order of red, green, blue)
     * @param {number} regionSize - The granularity of the rgb space dissection. 16 divides cleanly the integers cleanly into 4,096 regions (buckets)
     * @returns {Array} representing the HEX value of lower bound coords of the input color, this servers as a region ID.
     */
  
    if (color.length !== 3 || isNaN(color[0]) || isNaN(color[1]) || isNaN(color[2])) {
      throw('color arg passed is not properly formatted for getRGBRegion()')
    }
    // Divide each coordinate by regionSize (16), round down and then multiply by regionSize to get lower bound coordinate for coordinate dimension.
    const rgbRegionId = color.map(value => Math.floor(value / regionSize) * regionSize);
    const hexRegionId = this.rgbToHex(rgbRegionId);
    return hexRegionId;
  }

  fetchImages() {
    axios.get('http://localhost:4000/search', {
        params: {
          ...this.state.swatches
        }
      })
      .then(({ data }) => {
        const { images } = data;
        this.setState({
          images
        });
      })
  }

  setHex(color, id) {
    this.setState({
      swatches: Object.assign(this.state.swatches, { [id]: color.rgb })
    }, () => {
      this.fetchImages();
    });
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result.slice(1,4).map(c => parseInt(c, 16))
  }

  highlightToColor(str) {
    return `#${str.match(/(?<=(<em>))(\w|\d|\n|[().,\-:;@#$%^&*\[\]"'+–/\/®°⁰!?{}|`~]| )+?(?=(<\/em>))/g)[0]}`;
  }

  render() {
    return (
      <div>
        <Logo>
          <img style={{ height: '25px'}} src={logo} alt='shutterstock' />
        </Logo>
        <Wrapper>
        <SwatchWrapper>
          {
            this.pickers.map(n => (
              <ColorPicker 
                key={n}
                setHex={(color) => this.setHex(color, n)}
                color={this.state.swatches[n]}
              />
            ))
          }
        </SwatchWrapper>
        <PicturesWrapper>
          {
            this.state.images.length ?
            this.state.images.map((i, index) => {
              const highlights = i.highlight.color_spaces.map(c => this.highlightToColor(c));

              return (
                <div style={{ padding: '.5rem' }} key={index} >
                  <img src={i.source.source} alt='image' style={{ height: '20rem' }}/>
                  <ColorsWrapper>
                    {
                      i.source.original_colors.map((c, index) => (
                        <Color
                          color={`#${c}`}
                          key={`${c}_${i}`}
                          highlight={
                            highlights.filter(h => h === `#${this.getColorBucket(this.hexToRgb(c))}`).length
                          }
                        />
                      ))
                    }
                  </ColorsWrapper>
                </div>
              )
            })
            : null
          }
        </PicturesWrapper>
      </Wrapper>
      </div>
    );
  }
}

export default App;