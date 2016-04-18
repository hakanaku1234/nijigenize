# nijigenize

Visit https://nijigenize.herokuapp.com to see how this app works.

## How to run this app

1. `git clone` this project to local.
2. Download Live2D Cubism SDK for WebGL from http://sites.cybernoids.jp/cubism-sdk2/webgl/webgl_dl
3. Copy lib/live2d.min.js, framework/Live2DFramework.js, and sample/SmapleApp1/src/PlatformManager.js from the downloaded SDK folder to this project's public/lib.
  1. These files cannot be uploaded to github because of Live2D's terms of service and threfore `.gitignore`d.
4. Change the implementation of PlatformManager.prototype.loadTexture which is written in the copied PlatformManager.js as follows
  ```js
  PlatformManager.prototype.loadTexture = function(path/*String*/, callback)
  {
    // load textures
    var loadedImage = new Image();
    loadedImage.src = path;

    var thisRef = this;
    loadedImage.onload = function() {
        if (typeof callback == "function") callback(loadedImage);
    };

    loadedImage.onerror = function() {
        console.error("Failed to load image : " + path);
    }
  }
  ```
5. Download Live2D models you like from http://sites.cybernoids.jp/cubism2/samples and put them under public/assets
6. Run `npm i && npm run build && npm start`
7. Open http://localhost:9000 in a browser.
