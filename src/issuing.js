import { createAgePresentation } from './scripts/create_presentation';
import { blobToDataUrl, unwrapSingle, alertOnError } from './common';
import assert from 'assert';
import { issue } from 'vc-js';

const issuebutton = document.getElementById('issuebutton');
const issuinginput = document.getElementById('issuinginput');
const issuingupload = document.getElementById('issuingupload');
const issuefromcam = document.getElementById('issuefromcam');

issuebutton.onclick = alertOnError(onIssueButton);
issuingupload.oninput = alertOnError(onImageUpload);
issuefromcam.onclick = alertOnError(onIssueFromCam);

async function onIssueButton() {
  const imageurl = issuinginput.value;
  const blob = await fetch(imageurl).then(r => r.blob());
  await issueForBlob(blob);
}

async function onIssueFromCam() {
  const blob = await getSnapshotFromWebcam();
  await issueForBlob(blob);
}

async function onImageUpload() {
  const blob = unwrapSingle(issuingupload.files);
  await issueForBlob(blob);
}

function initiateDownload(json) {
  var url = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json, null, 2));
  const a = document.createElement('a');
  a.setAttribute("href", url);
  a.setAttribute("download", "presentation.json");
  a.click();
}

async function issueForBlob(blob) {
  assertImage(blob);
  const dataurl = await blobToDataUrl(blob);
  let pres = await createAgePresentation(dataurl);
  initiateDownload(pres);
}

function assertImage(blob) {
  assert(blob.type.startsWith('image/'), `expected image, got type ${blob.type}`);
}

async function getSnapshotFromWebcam() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: {} });
  const track = stream.getVideoTracks()[0];
  const ic = new ImageCapture(track);
  return await ic.takePhoto();
}
