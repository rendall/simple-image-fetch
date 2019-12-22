"use strict";
// visit the URL below to see what CORS PROXY is all about
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
// captures the 'src' value of <img/> tags
const imageSrcRegexp = /\<img.*src=["'](\S*)["']/gi;
// notify the user about what's happening
const updateStatus = (status) => document.querySelector(".status-display").innerHTML = status;
// appendGroups is a helper function for getAllMatches that appends a regex capture to the 'groups' array
const appendGroups = (groups, rexec) => rexec === null ? groups === undefined ? [] : groups : groups === undefined ? [rexec[1]] : [...groups, rexec[1]];
// getAllMatches returns an array of first group captures from iterated regex.exec calls, i.e. /a(.)/g.exec("abacad") => ["b","c","d"]
const getAllMatches = (str, regexp, groups) => regexp.lastIndex === 0 && groups !== undefined ? groups : getAllMatches(str, regexp, appendGroups(groups, regexp.exec(str)));
// getImageSources returns an array of '<img src' values given a URL, or fails
const getImageSources = (url) => fetch(`${CORS_PROXY}${url}`)
    .then((response) => response.text())
    .then((html) => getAllMatches(html, imageSrcRegexp))
    .catch(e => updateStatus(e ? e.message : `Cannot access ${url} response.`));
// normSource ensures that domain is prepended to URL if src does not start with http, to handle relative paths
const normSource = (src, url) => src.startsWith('http') ? `${CORS_PROXY}${src}` : `${CORS_PROXY}${url}${src}`;
// fetchSingleImage will  download the image at `src` and return its DOMString representation 
const fetchSingleImage = (src, pageUrl, normedSrc) => normedSrc ? fetch(normedSrc).then(response => response.blob())
    .then(blob => URL.createObjectURL(blob)) : fetchSingleImage(src, pageUrl, normSource(src, pageUrl));
// Add the image to the document object
const displayImage = (src) => {
    var _a;
    const imagesList = document.querySelector(".images-list");
    const listItem = document.createElement("li");
    const image = document.createElement("img");
    image.src = src;
    listItem.appendChild(image);
    (_a = imagesList) === null || _a === void 0 ? void 0 : _a.append(listItem);
};
// fetchAndDisplayImages displays images at URL 
const fetchAndDisplayImages = (url) => getImageSources(url)
    .then((srcs) => Array.isArray(srcs) ? srcs.forEach(src => fetchSingleImage(src, url).then(img => displayImage(img))) : updateStatus(`No images found at ${url}`));
// onURLSubmit is event capture for 'Submit' button click
const onURLSubmit = () => {
    updateStatus("");
    const input = document.querySelector("#imageUrl");
    const inputValue = input.value;
    const url = inputValue.endsWith("/") ? inputValue : `${inputValue}/`;
    const isUrl = url.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i);
    if (!isUrl) {
        updateStatus(`URL '${url}' is invalid. Please be sure to prepend http:// or https://`);
        return;
    }
    else
        fetchAndDisplayImages(url);
};
document.querySelector("#urlSearch").addEventListener("click", onURLSubmit);
