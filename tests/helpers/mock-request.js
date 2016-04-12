import axios from 'axios';

axios.interceptors.request.use((config) => {
  config.url = 'http://localhost:0/' + config.url;
  return config;
});

axios.interceptors.response.use((response) => {
  // Shouldn't really be called, ever
  return response;
}, (error) => {
  /* Returning a resolved promise from error handler
     will make final promise resolve as though the request
     would have returned successfully */
  return Promise.resolve({
    data: {
        report: {
            min_temp: 10,
            min_temp_fahrenheit: 20,
            max_temp: 50,
            max_temp_fahrenheit: 60,
            atmo_opacity: 'Sunny',
            sunrise: Date.now(),
            sunset: Date.now()
        }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: error.config
  });
});
