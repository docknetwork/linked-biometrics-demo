
import { verifyPresentation } from './common';
import rules from './rules';
import deepEq from 'deep-equal';

// clde is a promise to the claim deduction module
const clde = import('@docknetwork/sdk/src/utils/cd');

const type = { Iri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' };
const ofAge = { Iri: 'https://example.com/OfAge' };

// return a uri in the presentation that is shown to be a picture an individual who is "Old Enough"
// It's possible for a presentation to imply multiple "Old Enough" certifications but it the
// demo is simpler if we just return the first one we see.
// throw an error if verification fails or if no data uris are "Old Enough"
export async function verifyAge(presentation) {
  const cd = await clde;

  // Verify presentation.
  await verifyPresentation(presentation);

  // Get list of claims from presentation.
  let ep = await jsonld.expand(presentation);
  let trueClaims = await cd.acceptCompositeClaims(ep, rules);

  for (const [s, p, o] of trueClaims) {
    if (s.Iri !== undefined && deepEq(p, type) && deepEq(o, ofAge)) {
      return s.Iri;
    }
  }
  throw new Error("age not proven");
}
