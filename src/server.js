"use strict";
var express = require('express');
var React = require('react');
var server_1 = require('react-dom/server');
var Container_1 = require('./components/Container');
var glob = require('glob');
var path = require('path');
var publicDir = __dirname + "/../public", models = glob.sync(publicDir + "/assets/**/*.model.json").reduce(function (acc, file) {
    var _a = require(file), model = _a.model, physics = _a.physics, textures = _a.textures, dirname = path.relative(publicDir, path.dirname(file));
    if (!model || !physics || !textures) {
        return acc;
    }
    var name = model.split(/\./)[0];
    acc[name] = {
        name: name,
        model: path.join(dirname, model),
        physics: path.join(dirname, physics),
        textures: textures.map(function (texture) { return path.join(dirname, texture); })
    };
    return acc;
}, {}), app = express(), port = process.env.PORT || 9000;
app.use(express.static(publicDir));
app.get('/', function (req, res) {
    res.send(render(Container_1.default, {
        mutable: {
            tracking: false,
            detectingFeature: false,
            showVideo: false,
            showTrace: false
        },
        immutable: { models: models }
    }));
});
app.listen(port, function () { return console.log('listening...' + port); });
function render(Component, props) {
    return "<!DOCTYPE html>" + server_1.renderToString(React.createElement("html", null, React.createElement("head", null, React.createElement("meta", {charSet: 'UTF-8'}), React.createElement("title", null, "nijigenize"), React.createElement("meta", {name: 'viewport', content: 'width=device-width, initial-scale=0.5, minimum-scale=1.0, maximum-scale=4.0'})), React.createElement("body", {style: { margin: 0 }}, React.createElement("div", {id: 'reactRoot', "data-props": JSON.stringify(props), dangerouslySetInnerHTML: { __html: server_1.renderToString(React.createElement(Component, React.__spread({}, props))) }}), React.createElement("script", {src: './lib/live2d.min.js'}), React.createElement("script", {src: './lib/Live2DFramework.js'}), React.createElement("script", {src: './lib/PlatformManager.js'}), React.createElement("script", {src: './lib/clmtrackr.min.js'}), React.createElement("script", {src: './lib/model_pca_10_svm.js'}), React.createElement("script", {src: './client.js'}))));
}
