import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { blobToDataUrl, unwrapSingle } from '../helpers/common';
import createAgePresentation from '../helpers/create-presentation';

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
  > video,
  > img {
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #848484;
  text-align: center;
  flex-direction: column;
`;

const WebcamButton = styled.a`
  margin: 10px auto 0 auto;
  background-color: #3898EC;
  color: #ffffff;
  text-align: center;
  padding: 8px 12px;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #338ad6;
  }
`;

export default function IssuePanel({ onClose, uploadedImage }) {
  const [statusText, setStatusText] = useState('Initializing...');
  const [credential, setCredential] = useState();
  const [imageData, setImageData] = useState();

  async function main() {
    if (!uploadedImage) {
      try {
        await linkWebcam();
        setStatusText('Take a picture');
      } catch (e) {
        setStatusText(e.toString());
      }
    } else {
      try {
        const blob = unwrapSingle([uploadedImage]);
        await issueForBlob(blob);
      } catch (e) {
        setStatusText(e.toString());
      }
    }
  }

  async function linkWebcam() {
    const video = document.getElementById('video');
    if (!video) {
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: {} });
    video.srcObject = stream;
  }

  async function issueForBlob(blob) {
    setStatusText('Generating...');
    const dataurl = await blobToDataUrl(blob);
    const pres = await createAgePresentation(dataurl);
    setCredential(pres);
    setStatusText('Credential Created');
  }

  async function handleTakePicture() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: {} });
    const track = stream.getVideoTracks()[0];
    const ic = new ImageCapture(track);
    const blob = await ic.takePhoto();
    await issueForBlob(blob);
  }

  async function loadFileToImage() {
    const blob = unwrapSingle([uploadedImage]);
    const dataurl = await blobToDataUrl(blob);
    setImageData(dataurl);
  }

  function handleDownloadCredential() {
    const url = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(credential, null, 2))}`;
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'presentation.json');
    a.click();
    onClose();
  }

  useEffect(() => {
    setTimeout(() => {
      main();
    }, 1000);

    if (uploadedImage) {
      loadFileToImage();
    }

    return () => {
      // TODO: dispose of video resources
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
          {uploadedImage ? (
            <img id="video" src={imageData} width="340px" height="151px" />
          ) : (
            <video id="video" autoPlay muted width="340px" height="151px"></video>
          )}
        </VideoWrapper>

        {credential ? (
          <Dropzone>
            Download your credential,<br />click buy and upload it!
            <WebcamButton onClick={handleDownloadCredential}>
              Download credential
            </WebcamButton>
          </Dropzone>
        ) : (
          <>
            {uploadedImage ? (
              <Dropzone>
                Generating credential...
              </Dropzone>
            ) : (
              <Dropzone>
                <WebcamButton onClick={handleTakePicture}>
                  Take Picture
                </WebcamButton>
              </Dropzone>
            )}
          </>
        )}

      </PanelWrapper>
    </PanelPopupWrapper>
  );
}
