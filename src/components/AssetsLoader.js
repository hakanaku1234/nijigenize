"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var AssetsLoader = (function (_super) {
    __extends(AssetsLoader, _super);
    function AssetsLoader() {
        _super.apply(this, arguments);
    }
    AssetsLoader.prototype.componentDidMount = function () {
        this.manager = new PlatformManager();
        Live2D.init();
        Live2DFramework.setPlatformManager(this.manager);
    };
    AssetsLoader.prototype.shouldComponentUpdate = function (props) {
        var _this = this;
        if (props.mutable.currentModel === this.props.mutable.currentModel) {
            return false;
        }
        if (props.mutable.currentModel) {
            var _a = props.mutable.currentModel, model_1 = _a.model, physics_1 = _a.physics, textures = _a.textures;
            Promise.all([
                new Promise(function (resolve) { return _this.manager.loadBytes(model_1, resolve); }),
                new Promise(function (resolve) { return _this.manager.loadBytes(physics_1, resolve); }),
                Promise.all(textures.map(function (texture) {
                    return new Promise(function (resolve) { return _this.manager.loadTexture(texture, resolve); });
                }))
            ])
                .then(function (_a) {
                var model = _a[0], physics = _a[1], textures = _a[2];
                return _this.props.observer.onAssetsLoaded({ model: model, physics: physics, textures: textures });
            });
        }
        return false;
    };
    AssetsLoader.prototype.render = function () {
        return null;
    };
    return AssetsLoader;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AssetsLoader;
