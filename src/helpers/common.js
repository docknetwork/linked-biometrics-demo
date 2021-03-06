import {
  EcdsaSepc256k1Signature2019,
  Ed25519Signature2018,
  Sr25519Signature2020,
} from '@docknetwork/sdk/utils/vc/custom_crypto';
import vc from 'vc-js';
import axios from 'axios';
import assert from 'assert';
import { didcache } from './didcache';

const jsonldSignatures = require('jsonld-signatures');
const jsonld = require('jsonld');
const { Ed25519KeyPair } = require('crypto-ld');
const { v4: uuidv4 } = require('uuid');

export async function verifyPresentation(presentation) {
  const v = await vc.verify({
    presentation,
    suite: [
      new Ed25519Signature2018(),
      new EcdsaSepc256k1Signature2019(),
      new Sr25519Signature2020(),
    ],
    documentLoader,
    unsignedPresentation: true,
  });
  if (!v.verified) {
    throw v;
  }
}

export async function documentLoader(url) {
  let document;
  if (url.startsWith('did:demo:')) {
    document = demoDid(url);
  } else if (url.startsWith('did:')) {
    document = await resolveDid(url);
  } else {
    const resp = await axios.get(url);
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

export async function createCred(issuer, credentialSubject, ed25519privateKeyBase58, issuerPk58) {
  const credential = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    id: uuid(),
    type: ['VerifiableCredential'],
    issuer,
    credentialSubject,
    issuanceDate: new Date().toISOString(),
  };

  const suite = await ed25519suite54(issuer, ed25519privateKeyBase58, issuerPk58);
  return await vc.issue({ credential, suite });
}

async function ed25519suite54(did, privateKeyBase58, publicKeyBase58) {
  const verificationMethod = `${did}#keys-1`;
  return new jsonldSignatures.suites.Ed25519Signature2018({
    verificationMethod,
    key: new Ed25519KeyPair({ privateKeyBase58, publicKeyBase58 }),
  });
}

function uuid() {
  return `uuid:${uuidv4()}`;
}

export async function createPres(credentials) {
  return await vc.createPresentation({
    verifiableCredential: credentials,
    id: uuid(),
    holder: uuid(),
    documentLoader,
  });
}

export async function expand(ld) {
  return await jsonld.expand(ld, { documentLoader });
}

// example way to get a blob
// let blob = await fetch("https://example.com/image.png").then(r => r.blob());
export async function blobToDataUrl(blob) {
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export function unwrapSingle(array, otherwise = 'expected single element') {
  assert(
    array.length !== undefined,
    'tried to unwrap single element from an array, but the array was not an array',
  );
  if (array.length !== 1) throw new Error(otherwise);
  return array[0];
}
