import React, { Component } from 'react';
import './HexClock.css';
import { thisTypeAnnotation } from '@babel/types';

// utilities //
function updateDate() {
    const date = new Date();
    let [h, m, s] = [date.getHours(), date.getMinutes(), date.getSeconds()];
    if (h < 10) {h = "0" + h};
    if (m < 10) {m = "0" + m};
    if (s < 10) {s = "0" + s};
    let dateString =  `${s}${m}${h}`;
    console.log(dateString);
    
    return dateString;
}
const toHex = (i) => parseInt(i, 10).toString(16);
const toColorCode = (hex) => '#' + hex;
function hexNormalize (str) {
    var strNorm = str;
    let i = 6 - str.length;
    for (i; i > 0; i--) {
       strNorm = strNorm + str[0]
    };
    return toColorCode(strNorm);
  };

export default class HexClock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showControls: true,
            int: '2632756',
            backgroundColor: '#0F4e5d',
            dateIntervalRef: setInterval(
                () => {
                    this.setColor(updateDate())
                }, 1000
                ),
        }

        // bind methods
        this.toggleControls = this.toggleControls.bind(this);
        this.stopInterval = this.stopInterval.bind(this);
        this.startInterval = this.startInterval.bind(this);
    }

    stopInterval() {
        clearInterval(this.state.dateIntervalRef);
    }

    startInterval() {
        // this.setState({
        //     dateIntervalRef: //todo
        // })
    }

    _setBackground() {
        console.count('setColor()');
        const { int } = this.state;
        const hex = hexNormalize(toHex(int));
        this.setState({backgroundColor: hex});
    }

    setColor(int) {
        this.setState({int});
        this._setBackground();
    }

    debounceSetColor(number) {
        console.count('debounce()');
        clearInterval(this.dateIntervalRef);
        this.setState({
            int: number,
            dateIntervalRef: setInterval(this._setBackground, 1000)
        });
    }

    toggleControls() {
        let { showControls } = this.state;
        console.log(showControls)
        this.setState({
            showControls: !showControls
        })
    }

    render() {
        const {
            backgroundColor,
            int,
            dateIntervalRef,
            showControls
        } = this.state;
        const hexColor = hexNormalize(toHex(int));
        console.log('render > ', this.state);

        return (
            <header
                className="Hex-header"
                style={{backgroundColor}}
            >
                <p className={'title'}>
                    Wecome to the <strong>hex color clock</strong>!
                </p>
                <span
                    className="control-trigger"
                    onClick={this.toggleControls}
                >
                    {showControls ? 'close controls' : 'open controls'}
                </span>
                <span
                    className="hex-display"
                    style={{visibility: showControls ? 'visible' : 'hidden'}}
                >
                    <p><strong>color:</strong> {int}[base10] / {hexColor}[base16]</p>
                    <p><strong>time:</strong> {toHex(int)}[base16]</p>
                    <p><strong>intervalRef:</strong> {dateIntervalRef}</p>
                </span>
                <br/>
          </header>
        )
    }
}