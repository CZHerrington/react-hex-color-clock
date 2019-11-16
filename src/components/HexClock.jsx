import React, { Component } from "react";
import {} from "react-control-panel";
import "./HexClock.css";

// utilities //
const toHex = i => parseInt(i, 10).toString(16);

const toColorCode = hex => "#" + hex;

function updateDate() {
  const date = new Date();
  let [h, m, s] = [date.getHours(), date.getMinutes(), date.getSeconds()];
  if (h < 10) { h = "0" + h }
  if (m < 10) { m = "0" + m }
  if (s < 10) { s = "0" + s }
  return `${s}${m}${h}`;
}

function hexNormalize(str) {
  var strNorm = str;
  if (strNorm.length < 6) {
      for (let i = str.length; i < 6; i++) {
        strNorm = strNorm + strNorm[1];
      }
  }
  return toColorCode(strNorm);
}

export default class HexClock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showControls: true,
      int: "2632756",
      backgroundColor: "#0F4e5d",
      dateIntervalRef: setInterval(() => {
        this.setTime(updateDate());
      }, 1000)
    };

    // bind methods
    this.handleToggleControls = this.handleToggleControls.bind(this);
    this.stopInterval = this.stopInterval.bind(this);
    this.startInterval = this.startInterval.bind(this);
    this.setBackground = this.setBackground.bind(this);
    this.setTime = this.setTime.bind(this);
    this.debounceSetColor = this.debounceSetColor.bind(this);
  }

  stopInterval() {
    clearInterval(this.state.dateIntervalRef);
  }

  startInterval() {
      clearInterval(this.state.dateIntervalRef);
    this.setState({
      dateIntervalRef: setInterval(() => this.setTime(updateDate()), 1000)
    });
  }

  setBackground() {
    const { int } = this.state;
    const hex = hexNormalize(toHex(int));
    console.log("setBackground()", `int: ${int} hex: ${hex}`);
    this.setState({ backgroundColor: hex });
  }

  setTime(int) {
    //   this is ineffecient, it causes two renders every call
    this.setState({ int });
    this.setBackground();
  }

  debounceSetColor(number) {
    console.count("debounce()");
    clearInterval(this.dateIntervalRef);
    this.setState({
      int: number,
      dateIntervalRef: setInterval(this.setBackground, 1000)
    });
  }

  handleToggleControls() {
      const showControls = !this.state.showControls;
    this.setState({showControls});
  }

  render() {
    const { backgroundColor, int, dateIntervalRef, showControls } = this.state;
    const hexColor = hexNormalize(toHex(int));

    const compliment = (hex) => "#" + (parseInt("FFFFFF", 16) - parseInt(hex.slice(1), 16)).toString(16);
    return (
      <header className="Hex-header" style={{ backgroundColor }}>
        <p className={"title"}>
          Wecome to the <strong>hex color clock</strong>!
        </p>
        <span
          className="control-trigger"
          onClick={this.handleToggleControls}
          style={{ color: compliment(backgroundColor) }}
        >
          {showControls ? "close controls" : "open controls"}
        </span>
        <span
          className="hex-display"
          style={{
            visibility: showControls ? "visible" : "hidden"
          }}
        >
          <p>
            <strong>color:</strong> {int}[base10] / {hexColor}[base16]
          </p>
          <p>
            <strong>time:</strong> {toHex(int)}[base16]
          </p>
          <p>
            <strong>intervalRef:</strong> {dateIntervalRef}
          </p>
        </span>
        <br />
      </header>
    );
  }
}
