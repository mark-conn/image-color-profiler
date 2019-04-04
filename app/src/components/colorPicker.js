import React, { Component } from 'react';
import { ChromePicker } from 'react-color';

export default class ColorPicker extends Component {
  render() {
    return (
      <div>
        <ChromePicker 
          onChangeComplete={this.props.setHex}
          color={this.props.color}
          disableAlpha
        />
      </div>
    )
  }
}