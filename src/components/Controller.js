"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Controller = (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        _super.apply(this, arguments);
    }
    Controller.prototype.render = function () {
        var _this = this;
        var style = { display: this.props.mutable.currentModel ? 'block' : 'none', marginTop: '8px' };
        return React.createElement("div", null, React.createElement("select", {defaultValue: '0', onChange: function (event) { return _this.props.observer.onChangeModel(event.currentTarget['value']); }}, React.createElement("option", {value: '0', disabled: 'disabled'}, "Select model"), Object.keys(this.props.immutable.models).map(function (name, index) { return React.createElement("option", {key: index, value: name}, name); })), React.createElement("button", {onClick: function () { return _this.props.observer.onToggleTracking(); }, style: style}, this.props.mutable.tracking ? 'Stop' : 'Start', " tracking"), React.createElement("label", {style: style}, React.createElement("input", {type: 'checkbox', checked: this.props.mutable.showVideo, onChange: function (event) { return _this.props.observer.onChangeShowVideo(event.currentTarget.checked); }}), "Show tracking video"), React.createElement("label", {style: style}, React.createElement("input", {type: 'checkbox', checked: this.props.mutable.showTrace, onChange: function (event) { return _this.props.observer.onChangeShowTrace(event.currentTarget.checked); }}), "Show tracking trace"));
    };
    return Controller;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Controller;
