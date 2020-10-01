
const ageroot = { Bound: { Iri: 'dock:did:ageroot' } };
const claims = { Bound: { Iri: 'https://www.dock.io/rdf2020#claimsV1' } };
// nd entity of type ageDeligate may issue age credentials
const ageDelegate = { Bound: { Iri: 'https://example.com/AgeDelegate' } };
// as with ageDelegate, oldEnough is also a type
const oldEnough = { Bound: { Iri: 'https://example.com/OfAge' } };

export default [
  // root authority may delegate the ability to issue age credentials
  {
    if_all: [
      [ageroot, claims, { Unbound: 'c0' }]
    ],
    then: [],
  },
  // a delegate may delegate the ability to issue age credentials
  {
    if_all: [],
    then: [],
  },
  // a delegate may claim age
  {
    if_all: [],
    then: [],
  },
  // a delegate may claim picture id
  {
    if_all: [],
    then: [],
  },
];
