import {
  require_react
} from "./chunk-65KY755N.js";
import {
  __commonJS
} from "./chunk-V4OQ3NZ2.js";

// node_modules/react-google-drive-picker/dist/typeDefs.js
var require_typeDefs = __commonJS({
  "node_modules/react-google-drive-picker/dist/typeDefs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultConfiguration = void 0;
    exports.defaultConfiguration = {
      clientId: "",
      developerKey: "",
      viewId: "DOCS",
      callbackFunction: function() {
        return null;
      }
    };
  }
});

// node_modules/react-google-drive-picker/dist/useInjectScript.js
var require_useInjectScript = __commonJS({
  "node_modules/react-google-drive-picker/dist/useInjectScript.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var react_1 = require_react();
    var injectorState = {
      queue: {},
      injectorMap: {},
      scriptMap: {}
    };
    function useInjectScript(url) {
      var _a = (0, react_1.useState)({
        loaded: false,
        error: false
      }), state = _a[0], setState = _a[1];
      (0, react_1.useEffect)(function() {
        var _a2, _b, _c, _d, _e;
        if (!((_a2 = injectorState.injectorMap) === null || _a2 === void 0 ? void 0 : _a2[url])) {
          injectorState.injectorMap[url] = "init";
        }
        if (injectorState.injectorMap[url] === "loaded") {
          setState({
            loaded: true,
            error: false
          });
          return;
        }
        if (injectorState.injectorMap[url] === "error") {
          setState({
            loaded: true,
            error: true
          });
          return;
        }
        var onScriptEvent = function(error) {
          var _a3, _b2, _c2, _d2;
          if (error)
            console.log("error loading the script");
          (_b2 = (_a3 = injectorState.queue) === null || _a3 === void 0 ? void 0 : _a3[url]) === null || _b2 === void 0 ? void 0 : _b2.forEach(function(job) {
            return job(error);
          });
          if (error && injectorState.scriptMap[url]) {
            (_d2 = (_c2 = injectorState.scriptMap) === null || _c2 === void 0 ? void 0 : _c2[url]) === null || _d2 === void 0 ? void 0 : _d2.remove();
            injectorState.injectorMap[url] = "error";
          } else
            injectorState.injectorMap[url] = "loaded";
          delete injectorState.scriptMap[url];
        };
        var stateUpdate = function(error) {
          setState({
            loaded: true,
            error
          });
        };
        if (!((_b = injectorState.scriptMap) === null || _b === void 0 ? void 0 : _b[url])) {
          injectorState.scriptMap[url] = document.createElement("script");
          if (injectorState.scriptMap[url]) {
            injectorState.scriptMap[url].src = url;
            injectorState.scriptMap[url].async = true;
            document.body.append(injectorState.scriptMap[url]);
            injectorState.scriptMap[url].addEventListener("load", function() {
              return onScriptEvent(false);
            });
            injectorState.scriptMap[url].addEventListener("error", function() {
              return onScriptEvent(true);
            });
            injectorState.injectorMap[url] = "loading";
          }
        }
        if (!((_c = injectorState.queue) === null || _c === void 0 ? void 0 : _c[url])) {
          injectorState.queue[url] = [stateUpdate];
        } else {
          (_e = (_d = injectorState.queue) === null || _d === void 0 ? void 0 : _d[url]) === null || _e === void 0 ? void 0 : _e.push(stateUpdate);
        }
        return function() {
          var _a3, _b2;
          if (!injectorState.scriptMap[url])
            return;
          (_a3 = injectorState.scriptMap[url]) === null || _a3 === void 0 ? void 0 : _a3.removeEventListener("load", function() {
            return onScriptEvent(true);
          });
          (_b2 = injectorState.scriptMap[url]) === null || _b2 === void 0 ? void 0 : _b2.removeEventListener("error", function() {
            return onScriptEvent(true);
          });
        };
      }, [url]);
      return [state.loaded, state.error];
    }
    exports.default = useInjectScript;
  }
});

// node_modules/react-google-drive-picker/dist/index.js
var require_dist = __commonJS({
  "node_modules/react-google-drive-picker/dist/index.js"(exports) {
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var react_1 = require_react();
    var typeDefs_1 = require_typeDefs();
    var useInjectScript_1 = __importDefault(require_useInjectScript());
    function useDrivePicker() {
      var defaultScopes = ["https://www.googleapis.com/auth/drive.readonly"];
      var _a = (0, useInjectScript_1.default)("https://apis.google.com/js/api.js"), loaded = _a[0], error = _a[1];
      var _b = (0, useInjectScript_1.default)("https://accounts.google.com/gsi/client"), loadedGsi = _b[0], errorGsi = _b[1];
      var _c = (0, react_1.useState)(false), pickerApiLoaded = _c[0], setpickerApiLoaded = _c[1];
      var _d = (0, react_1.useState)(false), openAfterAuth = _d[0], setOpenAfterAuth = _d[1];
      var _e = (0, react_1.useState)(false), authWindowVisible = _e[0], setAuthWindowVisible = _e[1];
      var _f = (0, react_1.useState)(typeDefs_1.defaultConfiguration), config = _f[0], setConfig = _f[1];
      var _g = (0, react_1.useState)(), authRes = _g[0], setAuthRes = _g[1];
      var picker;
      (0, react_1.useEffect)(function() {
        if (loaded && !error && loadedGsi && !errorGsi && !pickerApiLoaded) {
          loadApis();
        }
      }, [loaded, error, loadedGsi, errorGsi, pickerApiLoaded]);
      (0, react_1.useEffect)(function() {
        if (openAfterAuth && config.token && loaded && !error && loadedGsi && !errorGsi && pickerApiLoaded) {
          createPicker(config);
          setOpenAfterAuth(false);
        }
      }, [
        openAfterAuth,
        config.token,
        loaded,
        error,
        loadedGsi,
        errorGsi,
        pickerApiLoaded
      ]);
      var openPicker = function(config2) {
        setConfig(config2);
        if (!config2.token) {
          var client = google.accounts.oauth2.initTokenClient({
            client_id: config2.clientId,
            scope: (config2.customScopes ? __spreadArray(__spreadArray([], defaultScopes, true), config2.customScopes, true) : defaultScopes).join(" "),
            callback: function(tokenResponse) {
              setAuthRes(tokenResponse);
              createPicker(__assign(__assign({}, config2), { token: tokenResponse.access_token }));
            }
          });
          client.requestAccessToken();
        }
        if (config2.token && loaded && !error && pickerApiLoaded) {
          return createPicker(config2);
        }
      };
      var loadApis = function() {
        window.gapi.load("auth");
        window.gapi.load("picker", { callback: onPickerApiLoad });
      };
      var onPickerApiLoad = function() {
        setpickerApiLoaded(true);
      };
      var createPicker = function(_a2) {
        var token = _a2.token, _b2 = _a2.appId, appId = _b2 === void 0 ? "" : _b2, _c2 = _a2.supportDrives, supportDrives = _c2 === void 0 ? false : _c2, developerKey = _a2.developerKey, _d2 = _a2.viewId, viewId = _d2 === void 0 ? "DOCS" : _d2, disabled = _a2.disabled, multiselect = _a2.multiselect, setOrigin = _a2.setOrigin, _e2 = _a2.showUploadView, showUploadView = _e2 === void 0 ? false : _e2, showUploadFolders = _a2.showUploadFolders, _f2 = _a2.setParentFolder, setParentFolder = _f2 === void 0 ? "" : _f2, viewMimeTypes = _a2.viewMimeTypes, customViews = _a2.customViews, _g2 = _a2.locale, locale = _g2 === void 0 ? "en" : _g2, setIncludeFolders = _a2.setIncludeFolders, setSelectFolderEnabled = _a2.setSelectFolderEnabled, _h = _a2.disableDefaultView, disableDefaultView = _h === void 0 ? false : _h, callbackFunction = _a2.callbackFunction;
        if (disabled)
          return false;
        var view = new google.picker.DocsView(google.picker.ViewId[viewId]);
        if (viewMimeTypes)
          view.setMimeTypes(viewMimeTypes);
        if (setIncludeFolders)
          view.setIncludeFolders(true);
        if (setSelectFolderEnabled)
          view.setSelectFolderEnabled(true);
        var uploadView = new google.picker.DocsUploadView();
        if (viewMimeTypes)
          uploadView.setMimeTypes(viewMimeTypes);
        if (showUploadFolders)
          uploadView.setIncludeFolders(true);
        if (setParentFolder)
          uploadView.setParent(setParentFolder);
        if (setParentFolder)
          view.setParent(setParentFolder);
        picker = new google.picker.PickerBuilder().setAppId(appId).setOAuthToken(token).setDeveloperKey(developerKey).setLocale(locale).setCallback(callbackFunction);
        if (setOrigin) {
          picker.setOrigin(setOrigin);
        }
        if (!disableDefaultView) {
          picker.addView(view);
        }
        if (customViews) {
          customViews.map(function(view2) {
            return picker.addView(view2);
          });
        }
        if (multiselect) {
          picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
        }
        if (showUploadView)
          picker.addView(uploadView);
        if (supportDrives) {
          picker.enableFeature(google.picker.Feature.SUPPORT_DRIVES);
        }
        picker.build().setVisible(true);
        return true;
      };
      return [openPicker, authRes];
    }
    exports.default = useDrivePicker;
  }
});
export default require_dist();
//# sourceMappingURL=react-google-drive-picker.js.map
