"use strict";
var React = require('react');
var ReactDOM = require('react-dom');
var Container_1 = require('./components/Container');
window.requestAnimationFrame =
    window.requestAnimationFrame ||
        window['mozRequestAnimationFrame'] ||
        window['webkitRequestAnimationFrame'] ||
        window.msRequestAnimationFrame;
navigator.getUserMedia =
    navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
var root = document.getElementById('reactRoot');
ReactDOM.render(React.createElement(Container_1.default, React.__spread({}, JSON.parse(root.dataset['props']))), root);
