const supertest = require('supertest');

module.exports = (appOrUrl) => {
  const req = supertest(appOrUrl);

  return {
    get: (url, callback) => req.get(url, callback),

    post: (url, callback) => req.post(url, callback),

    put: (url, callback) => req.put(url, callback),

    patch: (url, callback) => req.patch(url, callback),

    delete: (url, callback) => req.delete(url, callback),
  };
};
