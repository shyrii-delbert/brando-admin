const isOnline = location.host === 'brando.delbertbeta.life';

const baseUrl = `https://brando${isOnline ? '' : '-staging'}.delbertbeta.life/release/api/v1`;

export const ApiUrl = {
  images: {
    authorize: baseUrl + '/images/authorize',
    root: baseUrl + 'images/',
  },
};
