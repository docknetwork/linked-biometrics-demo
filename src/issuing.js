import { createAgePresentation } from './scripts/create_presentation';
import { blobToDataUrl, unwrapSingle } from './common';
import assert from 'assert';

const issuebutton = document.getElementById('issuebutton');
const issuinginput = document.getElementById('issuinginput');
const issuingupload = document.getElementById('issuingupload');

issuebutton.onclick = onIssueButton;
issuingupload.oninput = onImageUpload;

async function onIssueButton() {
  const imageurl = issuinginput.value;
  const blob = await fetch(imageurl).then(r => r.blob());
  assertImage(blob);
  const dataurl = await blobToDataUrl(blob);
  let pres = await createAgePresentation(dataurl);
  initiateDownload(pres);
}

function initiateDownload(json) {
  var url = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json, null, 2));
  const a = document.createElement('a');
  a.setAttribute("href", url);
  a.setAttribute("download", "presentation.json");
  a.click();
}

async function onImageUpload() {
  const blob = unwrapSingle(issuingupload.files);
  assertImage(blob);
  const dataurl = await blobToDataUrl(blob);
  let pres = await createAgePresentation(dataurl);
  initiateDownload(pres);
}

function assertImage(blob) {
  assert(blob.type.startsWith('image/'), `expected image, got type ${blob.type}`);
}
