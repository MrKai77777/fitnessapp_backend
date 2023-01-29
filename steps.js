const fs = require('fs');
const { google } = require('googleapis');
const auth = require('google-auth-library');

// Set the time period for which you want to retrieve pedometer data (in milliseconds)
const startTime = new Date().getTime() - (7 * 24 * 60 * 60 * 1000); // 7 days ago
const endTime = new Date().getTime(); // now

// Set the necessary credentials for authenticating with the Google Fit API
const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const client = auth.createClient({
  credentials: credentials,
});

router.post('/steps',(res,req)=>{
  console.log('inside post');
// Authenticate with the Google Fit API
google.auth.getClient({
  auth: client,
}).then((authClient) => {
  // Initialize the total number of steps taken to 0
  let totalSteps = 0;

  // Retrieve the pedometer data for the given time period
  google.fitness.v1.users.dataSources.datasets.get({
    auth: authClient,
    userId: 'me',
    dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
    startTimeMillis: startTime,
    endTimeMillis: endTime,
  }, (error, data) => {
    if (error) {
      console.error(error);
    } else {
      // Process the pedometer data and calculate the total number of steps taken
      for (const dataset of data.dataSets) {
        for (const point of dataset.point) {
          for (const value of point.value) {
            totalSteps += value.intVal;
          }
        }
      }

      // Output the total number of steps taken
      console.log(`Total steps taken: ${totalSteps}`);
    }
  });
});
})
