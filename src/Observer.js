"use strict";
var Observer = (function () {
    function Observer(store) {
        this.store = store;
    }
    Observer.prototype.onAssetsLoaded = function (currentAssets) {
        this.update(function () { return ({ currentAssets: currentAssets }); });
    };
    Observer.prototype.updateParameter = function (live2DParameter) {
        this.update(function () { return ({ live2DParameter: live2DParameter }); });
    };
    Observer.prototype.onGetUserMedia = function (stream) {
        this.update(function () { return ({ stream: stream }); });
    };
    Observer.prototype.onToggleTracking = function () {
        this.update(function (mutable) {
            if (mutable.stream) {
                mutable.stream.getTracks()[0].stop();
            }
            return {
                tracking: !mutable.tracking,
                stream: void 0
            };
        });
    };
    Observer.prototype.onChangeModel = function (name) {
        this.update(function (mutable, immutable) { return ({ currentModel: immutable.models[name] || mutable.currentModel }); });
    };
    Observer.prototype.onChangeShowVideo = function (showVideo) {
        this.update(function () { return ({ showVideo: showVideo }); });
    };
    Observer.prototype.onChangeShowTrace = function (showTrace) {
        this.update(function () { return ({ showTrace: showTrace }); });
    };
    Observer.prototype.update = function (update) {
        this.store.setState(function (mutable, _a) {
            var immutable = _a.immutable;
            return update(mutable, immutable);
        });
    };
    return Observer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Observer;
