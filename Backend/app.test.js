const request = require('supertest');
const app = require('./server');

// Test case to verify successful user registration
test('POST /api/signup should successfully register a new user', async () => {
  const userDetails = {
    first_name: 'sushmitha',
    last_name: 'avula',
    password: 'sushmithaavula',
    email: 'sushmithaavula' + Math.floor(Math.random() * 90000) + 10000 + '@example.com',
    phone_number: '9128192312'
  };

  // Make a POST request to the '/api/signup' endpoint with the user data
  const response = await request(app)
    .post('/api/signup')
    .send(userDetails)
    .expect(200); // Expect a successful response (200 OK)

  // Verify that the response contains the correct data
  expect(response.body).toEqual({
    status: 200,
    success: true,
    response: expect.any(Object) // You can define the expected response structure here
  });
});

// Test case to simulate a failed user registration
test('POST /api/signup should handle failed registration attempt', async () => {
  const invalidUserDetails = {
    // Missing required fields or invalid data to simulate a failed registration
  };

  // Make a POST request to the '/api/signup' endpoint with invalid user data
  const response = await request(app)
    .post('/api/signup')
    .send(invalidUserDetails)
    .expect(500); // Expect a 500 Internal Server Error (or customize based on error handling)

  // Verify that the response contains the appropriate error message
  expect(response.body).toEqual({
    success: false,
    error: expect.any(String) // You can define the structure of the error message here
  });
});
