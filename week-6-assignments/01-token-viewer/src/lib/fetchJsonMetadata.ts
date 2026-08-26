export async function fetchJsonMetadata(uri: string) {
  try {
    const response = await fetch(uri);

    return await response.json();
  } catch (err) {
    console.log(err);

    return null;
  }
}
