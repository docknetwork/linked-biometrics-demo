// issue a credential as env['Delegator'] using DelegatorSk claiming that env['Delagate'] is
// authorized to claim "OldEnough"

async function main({ Delegator, DelegatorSk, Delagate }) {

}

main().catch(err => {
  console.error(err);
  process.exit(1);
}).then(() => {
  process.exit(0);
});
