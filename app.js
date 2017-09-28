'use strict';

const sourcesDiv = document.getElementById('sources');
const videoDimensions = [{width: 1920, height: 1080, frameRate: 30}];
function getSources () {
    const videoDimIndex = 0; // TODO

    getDeviceList('videoinput', (err, sources) => {
        if (err) {
            console.error('getDeviceList(videoinput)', err);
            throw err;
        }

        console.info('getDeviceList sources', JSON.stringify(sources, null, 2));

        sourcesDiv.innerHTML = '';
        sources.forEach(vSource => {
            let item = document.createElement('div');

            let btn = document.createElement('button');
            btn.textContent = `${vSource.label} (${vSource.deviceId})`;
            btn.onclick = function () {
                setVideo({
                    audio: false,
                    video: {
                        mandatory: {
                            sourceId: vSource.deviceId,
                            minWidth: videoDimensions[videoDimIndex].width,
                            maxWidth: videoDimensions[videoDimIndex].width,
                            minHeight: videoDimensions[videoDimIndex].height,
                            maxHeight: videoDimensions[videoDimIndex].height,
                            minFrameRate: videoDimensions[videoDimIndex].frameRate,
                            maxFrameRate: videoDimensions[videoDimIndex].frameRate,
                        }
                    }
                });
            };

            item.appendChild(btn);
            item.appendChild(document.createElement('br'));
            sourcesDiv.appendChild(item);
        });
    });
}

// HELPERS
/** Get list of media devices
 *  @param {string} kind - videoinput, audioinput, audiooutput
 *  @param {function} callback - accepting error as first or array as second parameter
 */
function getDeviceList(kind, callback) {
    navigator.mediaDevices.enumerateDevices().then(
        function (values) {
            let results = [];
            for (var i = 0; i < values.length; i++) {
                if (values[i].kind === kind) {
                    results.push(values[i]);
                }
            }
            callback(null, results);
        },
        function (reason) {
            let err = 'Unable to enumerate devices (' + reason + ')';
            console.error(err);
            callback(err);
        }
    );
}

const video = document.getElementById('video');
function setVideo (mediaConstraints) {
    navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(stream => {
            stopVideo();
            video.srcObject = stream;
        })
        .catch(err => {
            console.error('getUserMedia error', err);
            throw err;
        });
}

function stopVideo () {
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(t => {
            t.stop();
        });

        video.srcObject = null;
    }
}