// Issue a credential from env['Issuer'] using env['IssuerSk'] claiming that
// env['ImageUri'] is a picture of someone who is "OldEnough"

const vc = require('vc-js');
const { v4: uuidv4 } = require('uuid');
import { verifyCredential } from '../common';
const { Ed25519Signature2018 } = require('jsonld-signatures');
const { Ed25519KeyPair } = require('crypto-ld');

async function createCred(issuer, credentialSubject, ed25519privateKeyBase58, issuerPk) {
  let credential = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "id": uuid(),
    "type": ["VerifiableCredential"],
    "issuer": issuer,
    "credentialSubject": credentialSubject,
    "issuanceDate": new Date().toISOString()
  };

  const suite = await ed25519suite54(issuer, ed25519privateKeyBase58, issuerPk);
  return await vc.issue({ credential, suite });
}

function uuid() {
  return `uuid:${uuidv4()}`;
}

export async function issueAgeCred({
  issuer = "did:demo:0x1f4033a484a6eac0457d9544738a9c57f56f843078529980cc4c25405b35cecd",
  imageUri = 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
  issuerSk = '4ieJCEfQKPoxxHaNr5L7EPf3D5nFAtEbWCx9zkQsP9Z3g4vGuqLhMdJbWFqk6eymdSW3CypEuywgFntr4t4kQZDz',
  issuerPk = '7jDALcss8gFJPhtTzVDJsjkayPcDLME2CKRWQGAtn65e',
} = {}) {
  let credential = await createCred(
    issuer,
    {
      "@id": imageUri,
      "@type": "https://example.com/OfAge"
    },
    issuerSk,
    issuerPk,
  );
  try {
    await verifyCredential(credential);
  } catch (e) {
    console.log(JSON.stringify(e, null, 2))
  }
}

async function ed25519suite54(did, privateKeyBase58, publicKeyBase58) {
  const verificationMethod = `${did}#keys-1`;
  return new Ed25519Signature2018({
    verificationMethod,
    key: new Ed25519KeyPair({ privateKeyBase58, publicKeyBase58 })
  });
}

// async function ed25519suite(did, seed) {
//   const kd = await keydoc(did, seed);
//   return new Ed25519Signature2018({ ...kd, verificationMethod: kd.id });
// }

// async function keydoc(did, seed) {
//   return await getKeyDoc(
//     did,
//     await keypair(seed),
//     'Ed25519VerificationKey2018'
//   );
// }

// // Load an ed25519 keypair from secret, secret may be "0x" prefixed hex seed
// // or seed phrase or "//DevKey/Derivation/Path".
// async function keypair(seed) {
//   await cryptoWaitReady();
//   const keyring = new Keyring({ type: 'ed25519' });
//   return keyring.addFromUri(seed, null, 'ed25519');
// }
