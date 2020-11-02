const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');


// load environment variables

dotenv.config({ path: './config/config.env' });

const client = new MongoClient(process.env.MONGO_URI, {
  useUnifiedTopology: true
});

const connectDB = async () => {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */

  try {
      // Connect to the MongoDB cluster
      await client.connect();

  } catch (err) {
      console.error(err);
  } //finally {
  //    await client.close();
  //}
};

module.exports =  { 
  connectDB, 
  getClient: function() {
    return client;
  } };