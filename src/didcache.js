// there are dids are actually live on-chain, but we'll just use these cached ones for now to
// simplify the demo
export const didsks = {
  "did:demo:0x1f4033a484a6eac0457d9544738a9c57f56f843078529980cc4c25405b35cecd": {
    privateKeyBase58: '4ieJCEfQKPoxxHaNr5L7EPf3D5nFAtEbWCx9zkQsP9Z3g4vGuqLhMdJbWFqk6eymdSW3CypEuywgFntr4t4kQZDz'
  },
  "did:demo:0x60ce8f457cc1a1bbc598bbf4a603caa5918f1b5e291d12a36e6445cea30d569b": {
    privateKeyBase58: 'yYu7E7vGZYjU7iLRAXtNWsdTXReYJgzTu3z5ZBRPatWBEuC3mymyGTG4eRPPLfePKG6EBg2NFk7NXacJPQYEhBn'
  },
  "did:demo:0x5a564349458cf635514330b540eb497273918cac6808ed713063aa2cfb726fcd": {
    privateKeyBase58: '2AKCZEhFap8Qu2JVrNnJmiuy3TKRJR6DQf2ReWdqgz5VEgTRujxgmt54i2JNdp4uC4ga4ti2JVGNNrXBknQ4VbEE'
  },
  "did:demo:0xc84bcce5cbdf1a3622096ceb2da582237c5db29662f241cab869874618a8b3c6": {
    privateKeyBase58: '3zdzzSggW5Bk8oumxjghG8k7WGsDet1jGs5jM6QND2CF3F65qMTzjZ2UQzDrZMvdiYbmaYhtvA5VZ7KerDCJMXhC'
  }
};

export const didcache = {
  "did:demo:0x1f4033a484a6eac0457d9544738a9c57f56f843078529980cc4c25405b35cecd": {
    "@context": "https://www.w3.org/ns/did/v1",
    "id": "did:demo:0x1f4033a484a6eac0457d9544738a9c57f56f843078529980cc4c25405b35cecd",
    "authentication": [
      "did:demo:0x1f4033a484a6eac0457d9544738a9c57f56f843078529980cc4c25405b35cecd#keys-1"
    ],
    "assertionMethod": [
      "did:demo:0x1f4033a484a6eac0457d9544738a9c57f56f843078529980cc4c25405b35cecd#keys-1"
    ],
    "publicKey": [
      {
        "id": "did:demo:0x1f4033a484a6eac0457d9544738a9c57f56f843078529980cc4c25405b35cecd#keys-1",
        "type": "Ed25519VerificationKey2018",
        "publicKeyBase58": "7jDALcss8gFJPhtTzVDJsjkayPcDLME2CKRWQGAtn65e",
        "controller": "did:demo:0x1f4033a484a6eac0457d9544738a9c57f56f843078529980cc4c25405b35cecd"
      }
    ]
  },
  "did:demo:0x1f4033a484a6eac0457d9544738a9c57f56f843078529980cc4c25405b35cecd#keys-1": {
    "@context": "https://www.w3.org/ns/did/v1",
    "id": "did:demo:0x1f4033a484a6eac0457d9544738a9c57f56f843078529980cc4c25405b35cecd#keys-1",
    "type": "Ed25519VerificationKey2018",
    "publicKeyBase58": "7jDALcss8gFJPhtTzVDJsjkayPcDLME2CKRWQGAtn65e",
    "controller": "did:demo:0x1f4033a484a6eac0457d9544738a9c57f56f843078529980cc4c25405b35cecd"
  },
  "did:demo:0x60ce8f457cc1a1bbc598bbf4a603caa5918f1b5e291d12a36e6445cea30d569b": {
    "@context": "https://www.w3.org/ns/did/v1",
    "id": "did:demo:0x60ce8f457cc1a1bbc598bbf4a603caa5918f1b5e291d12a36e6445cea30d569b",
    "authentication": [
      "did:demo:0x60ce8f457cc1a1bbc598bbf4a603caa5918f1b5e291d12a36e6445cea30d569b#keys-1"
    ],
    "assertionMethod": [
      "did:demo:0x60ce8f457cc1a1bbc598bbf4a603caa5918f1b5e291d12a36e6445cea30d569b#keys-1"
    ],
    "publicKey": [
      {
        "id": "did:demo:0x60ce8f457cc1a1bbc598bbf4a603caa5918f1b5e291d12a36e6445cea30d569b#keys-1",
        "type": "Ed25519VerificationKey2018",
        "publicKeyBase58": "D6GyQwe4e1BF4f1j95cdtMXXTPb4UFijF33LR2sadJye",
        "controller": "did:demo:0x60ce8f457cc1a1bbc598bbf4a603caa5918f1b5e291d12a36e6445cea30d569b"
      }
    ]
  },
  "did:demo:0x60ce8f457cc1a1bbc598bbf4a603caa5918f1b5e291d12a36e6445cea30d569b#keys-1": {
    "@context": "https://www.w3.org/ns/did/v1",
    "id": "did:demo:0x60ce8f457cc1a1bbc598bbf4a603caa5918f1b5e291d12a36e6445cea30d569b#keys-1",
    "type": "Ed25519VerificationKey2018",
    "publicKeyBase58": "D6GyQwe4e1BF4f1j95cdtMXXTPb4UFijF33LR2sadJye",
    "controller": "did:demo:0x60ce8f457cc1a1bbc598bbf4a603caa5918f1b5e291d12a36e6445cea30d569b"
  },
  "did:demo:0x5a564349458cf635514330b540eb497273918cac6808ed713063aa2cfb726fcd": {
    "@context": "https://www.w3.org/ns/did/v1",
    "id": "did:demo:0x5a564349458cf635514330b540eb497273918cac6808ed713063aa2cfb726fcd",
    "authentication": [
      "did:demo:0x5a564349458cf635514330b540eb497273918cac6808ed713063aa2cfb726fcd#keys-1"
    ],
    "assertionMethod": [
      "did:demo:0x5a564349458cf635514330b540eb497273918cac6808ed713063aa2cfb726fcd#keys-1"
    ],
    "publicKey": [
      {
        "id": "did:demo:0x5a564349458cf635514330b540eb497273918cac6808ed713063aa2cfb726fcd#keys-1",
        "type": "Ed25519VerificationKey2018",
        "publicKeyBase58": "E8nhvv4zm6KtAi9qFixL3s26iCkDHuE6QeDd28FG3KHG",
        "controller": "did:demo:0x5a564349458cf635514330b540eb497273918cac6808ed713063aa2cfb726fcd"
      }
    ]
  },
  "did:demo:0x5a564349458cf635514330b540eb497273918cac6808ed713063aa2cfb726fcd#keys-1": {
    "@context": "https://www.w3.org/ns/did/v1",
    "id": "did:demo:0x5a564349458cf635514330b540eb497273918cac6808ed713063aa2cfb726fcd#keys-1",
    "type": "Ed25519VerificationKey2018",
    "publicKeyBase58": "E8nhvv4zm6KtAi9qFixL3s26iCkDHuE6QeDd28FG3KHG",
    "controller": "did:demo:0x5a564349458cf635514330b540eb497273918cac6808ed713063aa2cfb726fcd"
  },
  "did:demo:0xc84bcce5cbdf1a3622096ceb2da582237c5db29662f241cab869874618a8b3c6": {
    "@context": "https://www.w3.org/ns/did/v1",
    "id": "did:demo:0xc84bcce5cbdf1a3622096ceb2da582237c5db29662f241cab869874618a8b3c6",
    "authentication": [
      "did:demo:0xc84bcce5cbdf1a3622096ceb2da582237c5db29662f241cab869874618a8b3c6#keys-1"
    ],
    "assertionMethod": [
      "did:demo:0xc84bcce5cbdf1a3622096ceb2da582237c5db29662f241cab869874618a8b3c6#keys-1"
    ],
    "publicKey": [
      {
        "id": "did:demo:0xc84bcce5cbdf1a3622096ceb2da582237c5db29662f241cab869874618a8b3c6#keys-1",
        "type": "Ed25519VerificationKey2018",
        "publicKeyBase58": "HR9ZPeygW3yp1bcrGNi4fCFesGrNKRrHtBJn4MNMBKbx",
        "controller": "did:demo:0xc84bcce5cbdf1a3622096ceb2da582237c5db29662f241cab869874618a8b3c6"
      }
    ]
  },
  "did:demo:0xc84bcce5cbdf1a3622096ceb2da582237c5db29662f241cab869874618a8b3c6#keys-1": {
    "@context": "https://www.w3.org/ns/did/v1",
    "id": "did:demo:0xc84bcce5cbdf1a3622096ceb2da582237c5db29662f241cab869874618a8b3c6#keys-1",
    "type": "Ed25519VerificationKey2018",
    "publicKeyBase58": "HR9ZPeygW3yp1bcrGNi4fCFesGrNKRrHtBJn4MNMBKbx",
    "controller": "did:demo:0xc84bcce5cbdf1a3622096ceb2da582237c5db29662f241cab869874618a8b3c6"
  }
};
