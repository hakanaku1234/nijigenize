"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Live2DCanvas = (function (_super) {
    __extends(Live2DCanvas, _super);
    function Live2DCanvas() {
        _super.apply(this, arguments);
        this.aspectRatio = 0;
    }
    Live2DCanvas.prototype.shouldComponentUpdate = function (props) {
        var _this = this;
        if (props.mutable.currentAssets && (this.props.mutable.currentAssets !== props.mutable.currentAssets)) {
            var _a = props.mutable.currentAssets, model = _a.model, physics = _a.physics, textures = _a.textures;
            this.live2DModel = Live2DModelWebGL.loadModel(model);
            var ratio = this.aspectRatio / (this.live2DModel.getCanvasHeight() / this.live2DModel.getCanvasWidth());
            var _b = ratio > 1
                ? {
                    width: 2.0 / this.live2DModel.getCanvasWidth(),
                    height: 2.0 / (this.live2DModel.getCanvasHeight() * ratio)
                }
                : {
                    width: (2.0 * ratio) / this.live2DModel.getCanvasWidth(),
                    height: 2.0 / this.live2DModel.getCanvasHeight()
                }, width = _b.width, height = _b.height;
            this.live2DModel.setMatrix([
                width, 0, 0, 0,
                0, -height, 0, 0,
                0, 0, 1, 0,
                -1, 1, 0, 1
            ]);
            this.live2DModel.setGL(this.webGLContext);
            // Sad process to make unrequired parts invisible... 
            try {
                this.live2DModel.setPartsOpacity('PARTS_01_ARM_L_B_001', 0);
                this.live2DModel.setPartsOpacity('PARTS_01_ARM_R_B_001', 0);
                this.live2DModel.setPartsOpacity('PARTS_01_ARM_L_B_002', 0);
                this.live2DModel.setPartsOpacity('PARTS_01_ARM_R_B_002', 0);
            }
            catch (e) {
                try {
                    this.live2DModel.setPartsOpacity('PARTS_01_ARM_L_02', 0);
                    this.live2DModel.setPartsOpacity('PARTS_01_ARM_R_02', 0);
                }
                catch (e) {
                    try {
                        this.live2DModel.setPartsOpacity('PARTS_01_ARM_R_B', 0);
                    }
                    catch (e) {
                    }
                }
            }
            this.live2DPhysics = L2DPhysics.load(physics);
            textures.forEach(function (image, index) { return _this.live2DModel.setTexture(index, _this.createTexture(image)); });
        }
        return false;
    };
    Live2DCanvas.prototype.render = function () {
        var _this = this;
        return React.createElement("canvas", {ref: function (canvas) {
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
            _this.aspectRatio = window.innerHeight / window.innerWidth;
            _this.webGLContext = _this.getWebGLContext(canvas);
            _this.drawLive2D();
        }, style: { position: 'absolute', top: 0, zIndex: -1 }});
    };
    Live2DCanvas.prototype.getWebGLContext = function (canvas) {
        var result = null;
        var option = { premultipliedAlpha: true };
        ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'].some(function (contextId) {
            try {
                result = canvas.getContext(contextId, option);
                return true;
            }
            catch (e) {
                return false;
            }
        });
        return result;
    };
    Live2DCanvas.prototype.createTexture = function (image) {
        var texture = this.webGLContext.createTexture();
        if (!texture) {
            console.error('Failed to generate gl texture name.');
            return null;
        }
        this.webGLContext.pixelStorei(this.webGLContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        this.webGLContext.pixelStorei(this.webGLContext.UNPACK_FLIP_Y_WEBGL, 1);
        this.webGLContext.activeTexture(this.webGLContext.TEXTURE0);
        this.webGLContext.bindTexture(this.webGLContext.TEXTURE_2D, texture);
        this.webGLContext.texImage2D(this.webGLContext.TEXTURE_2D, 0, this.webGLContext.RGBA, this.webGLContext.RGBA, this.webGLContext.UNSIGNED_BYTE, image);
        this.webGLContext.texParameteri(this.webGLContext.TEXTURE_2D, this.webGLContext.TEXTURE_MAG_FILTER, this.webGLContext.LINEAR);
        this.webGLContext.texParameteri(this.webGLContext.TEXTURE_2D, this.webGLContext.TEXTURE_MIN_FILTER, this.webGLContext.LINEAR_MIPMAP_NEAREST);
        this.webGLContext.generateMipmap(this.webGLContext.TEXTURE_2D);
        return texture;
    };
    Live2DCanvas.prototype.drawLive2D = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.drawLive2D(); });
        if (!(this.live2DModel && this.live2DPhysics && this.props.mutable.live2DParameter)) {
            return;
        }
        this.webGLContext.clear(this.webGLContext.COLOR_BUFFER_BIT);
        Object.keys(this.props.mutable.live2DParameter).forEach(function (key) {
            return _this.live2DModel.setParamFloat(key, _this.props.mutable.live2DParameter[key]);
        });
        this.live2DPhysics.updateParam(this.live2DModel);
        this.live2DModel.update();
        this.live2DModel.draw();
    };
    return Live2DCanvas;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Live2DCanvas;
