const baseUrl = API_END_POINT + '/api/v1';

export const ApiUrl = {
  images: {
    authorize: baseUrl + '/images/authorize',
    root: baseUrl + '/images/',
  },
  user: {
    root: baseUrl + '/user',
  },
  albums: {
    root: baseUrl + '/albums/',
  },
};
