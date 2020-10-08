export const ageRoot = {
  did: 'did:demo:age_root',
  privateKeyBase58: '4ieJCEfQKPoxxHaNr5L7EPf3D5nFAtEbWCx9zkQsP9Z3g4vGuqLhMdJbWFqk6eymdSW3CypEuywgFntr4t4kQZDz',
  publicKeyBase58: '7jDALcss8gFJPhtTzVDJsjkayPcDLME2CKRWQGAtn65e',
};
export const delegate1 = {
  did: 'did:demo:delegate1',
  privateKeyBase58: 'yYu7E7vGZYjU7iLRAXtNWsdTXReYJgzTu3z5ZBRPatWBEuC3mymyGTG4eRPPLfePKG6EBg2NFk7NXacJPQYEhBn',
  publicKeyBase58: 'D6GyQwe4e1BF4f1j95cdtMXXTPb4UFijF33LR2sadJye',
};
export const delegate2 = {
  did: 'did:demo:delegate2',
  privateKeyBase58: '2AKCZEhFap8Qu2JVrNnJmiuy3TKRJR6DQf2ReWdqgz5VEgTRujxgmt54i2JNdp4uC4ga4ti2JVGNNrXBknQ4VbEE',
  publicKeyBase58: 'E8nhvv4zm6KtAi9qFixL3s26iCkDHuE6QeDd28FG3KHG',
};
export const delegate3 = {
  did: 'did:demo:delegate3',
  privateKeyBase58: '3zdzzSggW5Bk8oumxjghG8k7WGsDet1jGs5jM6QND2CF3F65qMTzjZ2UQzDrZMvdiYbmaYhtvA5VZ7KerDCJMXhC',
  publicKeyBase58: 'HR9ZPeygW3yp1bcrGNi4fCFesGrNKRrHtBJn4MNMBKbx',
};

// There are dids are actually live on-chain, but we'll just use these cached ones for now to
// simplify the demo.
//
// All these private keys are public so people are free to experiment with creating their own
// delegation chains.

export const didcache = {
  'did:demo:age_root': {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: 'did:demo:age_root',
    authentication: [
      'did:demo:age_root#keys-1',
    ],
    assertionMethod: [
      'did:demo:age_root#keys-1',
    ],
    publicKey: [
      {
        id: 'did:demo:age_root#keys-1',
        type: 'Ed25519VerificationKey2018',
        publicKeyBase58: '7jDALcss8gFJPhtTzVDJsjkayPcDLME2CKRWQGAtn65e',
        controller: 'did:demo:age_root',
      },
    ],
  },
  'did:demo:age_root#keys-1': {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: 'did:demo:age_root#keys-1',
    type: 'Ed25519VerificationKey2018',
    publicKeyBase58: '7jDALcss8gFJPhtTzVDJsjkayPcDLME2CKRWQGAtn65e',
    controller: 'did:demo:age_root',
  },
  'did:demo:delegate1': {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: 'did:demo:delegate1',
    authentication: [
      'did:demo:delegate1#keys-1',
    ],
    assertionMethod: [
      'did:demo:delegate1#keys-1',
    ],
    publicKey: [
      {
        id: 'did:demo:delegate1#keys-1',
        type: 'Ed25519VerificationKey2018',
        publicKeyBase58: 'D6GyQwe4e1BF4f1j95cdtMXXTPb4UFijF33LR2sadJye',
        controller: 'did:demo:delegate1',
      },
    ],
  },
  'did:demo:delegate1#keys-1': {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: 'did:demo:delegate1#keys-1',
    type: 'Ed25519VerificationKey2018',
    publicKeyBase58: 'D6GyQwe4e1BF4f1j95cdtMXXTPb4UFijF33LR2sadJye',
    controller: 'did:demo:delegate1',
  },
  'did:demo:delegate2': {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: 'did:demo:delegate2',
    authentication: [
      'did:demo:delegate2#keys-1',
    ],
    assertionMethod: [
      'did:demo:delegate2#keys-1',
    ],
    publicKey: [
      {
        id: 'did:demo:delegate2#keys-1',
        type: 'Ed25519VerificationKey2018',
        publicKeyBase58: 'E8nhvv4zm6KtAi9qFixL3s26iCkDHuE6QeDd28FG3KHG',
        controller: 'did:demo:delegate2',
      },
    ],
  },
  'did:demo:delegate2#keys-1': {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: 'did:demo:delegate2#keys-1',
    type: 'Ed25519VerificationKey2018',
    publicKeyBase58: 'E8nhvv4zm6KtAi9qFixL3s26iCkDHuE6QeDd28FG3KHG',
    controller: 'did:demo:delegate2',
  },
  'did:demo:delegate3': {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: 'did:demo:delegate3',
    authentication: [
      'did:demo:delegate3#keys-1',
    ],
    assertionMethod: [
      'did:demo:delegate3#keys-1',
    ],
    publicKey: [
      {
        id: 'did:demo:delegate3#keys-1',
        type: 'Ed25519VerificationKey2018',
        publicKeyBase58: 'HR9ZPeygW3yp1bcrGNi4fCFesGrNKRrHtBJn4MNMBKbx',
        controller: 'did:demo:delegate3',
      },
    ],
  },
  'did:demo:delegate3#keys-1': {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: 'did:demo:delegate3#keys-1',
    type: 'Ed25519VerificationKey2018',
    publicKeyBase58: 'HR9ZPeygW3yp1bcrGNi4fCFesGrNKRrHtBJn4MNMBKbx',
    controller: 'did:demo:delegate3',
  },
};
