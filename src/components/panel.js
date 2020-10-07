import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import * as fa from 'face-api.js';

import verifyAge from '../helpers/verify';
import { unwrapSingle } from '../helpers/common';

import Panel from '../../public/images/panel.svg';

const PanelPopupWrapper = styled.div`
  background: rgba(0,0,0,0.5);
  position: fixed;
  left: -50vw;
  top: -50vh;
  width: 200vw;
  height: 200vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const PanelBGClose = styled.div`
  background: rgba(0,0,0,0);
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  cursor: pointer;
`;

const PanelWrapper = styled.div`
  width: 420px;
  height: 500px;
  position: relative;
`;

const VideoWrapper = styled.div`
  position: absolute;
  left: 43px;
  top: 69px;
  border-radius: 12px;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;

  &,
  > canvas,
  > video {
    width: 340px!important;
    height: 151px!important;
    object-fit: cover;
  }

  > canvas,
  > video {
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const StatusText = styled.h2`
  position: absolute;
  left: 50%;
  top: 15px;
  font-size: 22px;
  transform: translate(-50%, 0);
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  padding: 0 20px;
`;

const Dropzone = styled.div`
  position: absolute;
  left: 26px;
  bottom: 28px;
  width: 270px;
  height: 90px;
  border-radius: 12px;
  border: 1px dashed #cccccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: #848484;
  text-align: center;
`;

let targetFace = null; // this will hold the face descriptor the user needs to match

const maxMatchDistance = 0.5;
// return the euclian distance between two arrays
function distance(as, bs) {
  // assert(as.length !== undefined, '"distance" recieved a non-array input');
  // assert(as.length === bs.length, 'cant calculate distance beween vectors of different lengths');
  const sum = as.map((_, i) => Math.pow(as[i] - bs[i], 2)).reduce((a, b) => a + b, 0);
  return Math.sqrt(sum);
}

function vsize(video) {
  return { width: video.videoWidth, height: video.videoHeight };
  // return { width: 340, height: 151 };
}
function humanReadableComparison(detections, targetFace) {
  if (targetFace === null) return 'Awaiting credential';
  if (detections.length === 0) return 'No face found';
  if (detections.length > 1) return 'One person at a time please';
  const dist = distance(detections[0].descriptor, targetFace);
  if (dist < maxMatchDistance) return `Match! Difference: ${Math.floor(dist * 1000) / 1000}`;
  return `No match. Difference: ${dist}`;
}

function isMatch(detections, targetFace) {
  // this logic is a repeat of that in humanReadableComparison
  if (targetFace === null) return false;
  if (detections.length === 0) return false;
  if (detections.length > 1) return false;
  const dist = distance(detections[0].descriptor, targetFace);
  return dist < maxMatchDistance;
}

async function fetchImage(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `failed to fetch: (${res.status}) ${res.statusText}, from url: ${url}`,
    );
  }
  const blob = await res.blob();
  if (!blob.type.startsWith('image/')) {
    throw new Error(`fetchImage - expected blob type to be of type image/*, instead have: ${blob.type}, for url: ${res.url}`);
  }
  return fa.bufferToImage(blob);
}

export default function MuhPanel({ onClose, onMatch }) {
  const [statusText, setStatusText] = useState('Initializing...');

  async function firstEvent(eventTarget, event) {
    return await new Promise((resolve) => {
      eventTarget.addEventListener(event, resolve, { once: true });
    });
  }

  function everyFrame(acb) {
    acb().then(() => requestAnimationFrame(() => everyFrame(acb)));
  }

  async function detectFaces(image) {
    return await fa.detectAllFaces(image, new fa.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();
  }

  async function onFrame() {
    const canvas = document.getElementById('canvas');
    const video = document.getElementById('video');
    if (canvas && video) {
      const detections = await detectFaces('video');
      // console.log('detections', detections)
      fa.matchDimensions(canvas, vsize(video));
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      const rd = fa.resizeResults(detections, vsize(video));
      fa.draw.drawFaceLandmarks(canvas, rd);
      console.log('ismatch', isMatch(detections, targetFace));

      const comparison = humanReadableComparison(detections, targetFace);
      if (comparison !== statusText) {
        setStatusText(comparison);
      }

      if (isMatch(detections, targetFace)) {
        setTimeout(() => {
          onClose();
          onMatch();
        }, 1000);
      }
    }
  }

  async function main() {
    await Promise.all([
      linkWebcam(),
      fa.nets.tinyFaceDetector.loadFromUri('/models'),
      fa.nets.faceLandmark68Net.loadFromUri('/models'),
      fa.nets.faceRecognitionNet.loadFromUri('/models'),
    ]);
    everyFrame(onFrame);
  }

  async function linkWebcam() {
    const video = document.getElementById('video');
    if (!video) {
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: {} });
    video.srcObject = stream;
    await firstEvent(video, 'play');
  }

  async function onVpUpload(files) {
    const blob = unwrapSingle(files);
    const presentaion = JSON.parse(await blob.text());
    const imageuri = await verifyAge(presentaion);
    const image = await fetchImage(imageuri);
    targetFace = unwrapSingle(
      await detectFaces(image),
      'the number of faces in the image provided was not 1',
    ).descriptor;
  }

  const onDrop = useCallback((acceptedFiles) => {
    try {
      onVpUpload(acceptedFiles);
    } catch (e) {
      setStatusText(e.toString());
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'application/json',
    onDrop,
  });

  useEffect(() => {
    setTimeout(async () => {
      try {
        await main();
      } catch (e) {
        setStatusText(e.toString());
      }
    }, 1000);

    return () => {
      // TODO: dispose of video resources
      console.log('panel unmount');
    };
  }, []);

  return (
    <PanelPopupWrapper>
      <PanelBGClose onClick={onClose} />
      <PanelWrapper>
        <Panel />
        <StatusText>
          {statusText}
        </StatusText>
        <VideoWrapper id="videop">
          <video id="video" autoPlay muted width="340px" height="151px"></video>
          <canvas id="canvas"></canvas>
        </VideoWrapper>

        <Dropzone {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive
              ? <p>Drop the file here...</p>
              : <p>Drop your VP here<br />or click to upload</p>
          }
        </Dropzone>
      </PanelWrapper>
    </PanelPopupWrapper>
  );
}
