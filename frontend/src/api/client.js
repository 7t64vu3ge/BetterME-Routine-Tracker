import mockClient from './mockClient';

// Export the mock client to replace the axios instance
// This allows the app to run without a backend server, using AsyncStorage instead.
export default mockClient;
