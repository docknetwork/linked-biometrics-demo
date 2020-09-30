import rules from './rules';
import 'style-loader!css-loader!./styles.css';
import * as fa from 'face-api.js';
import assert from 'assert';

// how dissimilar can faces be while still counting as a match
// 0.6 is usually what the faceapi library author usually goes with but let's
// be a little more strict
const maxMatchDistance = 0.5;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const foobutton = document.getElementById('foobutton');
const otherimage = document.getElementById('otherimage');
const textoutput = document.getElementById('textoutput');
const urlinput = document.getElementById('urlinput');

let targetFace = null; // this will hold the face descriptor the user needs to match

Promise.all([
  linkWebcam(video),
  fa.nets.tinyFaceDetector.loadFromUri('/models'),
  fa.nets.faceLandmark68Net.loadFromUri('/models'),
  fa.nets.faceRecognitionNet.loadFromUri('/models'),
]).then(() => {
  everyFrame(async () => onFrame(canvas, video));
});

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
  let detections = await detectFaces(video);
  fa.matchDimensions(canvas, vsize(video));
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  let rd = fa.resizeResults(detections, vsize(video));
  fa.draw.drawFaceLandmarks(canvas, rd);
  displayText(humanReadableComparison(detections));
}

function humanReadableComparison(detections) {
  if (targetFace === null) return 'Awaiting credential.';
  if (detections.length === 0) return 'How do you expect me to verify the age of an empty room?';
  if (detections.length > 1) return 'One person at a time please.';
  assert(detections.length === 1, 'detections.length !== 1, this was supposed to be checked above');
  const dist = distance(detections[0].descriptor, targetFace);
  if (dist < maxMatchDistance) return `Difference: ${dist}. Match!`;
  return `Difference: ${dist}. No match.`;
}

function vsize(video) {
  return { width: video.videoWidth, height: video.videoHeight };
}

async function getSingleFaceDescriptor(image) {
  let detections = await detectFaces(image);
  if (detections.length !== 1) {
    throw new Error(`Incorrect number of faces in image. Expected 1, got ${detections.length}.`);
  }
  return detections[0].descriptor;
}

async function onFooButton() {
  const iri = urlinput.value;
  try {
    let image = await fetchImage(iri);
    targetFace = await getSingleFaceDescriptor(image);
    await displayOtherImage(image);
  } catch (e) {
    displayText(`Error: ${e}`);
  }
}

async function displayOtherImage(image) {
  let canvas = fa.createCanvasFromMedia(image);
  let detections = await detectFaces(image);
  let rd = fa.resizeResults(detections, { width: canvas.width, height: canvas.height });
  fa.draw.drawFaceLandmarks(canvas, rd);
  otherimage.innerHTML = "";
  otherimage.appendChild(canvas);
}

async function displayText(txt) {
  textoutput.innerHTML = txt.replace('<', '&lt').replace('>', '&gt');
}

// return the euclian distance between two arrays
function distance(as, bs) {
  assert(as.length !== undefined, '"distance" recieved a non-array input');
  assert(as.length === bs.length, 'cant calculate distance beween vectors of different lengths');
  let sum = as.map((_, i) => Math.pow(as[i] - bs[i], 2)).reduce((a, b) => a + b, 0);
  return Math.sqrt(sum);
}

async function detectFaces(image) {
  return await fa.detectAllFaces(image, new fa.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors();
}

async function fetchImage(url) {
  let res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `failed to fetch: (${res.status}) ${res.statusText}, from url: ${url}`
    );
  }
  const blob = await res.blob();
  if (!blob.type.startsWith('image/')) {
    throw new Error(`fetchImage - expected blob type to be of type image/*, instead have: ${blob.type}, for url: ${res.url}`);
  }
  return fa.bufferToImage(blob);
}
