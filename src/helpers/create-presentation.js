import { proveCompositeClaims } from '@docknetwork/sdk/utils/cd';
import { createCred, createPres, expand } from './common';
import { ageRoot, delegate1, delegate2 } from './didcache';
import rules from './rules';

export default async function createAgePresentation(imageUri) {
  const creds = await Promise.all([
    issueDelegation({
      issuer: ageRoot.did,
      delegate: delegate1.did,
      issuerSk: ageRoot.privateKeyBase58,
      issuerPk: ageRoot.publicKeyBase58,
    }),
    issueDelegation({
      issuer: delegate1.did,
      delegate: delegate2.did,
      issuerSk: delegate1.privateKeyBase58,
      issuerPk: delegate1.publicKeyBase58,
    }),
    issueAgeCred({
      issuer: delegate2.did,
      imageUri,
      issuerSk: delegate2.privateKeyBase58,
      issuerPk: delegate2.publicKeyBase58,
    }),
  ]);
  const pres = await createPres(creds);
  const expPres = await expand(pres);
  const toProve = [
    { Iri: imageUri },
    { Iri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' },
    { Iri: 'https://example.com/OfAge' },
  ];
  const proof = await proveCompositeClaims(expPres, [toProve], rules);
  pres['https://www.dock.io/rdf2020#logicV1'] = proof;
  return pres;
}

async function issueAgeCred({
  issuer, imageUri, issuerSk, issuerPk,
}) {
  [issuer, imageUri, issuerSk, issuerPk].forEach(unwrap);
  return await createCred(
    issuer,
    {
      '@id': imageUri,
      '@type': 'https://example.com/OfAge',
    },
    issuerSk,
    issuerPk,
  );
}

async function issueDelegation({
  issuer, delegate, issuerSk, issuerPk,
}) {
  [issuer, delegate, issuerSk, issuerPk].forEach(unwrap);
  return await createCred(
    issuer,
    {
      '@id': delegate,
      '@type': 'https://example.com/AgeDelegate',
    },
    issuerSk,
    issuerPk,
  );
}

/// panic if arg in undefined, otherwise return a
function unwrap(a) {
  if (a === undefined) {
    throw new Error('unwrapped an undefined value');
  }
  return a;
}
