"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Observer_1 = require('../Observer');
var Live2DCanvas_1 = require('./Live2DCanvas');
var FaceTracker_1 = require('./FaceTracker');
var AssetsLoader_1 = require('./AssetsLoader');
var UserMedia_1 = require('./UserMedia');
var Controller_1 = require('./Controller');
var Container = (function (_super) {
    __extends(Container, _super);
    function Container(props) {
        _super.call(this, props);
        this.state = props.mutable;
        this.observer = new Observer_1.default(this);
    }
    Container.prototype.render = function () {
        var props = {
            mutable: this.state,
            immutable: this.props.immutable,
            observer: this.observer
        };
        return React.createElement("div", null, React.createElement(Live2DCanvas_1.default, React.__spread({}, props)), React.createElement(Controller_1.default, React.__spread({}, props)), React.createElement(FaceTracker_1.default, React.__spread({}, props)), React.createElement(AssetsLoader_1.default, React.__spread({}, props)), React.createElement(UserMedia_1.default, React.__spread({}, props)));
    };
    return Container;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Container;
