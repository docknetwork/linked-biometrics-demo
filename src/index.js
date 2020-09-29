import rules from './rules';
import 'style-loader!css-loader!./styles.css';
import * as fa from 'face-api.js';

// how dissimilar can faces be while still counting as a match
// 0.6 is usually what the faceapi library author usually goes with but let's
// be a little more strict
const maxMatchDistance = 0.5;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const foobutton = document.getElementById('foobutton');
const otherimage = document.getElementById('otherimage');
const textoutput = document.getElementById('textoutput');

Promise.all([
  linkWebcam(video),
  fa.nets.tinyFaceDetector.loadFromUri('/models'),
  fa.nets.faceLandmark68Net.loadFromUri('/models'),
  fa.nets.faceRecognitionNet.loadFromUri('/models'),
  fa.nets.ssdMobilenetv1.loadFromUri('/models'),
]).then(() => {
  everyFrame(async () => onFrame(canvas, video));
})

foobutton.onclick = onFooButton;

function linkWebcam(video) {
  navigator.getUserMedia(
    { video: {} },
    stream => {
      video.srcObject = stream
    },
    err => { throw err },
  );
  return new Promise(resolve => {
    video.addEventListener('play', resolve);
  });
}

function everyFrame(acb) {
  acb().then(() => requestAnimationFrame(() => everyFrame(acb)));
}

async function onFrame(canvas, video) {
  let detections = await fa.detectAllFaces(video, new fa.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors();
  fa.matchDimensions(canvas, vsize(video));
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  let rd = fa.resizeResults(detections, vsize(video));
  fa.draw.drawFaceLandmarks(canvas, rd);
}

function vsize(video) {
  return { width: video.videoWidth, height: video.videoHeight };
}

async function compareFace(video, image) {
  const [
    ,
    ,
    vd,
    id,
  ] = await Promise.all([
    assertSingleFace(video),
    assertSingleFace(image),
    fa.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor(),
    fa.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor(),
  ]);
  let fma = new fa.FaceMatcher(new fa.LabeledFaceDescriptors("correct", [id.descriptor]), maxMatchDistance);
  let match = fma.findBestMatch(vd.descriptor);
  throw `<pre>${JSON.stringify(match, null, 2)}</pre>`;
}

async function assertSingleFace(video) {
  let detections = await fa.detectAllFaces(video, new fa.TinyFaceDetectorOptions());
  if (detections.length !== 1) {
    throw new Error(`Incorrect number of faces in image. Expected 1, got ${detections.length}.`);
  }
}

async function onFooButton() {
  try {
    let image = await fa.fetchImage("/andrew.jpg");
    await displayOtherImage(image);
    await compareFace(video, image);
  } catch (e) {
    displayText(e);
  }
}

async function displayOtherImage(image) {
  let canvas = fa.createCanvasFromMedia(image);
  let detections = await fa.detectAllFaces(image, new fa.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors();
  let rd = fa.resizeResults(detections, { width: canvas.width, height: canvas.height });
  fa.draw.drawFaceLandmarks(canvas, rd);

  otherimage.innerHTML = "";
  otherimage.appendChild(canvas);
}

async function displayText(txt) {
  textoutput.innerHTML = txt;
}
