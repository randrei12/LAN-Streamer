const video = document.querySelector('video');
const select = document.querySelector('.windows').children[0];
let startButton = document.querySelector('.startButton');
let source;
let stream;

electron.getSources().then(async (sources) => {
    source = sources[0];
    stream = await streamSource(source);
    sources.forEach((source, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.innerText = source.name;
        // option.onclick = () => console.log(source);
        select.appendChild(option);
    });
    select.onchange = async (e) => {
        source = sources[e.target.value];
        stream = await streamSource(source);
        if (startButton.innerText === 'Stop Stream') startStream();
    }    
}).catch(err => {
    console.error(err);
})
startButton.onclick = async () => {
    if (startButton.innerText === 'Start') {
        startButton.disabled = true;
        startButton.innerText = 'Streaming...';
        startStream();
        startButton.innerText = 'Stop Stream';
        startButton.disabled = false;
    } else if (startButton.innerText === 'Stop Stream') {
        startButton.disabled = true;
        startButton.innerText = 'Stopping...';
        video.srcObject.getTracks().forEach(track => track.stop());

        startButton.innerText = 'Start';
        startButton.disabled = false;
    }
}
var peer = new Peer('electron', {
    host: 'localhost',
    port: 2132,
    path: '/'
});

peer.on('connection', conn => {
    if (stream) startStream();
})

async function streamSource(source) {
    let stream = await navigator.mediaDevices.getUserMedia({
        audio: {
            mandatory: {
                chromeMediaSource: 'desktop',
            },
        },
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    });
    // peer.call('video', stream);

    video.srcObject = stream;
    video.muted = true;
    video.play();

    return stream;
}

function startStream() {
    console.log(peer.call('video', stream));
}