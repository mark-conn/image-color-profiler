import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  componentDidMount() {
    axios.get('http://localhost:4000/ping')
      .then((res) => console.log(res));
  }

  render() {
    return (
      <div className="App">
        APP!
      </div>
    );
  }
}

export default App;