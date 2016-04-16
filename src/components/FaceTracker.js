"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var calculateWorker_1 = require('../workers/calculateWorker');
var BLINK_SAMPLING_COUNT = 100;
var FaceTracker = (function (_super) {
    __extends(FaceTracker, _super);
    function FaceTracker() {
        _super.apply(this, arguments);
        this.probableNoBlinkHeights = [];
        this.probableBlinkHeights = [];
        this.probableBlinkHeight = null;
        this.probableBlinkDiff = null;
    }
    FaceTracker.prototype.componentDidMount = function () {
        var _this = this;
        this.tracker = new clm.tracker({ useWebGL: true });
        this.tracker.init(pModel);
        this.worker = new Worker(URL.createObjectURL(new Blob(['(', calculateWorker_1.default.toString(), ')()'], { type: 'application/javascript' })));
        document.addEventListener('clmtrackrIteration', function () {
            _this.canvas2dContext.clearRect(0, 0, _this.traceCanvas.width, _this.traceCanvas.height);
            if (_this.props.mutable.showTrace) {
                _this.tracker.draw(_this.traceCanvas);
            }
            _this.worker.postMessage({
                position: _this.tracker.getCurrentPosition(),
                probableBlinkHeight: _this.probableBlinkHeight,
                probableBlinkDiff: _this.probableBlinkDiff
            });
        });
        this.worker.onmessage = function (event) {
            var _a = event.data, parameter = _a.parameter, probableNoBlinkHeight = _a.probableNoBlinkHeight, probableBlinkHeight = _a.probableBlinkHeight;
            if (probableNoBlinkHeight !== null) {
                _this.probableNoBlinkHeights.push(probableNoBlinkHeight);
                _this.probableBlinkHeights.push(probableBlinkHeight);
                if (_this.probableNoBlinkHeights.length >= BLINK_SAMPLING_COUNT) {
                    _this.probableBlinkHeight = getAveg(_this.probableBlinkHeights);
                    _this.probableBlinkDiff = getAveg(_this.probableNoBlinkHeights) - _this.probableBlinkHeight;
                }
            }
            _this.props.observer.updateParameter(parameter);
        };
    };
    FaceTracker.prototype.shouldComponentUpdate = function (props) {
        var shouldComponentUpdate = (props.mutable.showVideo !== this.props.mutable.showVideo) || (props.mutable.showTrace !== this.props.mutable.showTrace);
        if (!props.mutable.stream) {
            return shouldComponentUpdate;
        }
        if (!this.props.mutable.stream) {
            this.video.src = window.URL.createObjectURL(props.mutable.stream);
            this.video.play();
            if (props.mutable.tracking) {
                this.tracker.start(this.video);
            }
            return shouldComponentUpdate;
        }
        if (props.mutable.tracking && !this.props.mutable.tracking) {
            this.tracker.start(this.video);
        }
        if (!props.mutable.tracking && this.props.mutable.tracking) {
            this.tracker.stop();
        }
        return shouldComponentUpdate;
    };
    FaceTracker.prototype.render = function () {
        var _this = this;
        var style = {
            WebkitTransform: 'scaleX(-1)',
            OTransform: 'scaleX(-1)',
            MozTransform: 'scaleX(-1)',
            transform: 'scaleX(-1)',
            filter: 'FlipH',
            msFilter: 'FlipH',
            position: 'absolute'
        }, styleHidden = { display: 'none' };
        return React.createElement("div", null, React.createElement("video", {ref: function (video) { return !_this.video && (_this.video = video); }, width: '320', height: '240', style: this.props.mutable.showVideo ? style : styleHidden}), React.createElement("canvas", {ref: function (traceCanvas) {
            if (_this.traceCanvas) {
                return;
            }
            _this.traceCanvas = traceCanvas;
            _this.canvas2dContext = traceCanvas.getContext('2d');
        }, width: '320', height: '240', style: this.props.mutable.showTrace ? style : styleHidden}));
    };
    return FaceTracker;
}(React.Component));
function getAveg(arr) {
    return arr.reduce(function (acc, num) { return acc + num; }, 0) / arr.length;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FaceTracker;
