export const generateMapboxStaticImage = (
  lostLat: number,
  lostLon: number,
  foundLat: number,
  foundLon: number,
): string => {
  const accessToken = process.env.MAPBOX_TOKEN;
  const width = 800;
  const height = 400;

  // Red pin for where lost, blue pin for where found
  const lostPin = `pin-s-l+f00(${lostLon},${lostLat})`;
  const foundPin = `pin-s-l+00f(${foundLon},${foundLat})`;

  return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${lostPin},${foundPin}/auto/${width}x${height}?padding=60&access_token=${accessToken}`;
};
