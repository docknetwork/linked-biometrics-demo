import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import dynamic from 'next/dynamic';
import {useDropzone} from 'react-dropzone';

import Hand from '../../public/images/hand.svg';
import Logo from '../../public/images/dock-logo-white.svg';

const Panel = dynamic(() => import('../components/panel'));
const IssuePanel = dynamic(() => import('../components/issue'));

const Header = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const StyledLogo = styled(Logo)`
  position: fixed;
  left: 25px;
  top: 15px;
`;

const VendingMachineWrapper = styled.div`
  margin-left: 60px;
  height: 100%;
  position: relative;
`;

const VendingMachineStyled = styled.img`
  height: 100%;
  position: fixed;
  left: 40px;
  top: 0;
`;

const VendingMachineCan = styled.img`
  height: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
  animation: canReveal 1s;
  animation-iteration-count: 1;

  @keyframes canReveal {
    0% { transform: translate(0, -8px) rotate(0deg); opacity: 0; }
    10% { transform: translate(0, -8px) rotate(-1deg); }
    20% { transform: translate(0, -8px) rotate(1deg); }
    30% { transform: translate(0, -7px) rotate(0deg); }
    40% { transform: translate(0, -6px) rotate(1deg); opacity: 1.0; }
    50% { transform: translate(0, -5px) rotate(-1deg); }
    60% { transform: translate(0, -4px) rotate(0deg); }
    70% { transform: translate(0, -3px) rotate(-1deg); }
    80% { transform: translate(0, -2px) rotate(1deg); }
    90% { transform: translate(0, -1px) rotate(0deg); }
    100% { transform: translate(0, 0px) rotate(0deg); }
  }
`;

const HandWrapper = styled(Hand)`
  position: fixed;
  left: 40px;
  bottom: 0;
  cursor: pointer;
  transform: translate(0, 20px);
  transition: all 0.2s ease-in-out;
  filter: drop-shadow(6px 8px 8px rgba(0,0,0,0.25));
  z-index: 2;

  &:hover {
    transform: translate(0, 0);
  }
`;

const RightContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: 40px;
  width: 100%;
  max-width: 40%;
  position: relative;
  z-index: 10;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-sizing: border-box;
  box-shadow: 14px 14px 60px -20px rgba(0, 0, 0, 0.25);

  &:last-child {
    margin-bottom: 0;
  }

  h1 {
    font-family: Montserrat, sans-serif;
    padding-bottom: 0px;
    font-size: 32px;
    line-height: 36px;
    font-weight: 700;
    text-align: center;
    margin: 0 0 10px 0;
  }

  p {
    font-size: 18px;
    line-height: 24px;
    font-weight: 400;
    margin: 0;
  }
`;

const Dropzone = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 80px;
  border-radius: 6px;
  border: 1px dashed #cccccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: #848484;
  text-align: center;
`;

const WebcamButton = styled.a`
  margin: 20px auto 0 auto;
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

export default () => {
  const [showMessage, setShowMessage] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [showCan, setShowCan] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(false);
  const [showIssue, setShowIssue] = useState(false);

  function handleOpenPanel() {
    setShowMessage(true);
    setShowCan(false);
    setIsMatch(false);
  }

  function handleClosePanel() {
    setShowMessage(false);
  }

  function handleShowIssue() {
    setShowIssue(true);
  }

  function handleCloseIssue() {
    setShowIssue(false);
    setUploadedImage(null);
  }

  function handleMatch() {
    setIsMatch(true);
    setTimeout(() => {
      setShowCan(true);
    }, 1000);
  }

  const onDrop = useCallback(acceptedFiles => {
    setUploadedImage(acceptedFiles[0]);
    setShowIssue(true);
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: 'image/*',
    onDrop
  });

  return (
    <>
      <Header>
        <StyledLogo />
        <VendingMachineWrapper className={isMatch && `anim-shake`}>
          <VendingMachineStyled src={`/images/vending-machine.svg`} />
          {showCan && (
            <VendingMachineCan src={`/images/can.svg`} />
          )}
        </VendingMachineWrapper>

        <HandWrapper onClick={handleOpenPanel} />

        <RightContentWrapper>
          <RightContent>
            <h1>What is this demo?</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porttitor nunc sit amet lacus bibendum hendrerit.
              In porta tempor semper. Nunc ac mauris consectetur, lacinia est semper, mollis tellus.
              Ut ultricies lacus ut fringilla rhoncus. Nulla consequat sapien purus, sit amet tincidunt urna condimentum porta.
              Aenean elementum, dolor et consectetur posuere, orci lectus fermentum urna, vel pulvinar mi mi accumsan justo.
            </p>
          </RightContent>

          <RightContent>
            <h1>Issue your own credential</h1>
            <p>
              This demo will accept credentials issued by you as the private key is stored on this page.
              Upload or take a clear picture of yourself to download your own credential for verification.
            </p>
            <Dropzone {...getRootProps()}>
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <>Drop the file here...</> :
                  <>Drop your picture here<br />or click to upload</>
              }
            </Dropzone>
            <WebcamButton onClick={handleShowIssue}>
              Issue using webcam
            </WebcamButton>
          </RightContent>
        </RightContentWrapper>
      </Header>

      <CSSTransition
        in={showMessage}
        timeout={300}
        classNames="fancy-transition"
        unmountOnExit
      >
        <Panel onClose={handleClosePanel} onMatch={handleMatch} />
      </CSSTransition>

      <CSSTransition
        in={showIssue}
        timeout={300}
        classNames="fancy-transition"
        unmountOnExit
      >
        <IssuePanel onClose={handleCloseIssue} uploadedImage={uploadedImage} />
      </CSSTransition>
    </>
  )
}
