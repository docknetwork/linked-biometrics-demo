
import {
  EcdsaSepc256k1Signature2019,
  Ed25519Signature2018,
  Sr25519Signature2020,
} from '@docknetwork/sdk/src/utils/vc/custom_crypto';
import vc from 'vc-js';
import axios from 'axios';
import { didcache } from './didcache';

export async function verifyPresentation(presentation) {
  let v = await vc.verify({
    presentation,
    suite: [new Ed25519Signature2018(), new EcdsaSepc256k1Signature2019(), new Sr25519Signature2020()],
    documentLoader,
    checkStatus,
  });
  if (!v.verified) {
    throw v.error;
  }
}

export async function verifyCredential(credential) {
  let v = await vc.verifyCredential({
    credential,
    suite: [new Ed25519Signature2018(), new EcdsaSepc256k1Signature2019(), new Sr25519Signature2020()],
    documentLoader,
    checkStatus,
  });
  if (!v.verified) {
    throw v.error;
  }
}

export async function documentLoader(url) {
  let document;
  if (url.startsWith('did:demo:')) {
    document = demoDid(url);
  } else if (url.startsWith('did:')) {
    document = await resolveDid(url);
  } else {
    let resp = await axios.get(url);
    document = resp.data;
  }
  return {
    documentUrl: url,
    document,
  };
}

async function resolveDid(did) {
  const encodedDid = encodeURIComponent(did);
  const resp = await axios.get(`https://resolver.identity.foundation/1.0/identifiers/${encodedDid}`);
  return resp.data.didDocument;
}

function demoDid(did) {
  if (didcache[did] === undefined) {
    throw new Error(`${did} does not exist`);
  }
  return didcache[did];
}

async function checkStatus() {
  return { verified: true };
}
