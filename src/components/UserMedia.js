"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var UserMedia = (function (_super) {
    __extends(UserMedia, _super);
    function UserMedia() {
        _super.apply(this, arguments);
    }
    UserMedia.prototype.shouldComponentUpdate = function (props) {
        var _this = this;
        if (props.mutable.tracking && !this.props.mutable.tracking) {
            if (this.props.mutable.stream) {
                return false;
            }
            navigator.getUserMedia({ video: true }, function (stream) { return _this.props.observer.onGetUserMedia(stream); }, function () { });
        }
        return false;
    };
    UserMedia.prototype.render = function () {
        return null;
    };
    return UserMedia;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserMedia;
