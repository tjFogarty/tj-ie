/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/site/_includes/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/instant.page/instantpage.js":
/*!**************************************************!*\
  !*** ./node_modules/instant.page/instantpage.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*! instant.page v3.0.0 - (C) 2019 Alexandre Dieulot - https://instant.page/license */\n\nlet mouseoverTimer\nlet lastTouchTimestamp\nconst prefetches = new Set()\nconst prefetchElement = document.createElement('link')\nconst isSupported = prefetchElement.relList && prefetchElement.relList.supports && prefetchElement.relList.supports('prefetch')\n                    && window.IntersectionObserver && 'isIntersecting' in IntersectionObserverEntry.prototype\nconst allowQueryString = 'instantAllowQueryString' in document.body.dataset\nconst allowExternalLinks = 'instantAllowExternalLinks' in document.body.dataset\nconst useWhitelist = 'instantWhitelist' in document.body.dataset\n\nlet delayOnHover = 65\nlet useMousedown = false\nlet useMousedownOnly = false\nlet useViewport = false\nif ('instantIntensity' in document.body.dataset) {\n  const intensity = document.body.dataset.instantIntensity\n\n  if (intensity.substr(0, 'mousedown'.length) == 'mousedown') {\n    useMousedown = true\n    if (intensity == 'mousedown-only') {\n      useMousedownOnly = true\n    }\n  }\n  else if (intensity.substr(0, 'viewport'.length) == 'viewport') {\n    if (!(navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType.includes('2g')))) {\n      if (intensity == \"viewport\") {\n        /* Biggest iPhone resolution (which we want): 414 × 896 = 370944\n         * Small 7\" tablet resolution (which we don’t want): 600 × 1024 = 614400\n         * Note that the viewport (which we check here) is smaller than the resolution due to the UI’s chrome */\n        if (document.documentElement.clientWidth * document.documentElement.clientHeight < 450000) {\n          useViewport = true\n        }\n      }\n      else if (intensity == \"viewport-all\") {\n        useViewport = true\n      }\n    }\n  }\n  else {\n    const milliseconds = parseInt(intensity)\n    if (!isNaN(milliseconds)) {\n      delayOnHover = milliseconds\n    }\n  }\n}\n\nif (isSupported) {\n  const eventListenersOptions = {\n    capture: true,\n    passive: true,\n  }\n\n  if (!useMousedownOnly) {\n    document.addEventListener('touchstart', touchstartListener, eventListenersOptions)\n  }\n\n  if (!useMousedown) {\n    document.addEventListener('mouseover', mouseoverListener, eventListenersOptions)\n  }\n  else {\n    document.addEventListener('mousedown', mousedownListener, eventListenersOptions)\n  }\n\n  if (useViewport) {\n    let triggeringFunction\n    if (window.requestIdleCallback) {\n      triggeringFunction = (callback) => {\n        requestIdleCallback(callback, {\n          timeout: 1500,\n        })\n      }\n    }\n    else {\n      triggeringFunction = (callback) => {\n        callback()\n      }\n    }\n\n    triggeringFunction(() => {\n      const intersectionObserver = new IntersectionObserver((entries) => {\n        entries.forEach((entry) => {\n          if (entry.isIntersecting) {\n            const linkElement = entry.target\n            intersectionObserver.unobserve(linkElement)\n            preload(linkElement.href)\n          }\n        })\n      })\n\n      document.querySelectorAll('a').forEach((linkElement) => {\n        if (isPreloadable(linkElement)) {\n          intersectionObserver.observe(linkElement)\n        }\n      })\n    })\n  }\n}\n\nfunction touchstartListener(event) {\n  /* Chrome on Android calls mouseover before touchcancel so `lastTouchTimestamp`\n   * must be assigned on touchstart to be measured on mouseover. */\n  lastTouchTimestamp = performance.now()\n\n  const linkElement = event.target.closest('a')\n\n  if (!isPreloadable(linkElement)) {\n    return\n  }\n\n  preload(linkElement.href)\n}\n\nfunction mouseoverListener(event) {\n  if (performance.now() - lastTouchTimestamp < 1100) {\n    return\n  }\n\n  const linkElement = event.target.closest('a')\n\n  if (!isPreloadable(linkElement)) {\n    return\n  }\n\n  linkElement.addEventListener('mouseout', mouseoutListener, {passive: true})\n\n  mouseoverTimer = setTimeout(() => {\n    preload(linkElement.href)\n    mouseoverTimer = undefined\n  }, delayOnHover)\n}\n\nfunction mousedownListener(event) {\n  const linkElement = event.target.closest('a')\n\n  if (!isPreloadable(linkElement)) {\n    return\n  }\n\n  preload(linkElement.href)\n}\n\nfunction mouseoutListener(event) {\n  if (event.relatedTarget && event.target.closest('a') == event.relatedTarget.closest('a')) {\n    return\n  }\n\n  if (mouseoverTimer) {\n    clearTimeout(mouseoverTimer)\n    mouseoverTimer = undefined\n  }\n}\n\nfunction isPreloadable(linkElement) {\n  if (!linkElement || !linkElement.href) {\n    return\n  }\n\n  if (useWhitelist && !('instant' in linkElement.dataset)) {\n    return\n  }\n\n  if (!allowExternalLinks && linkElement.origin != location.origin && !('instant' in linkElement.dataset)) {\n    return\n  }\n\n  if (!['http:', 'https:'].includes(linkElement.protocol)) {\n    return\n  }\n\n  if (linkElement.protocol == 'http:' && location.protocol == 'https:') {\n    return\n  }\n\n  if (!allowQueryString && linkElement.search && !('instant' in linkElement.dataset)) {\n    return\n  }\n\n  if (linkElement.hash && linkElement.pathname + linkElement.search == location.pathname + location.search) {\n    return\n  }\n\n  if ('noInstant' in linkElement.dataset) {\n    return\n  }\n\n  return true\n}\n\nfunction preload(url) {\n  if (prefetches.has(url)) {\n    return\n  }\n\n  const prefetcher = document.createElement('link')\n  prefetcher.rel = 'prefetch'\n  prefetcher.href = url\n  document.head.appendChild(prefetcher)\n\n  prefetches.add(url)\n}\n\n\n//# sourceURL=webpack:///./node_modules/instant.page/instantpage.js?");

/***/ }),

/***/ "./src/site/_includes/css/manifest.css":
/*!*********************************************!*\
  !*** ./src/site/_includes/css/manifest.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/site/_includes/css/manifest.css?");

/***/ }),

/***/ "./src/site/_includes/js/index.js":
/*!****************************************!*\
  !*** ./src/site/_includes/js/index.js ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _css_manifest_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/manifest.css */ \"./src/site/_includes/css/manifest.css\");\n/* harmony import */ var _css_manifest_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_manifest_css__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var instant_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! instant.page */ \"./node_modules/instant.page/instantpage.js\");\n/* harmony import */ var instant_page__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(instant_page__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n\n//# sourceURL=webpack:///./src/site/_includes/js/index.js?");

/***/ })

/******/ });