const isOnline = location.host === 'brando.delbertbeta.life';
const isLocal = location.host.includes('localhost');


const baseUrl = isLocal ?
  `http://localhost:9000/api/v1` :
  `https://brando${isOnline ? '' : '-staging'}.delbertbeta.life/release/api/v1`;

export const ApiUrl = {
  images: {
    authorize: baseUrl + '/images/authorize',
    root: baseUrl + '/images/',
  },
  albums: {
    root: baseUrl + '/albums/',
  }
};
