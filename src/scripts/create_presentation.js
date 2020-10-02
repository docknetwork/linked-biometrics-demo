// Assemble a presentation out of credentials env['Issuer'] using env['IssuerSk'] proving that
// env['ImageUri'] is a picture of someone who is "OldEnough"

async function main({ ImageUri, Credentials }) {

}

main().catch(err => {
  console.error(err);
  process.exit(1);
}).then(() => {
  process.exit(0);
});
