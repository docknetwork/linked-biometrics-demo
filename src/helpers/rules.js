import { ageRoot as AR } from './didcache';

const ageroot = { Bound: { Iri: AR.did } };
const claims = { Bound: { Iri: 'https://www.dock.io/rdf2020#claimsV1' } };
// nd entity of type ageDeligate may issue age credentials
const ageDelegate = { Bound: { Iri: 'https://example.com/AgeDelegate' } };
// as with ageDelegate, oldEnough is also a type
const oldEnough = { Bound: { Iri: 'https://example.com/OfAge' } };

const type = { Bound: { Iri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' } };
const subject = { Bound: { Iri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#subject' } };
const predicate = { Bound: { Iri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate' } };
const object = { Bound: { Iri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#object' } };

export default [
  // root authority has permission to delegate
  {
    if_all: [],
    then: [
      [ageroot, type, ageDelegate],
    ],
  },
  // a delegate may delegate the ability to issue age credentials
  {
    if_all: [
      [ub('issuer'), type, ageDelegate],
      [ub('issuer'), claims, ub('c')],
      [ub('c'), subject, ub('subdelegate')],
      [ub('c'), predicate, type],
      [ub('c'), object, ageDelegate],
    ],
    then: [
      [ub('subdelegate'), type, ageDelegate],
    ],
  },
  // a delegate may claim age
  {
    if_all: [
      [ub('issuer'), type, ageDelegate],
      [ub('issuer'), claims, ub('c')],
      [ub('c'), subject, ub('image')],
      [ub('c'), predicate, type],
      [ub('c'), object, oldEnough],
    ],
    then: [
      [ub('image'), type, oldEnough],
    ],
  },
];

function ub(name) {
  return { Unbound: name };
}
