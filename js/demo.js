import RecorderJS from './recorder'

const objRecorder = new RecorderJS()

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