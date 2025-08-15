const server = require('../server');

beforeAll(() => {
  // Server is already running from the import
});

afterAll((done) => {
  server.close(done);
});
