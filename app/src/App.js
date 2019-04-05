import React, { Component } from 'react';
import axios from 'axios';
import ColorPicker from './components/colorPicker';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
`;

const SwatchWrapper = styled.div``;
const PicturesWrapper = styled.div``;

class App extends Component {
  constructor() {
    super();

    this.pickers = [1,2,3,4,5];
    this.state = {
      swatches: {
        1: { r: 243, g: 55, b: 15 },
        2: { r: 14, g: 224, b: 161 },
        3: { r: 227, g: 216, b: 13 },
        4: { r: 19, g: 40, b: 225 },
        5: { r: 232, g: 14, b: 221 },
      },
      images: []
    }
  }

  fetchImages() {
    axios.get(this.props.serverUrl+'/search', {
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

  render() {
    console.log('\n\n\n\n\n this.props.serverUrl \n', this.props.serverUrl, process.env.NODE_ENV, '\n\n\n\n\n');
    return (
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
            this.state.images.map(i => {
              return <img src={i.source.source} alt='image' style={{ height: '20rem' }}/>
            })
            : null
          }
        </PicturesWrapper>
      </Wrapper>
    );
  }
}

export default App;