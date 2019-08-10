// shim for AudioContext when it's not avb.
const AudioContext = window.AudioContext || window.webkitAudioContext;

export default class RecorderJS {

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
