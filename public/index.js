var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// visit the URL below to see what CORS PROXY is all about
var CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
// captures the 'src' value of <img/> tags
var imageSrcRegexp = /\<img.*src=["'](\S*)["']/gi;
// notify the user about what's happening
var updateStatus = function (status) { return document.querySelector(".status-display").innerHTML = status; };
// appendGroups is a helper function for getAllMatches that appends a regex capture to the 'groups' array
var appendGroups = function (groups, rexec) { return rexec === null ? groups === undefined ? [] : groups : groups === undefined ? [rexec[1]] : __spreadArrays(groups, [rexec[1]]); };
// getAllMatches returns an array of first group captures from iterated regex.exec calls, i.e. /a(.)/g.exec("abacad") => ["b","c","d"]
var getAllMatches = function (str, regexp, groups) { return regexp.lastIndex === 0 && groups !== undefined ? groups : getAllMatches(str, regexp, appendGroups(groups, regexp.exec(str))); };
// getImageSources returns an array of '<img src' values given a URL, or fails
var getImageSources = function (url) { return fetch("" + CORS_PROXY + url)
    .then(function (response) { return response.text(); })
    .then(function (html) { return getAllMatches(html, imageSrcRegexp); })["catch"](function (e) { return updateStatus(e ? e.message : "Cannot access " + url + " response."); }); };
// normSource ensures that domain is prepended to URL if src does not start with http, to handle relative paths
var normSource = function (src, url) { return src.startsWith('http') ? "" + CORS_PROXY + src : "" + CORS_PROXY + url + src; };
// fetchSingleImage will  download the image at `src` and return its DOMString representation 
var fetchSingleImage = function (src, pageUrl, normedSrc) { return normedSrc ? fetch(normedSrc).then(function (response) { return response.blob(); })
    .then(function (blob) { return URL.createObjectURL(blob); }) : fetchSingleImage(src, pageUrl, normSource(src, pageUrl)); };
// Add the image to the document object
var displayImage = function (src) {
    var _a;
    var imagesList = document.querySelector(".images-list");
    var listItem = document.createElement("li");
    var image = document.createElement("img");
    image.src = src;
    listItem.appendChild(image);
    (_a = imagesList) === null || _a === void 0 ? void 0 : _a.append(listItem);
};
// fetchAndDisplayImages displays images at URL 
var fetchAndDisplayImages = function (url) { return getImageSources(url)
    .then(function (srcs) { return Array.isArray(srcs) ? srcs.forEach(function (src) { return fetchSingleImage(src, url).then(function (img) { return displayImage(img); }); }) : updateStatus("No images found at " + url); }); };
// onURLSubmit is event capture for 'Submit' button click
var onURLSubmit = function () {
    updateStatus("");
    var input = document.querySelector("#imageUrl");
    var inputValue = input.value;
    var url = inputValue.endsWith("/") ? inputValue : inputValue + "/";
    var isUrl = url.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i);
    if (!isUrl) {
        updateStatus("URL '" + url + "' is invalid. Please be sure to prepend http:// or https://");
        return;
    }
    else
        fetchAndDisplayImages(url);
};
document.getElementById("urlSearch");
document.querySelector("#urlSearch").addEventListener("click", onURLSubmit);
