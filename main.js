const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://iliana:<moje>@chatappcluster-sbbmt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");

  client.close();
});
