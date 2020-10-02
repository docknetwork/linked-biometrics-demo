import 'style-loader!css-loader!./styles.css';
import * as fa from 'face-api.js';
import assert from 'assert';
import { verifyAge } from './verify';
import { } from './issuing';
import { unwrapSingle, alertOnError } from './common';

// how dissimilar can faces be while still counting as a match
// 0.6 is usually what the faceapi library author usually goes with but let's
// be a little more strict
const maxMatchDistance = 0.5;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const otherimage = document.getElementById('otherimage');
const textoutput = document.getElementById('textoutput');
const vpupload = document.getElementById('vpupload');
const showpresentation = document.getElementById('showpresentation');

let targetFace = null; // this will hold the face descriptor the user needs to match

vpupload.oninput = onVpUpload;
alertOnError(main)();

async function main() {
  await Promise.all([
    linkWebcam(video),
    fa.nets.tinyFaceDetector.loadFromUri('/models'),
    fa.nets.faceLandmark68Net.loadFromUri('/models'),
    fa.nets.faceRecognitionNet.loadFromUri('/models'),
  ]);
  everyFrame(async () => onFrame(canvas, video));
}

async function linkWebcam(video) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: {} });
  video.srcObject = stream;
  await firstEvent(video, 'play');
}

async function firstEvent(eventTarget, event) {
  return await new Promise(resolve => {
    eventTarget.addEventListener(event, resolve, { once: true });
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

async function onVpUpload() {
  try {
    const blob = unwrapSingle(vpupload.files);
    const presentaion = JSON.parse(await blob.text());
    displayPresentation(JSON.stringify(presentaion, null, 2));
    const imageuri = await verifyAge(presentaion);
    const image = await fetchImage(imageuri);
    await displayOtherImage(image);
    targetFace = unwrapSingle(
      await detectFaces(image),
      'the number of faces in the image provided was not 1'
    ).descriptor;
  } catch (e) {
    alert('bad verification. see developer console');
    throw e;
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

function displayText(txt) {
  textoutput.innerHTML = escape(txt);
}

function displayPresentation(txt) {
  showpresentation.innerHTML = escape(txt);
}

function escape(str) {
  return `${str}`.replace('<', '&lt').replace('>', '&gt');
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
