'use strict';

const video = document.getElementById('video');
const constraintsSelect = document.getElementById('constraints');
const videoDimensions = [
    {width: 1920, height: 1080, frameRate: 30},
    {width: 1280, height:  720, frameRate: 30},
    {width:  640, height:  360, frameRate: 30}
];

videoDimensions.forEach((c, i) => {
    let opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = c.width+'x'+c.height+'@'+c.frameRate;
    constraintsSelect.appendChild(opt);
});

function setVideo (mediaConstraints) {
    stopVideo();
    navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            alert(JSON.stringify(err, null, 2));
            console.error('getUserMedia error', err);
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

video.ondblclick = function (e) {
    if (video.className === '') {
        video.className = 'rotated';
    } else {
        video.className = '';
    }
};

function getSources () {
    const sourcesDiv = document.getElementById('sources');

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
            btn.textContent = vSource.label;
            btn.title = vSource.deviceId;
            btn.onclick = function () {
                const videoDimIndex = parseInt(constraintsSelect.value);
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
        function (err) {
            console.error(err);
            callback(err);
        }
    );
}

