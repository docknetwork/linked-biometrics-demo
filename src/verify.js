// return data uri in the presentation that is shown to be a picture an individual who is "Old Enough"
// It's possible for a presentation to imply multiple "Old Enough" certifications, but it makes the
// demo simpler if we just return the first one we can prove.
// throw an error if verification fails or if no data uris are "Old Enough"
export async function verifyAge(_presentation) {
  // This function is not yet implementeded because I have not yet managed to import the sdk.
  return 'https://miro.medium.com/max/1932/1*DW3-mBLhOOAFIFUVYUkgsQ.png'; // test value for now

  // Verify presentation.
  // Get list of claims from presentation.
  // for every data uri in the claims {
  //   Attempt to prove that the data uri is a picture of an "Old Enough" individual.
  //   If successful, return the data uri.
  // }
  // Throw error because none were found.
}
