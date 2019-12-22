"use strict";
exports.__esModule = true;
exports.getImageSources = function (url) { return fetch(url).then(function (response) { return response.text(); })
    .then(function (html) { return html.match(/\<img.*src=["'](\S*)["']/gi); }); };
exports.fetchSingleImage = function (src) { return fetch(src).then(function (response) { return response.blob(); })
    .then(function (blob) { return URL.createObjectURL(blob); })
    .then(function (x) { return console.log({ x: x }); }); };
exports.fetchImages = function (srcs) { return Promise.(); };
