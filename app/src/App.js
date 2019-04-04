import React, { Component } from 'react';
import axios from 'axios';
import ColorPicker from './components/colorPicker';

class App extends Component {
  constructor() {
    super();

    this.pickers = [1,2,3,4,5];
    this.state = {
      1: '#F3370F',
      2: '#0DD79B',
      3: '#E3D80D',
      4: '#1328E1',
      5: '#E80EDD'
    }
  }

  componentDidUpdate() {
    axios.get('http://localhost:4000/search', {
      params: {
        ...this.state
      }
    })
      .then((res) => console.log(res));
  }

  setHex({ hex }, id) {
    this.setState({
      [id]: hex
    });
  }

  render() {
    return (
      <div className="App">
        {
          this.pickers.map(n => (
            <ColorPicker 
              key={n}
              setHex={(hex) => this.setHex(hex, n)}
              color={this.state[n]} 
            />
          ))
        }
      </div>
    );
  }
}

export default App;