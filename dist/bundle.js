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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/demo.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/demo.js":
/*!********************!*\
  !*** ./js/demo.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _recorder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./recorder */ "./js/recorder.js");


const objRecorder = new _recorder__WEBPACK_IMPORTED_MODULE_0__["default"]()

$(document).ready(() => {
    const btnRecord = $("#recordButton");
    const btnPause = $("#pauseButton")
    const btnStop = $("#stopButton")

    btnRecord.click(() => {
        objRecorder.start()
        btnPause.prop('disabled', false)
        btnStop.prop('disabled', false)
        btnRecord.prop('disabled', true)
    })

    btnPause.click(() => {
        if(btnPause.html().trim()==='Pause') {
            btnPause.html('Resume')
        }else{
            btnPause.html('Pause')
        }
        objRecorder.pause()
    })

    btnStop.click(() => {
        objRecorder.stop()
        objRecorder.exportWAV((blob) => {
            btnRecord.prop('disabled', false)
            btnPause.prop('disabled', true)
            btnStop.prop('disabled', true)
            URL = window.URL || window.webkitURL;
            var url = URL.createObjectURL(blob);
            var au = document.createElement('audio');
            var li = document.createElement('li');
            var link = document.createElement('a');

            //name of .wav file to use during upload and download (without extendion)
            var filename = new Date().toISOString();

            //add controls to the <audio> element
            au.controls = true;
            au.src = url;

            //save to disk link
            link.href = url;
            link.download = filename + ".wav"; //download forces the browser to donwload the file using the  filename
            link.innerHTML = "Save to disk";

            //add the new audio element to li
            li.appendChild(au);

            //add the filename to the li
            li.appendChild(document.createTextNode(filename + ".wav "))

            //add the save to disk link to li
            li.appendChild(link);

            //upload link
            var upload = document.createElement('a');
            upload.href = "#";
            upload.innerHTML = "Upload";
            upload.addEventListener("click", function (event) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function (e) {
                    if (this.readyState === 4) {
                        console.log("Server returned: ", e.target.responseText);
                    }
                };
                var fd = new FormData();
                fd.append("audio_data", blob, filename);
                xhr.open("POST", "upload.php", true);
                xhr.send(fd);
            })
            li.appendChild(document.createTextNode(" "))//add a space in between
            li.appendChild(upload)//add the upload link to li

            //add the li element to the ol
            recordingsList.appendChild(li);
        })
    })
})

/***/ }),

/***/ "./js/recorder.js":
/*!************************!*\
  !*** ./js/recorder.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RecorderJS; });
// shim for AudioContext when it's not avb.
const AudioContext = window.AudioContext || window.webkitAudioContext;

class RecorderJS {

    constructor() {
        //stream from getUserMedia()
        this.userMedia = null;
        //Recorder.js object
        this.objRecorder = null;
        //MediaStreamAudioSourceNode we'll be recording
        this.input = null;	
       
    }

    start() {
      
        /*
            Simple constraints object, for more advanced audio features see
            https://addpipe.com/blog/audio-constraints-getusermedia/
        */
        const constraints = { audio: true, video: false }

        /*
            We're using the standard promise based getUserMedia() 
            https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        */
 
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
 
            /*
                create an audio context after getUserMedia is called
                sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
                the sampleRate defaults to the one set in your OS for your playback device
    
            */
            let audioContext = new AudioContext();
 
            // check audioContext.sampleRate
 
 
            /*  assign to this.userMedia for later use  */
            this.userMedia = stream;
 
            /* use the stream */
            this.input = audioContext.createMediaStreamSource(stream);
 
            /* 
                Create the Recorder object and configure to record mono sound (1 channel)
                Recording 2 channels  will double the file size
            */
            this.objRecorder = new Recorder(this.input, { numChannels: 1 })
            this.objRecorder.record()
 
        }).catch(function (err) {
            //enable the record button if getUserMedia() fails
            console.error(err)
        });	
    }

    pause() {
        if (this.objRecorder.recording) {
            this.objRecorder.stop();
        } else {
            this.objRecorder.record();
        }

    }

    stop() {
        console.log("stopButton clicked");

        this.objRecorder.stop();

        //stop microphone access
        this.userMedia.getAudioTracks()[0].stop();
    }

    exportWAV(cb) {
        this.objRecorder.exportWAV(cb)
    }

}


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map