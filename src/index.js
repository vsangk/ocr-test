import Tesseract from 'tesseract.js';

document.addEventListener('DOMContentLoaded', () => {
  const eng = document.querySelector('.eng');
  const por = document.querySelector('.por');
  const video = document.querySelector('#video');
  const screenshot = document.querySelector('#screenshot');
  const accessButton = document.querySelector('#access');
  const stopButton = document.querySelector('#stop');
  const captureButton = document.querySelector('#capture');
  const ocrButton = document.querySelector('#ocr');
  const output = document.querySelector('#output');
  let currentTarget = document.querySelector('.active');
  let localMediaStream;
  let track;

  function hasGetUserMedia() {
    return !!(navigator.getUserMedia ||
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.msGetUserMedia);
  }

  function accessCamera() {
    const sizeConstraints = {
      video: {
        mandatory: {
          minWidth: 400,
          minHeight: 300
        }
      }
    };

    if (hasGetUserMedia()) {
      const errorCallback = (e) => {
        console.log('No Camera Access', e);
      };

      // Not showing vendor prefixes.
      navigator.getUserMedia(sizeConstraints, (stream) => {
        video.src = window.URL.createObjectURL(stream);
        localMediaStream = stream;
        track = stream.getTracks()[0];
      }, errorCallback);
    } else {
      alert('getUserMedia() is not supported in your browser');
    }
  }

  function snapshot(){
    document.querySelector('.instructions').style.display = 'none';

    const hiddenCanvas = document.querySelector('#canvas');

      // Get the exact size of the video element.
    const width = video.videoWidth;
    const height = video.videoHeight;

      // Context object for working with the canvas.
    const ctx = hiddenCanvas.getContext('2d');

    // Set the canvas to the same dimensions as the video.
    hiddenCanvas.width = width;
    hiddenCanvas.height = height;

    // Draw a copy of the current frame from the video on the canvas.
    ctx.drawImage(video, 0, 0, width, height);

    // Get an image dataURL from the canvas.
    const imageDataURL = hiddenCanvas.toDataURL('image/png');

    // Set the dataURL as source of an image element, showing the captured photo.
    screenshot.setAttribute('src', imageDataURL);
  }

  accessButton.addEventListener('click', accessCamera);
  captureButton.addEventListener('click', snapshot);
  stopButton.addEventListener('click', () => {
    if (track) { track.stop(); }
  });

  const images = document.querySelectorAll('.ocr-links img');
  images.forEach(image => image.addEventListener('click', () => {
    if (currentTarget) {
      currentTarget.classList.remove('active');
    }
    currentTarget = image;
    currentTarget.classList.add('active');
  }));


  ocrButton.addEventListener('click', () => {
    if (currentTarget) {
      Tesseract.recognize(currentTarget)
      .progress(message => { output.innerHTML = 'Loading...'; })
      .catch(err => console.error(err))
      .then(result => {
        const html = result.html;
        const text = result.text;
        output.innerHTML = text;
        // const div = document.createElement('div');
        // div.innerHTML = text;
        // document.body.append(div);
      });
    }
  });
});
