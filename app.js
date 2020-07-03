const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')

const app = express();
const port = 3000;

mongoose.connect(
	'mongodb://localhost:27017/test', { 
		useNewUrlParser: true, 
		useUnifiedTopology: true 
	}
	)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

const RiskModel = mongoose.model('risks', { 
	imageName: String,
	repoName: String,
	namespace: String,
	clusterId: String,
	critVulns: Number,
	highVulns: Number,
	medVulns: Number,
	lowVulns: Number,
	totalVulns: Number,
	ackVulns: Number,
	// timestamp is only added for demo
	// in production use _id(for image) 
	// or snapstamp(for repos) to derive timestamp
	timestamp: Date,
	snapstamp: Date
})
// Allow CORS
app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// This function returns an ObjectId embedded with a given datetime
// Accepts both Date object and string input

function objectIdWithTimestamp(timestamp) {
    // Convert string date to Date object (otherwise assume timestamp is a date)
    if (typeof(timestamp) == 'string') {
    	timestamp = new Date(timestamp);
    }
    // Convert date object to hex seconds since Unix epoch
    const hexSeconds = Math.floor(timestamp/1000).toString(16);
    // Create an ObjectId with that hex timestamp
    const constructedObjectId = mongoose.Types.ObjectId(hexSeconds + "0000000000000000");
    return constructedObjectId
  }

  app.get('/risks', (req, res) => {
  	console.log('GET ' + req.originalUrl)
  	if (!req.query.from 
  		|| !req.query.to 
  		) {
  		return res.status(400).send({
  			message: 'from,to,imageName and repoNsame required in query str'
  		}) 
  }
  RiskModel.find({
  	_id:{
  		$lte: objectIdWithTimestamp(req.query.to),
  		$gte: objectIdWithTimestamp(req.query.from)
  	},
  	imageName: req.query.imageName
  }, function (err, risks) {
  	if (err) return console.error(err)
  //run this within a loop to send timestamps explicitly
  //risks[i].timestamp = risk[i]._id.getTimestamp()
  //Timestamps can be easily extracted from objectId on the client side:
  //objectId='5efba3f6508ccd2568e8f0e8'
  //time=new Date(parseInt(objectId.substring(0, 8), 16) * 1000)
  res.send(risks)
})
})

  app.post('/risks', (req, res) => {
  	console.log('inside POST /risks')
  	let timestamp = new Date
  	let snapstamp = objectIdWithTimestamp(timestamp)
  	let riskItem = null
  	for (let i=0;i<req.body.length; i++) {
  		riskItem = new RiskModel({
  			imageName: req.body[i].name,
  			repoName: req.body[i].registry,
  			namespace: "_blank",
  			clusterId: "no-cluster-id",
  			critVulns: req.body[i].crit_vulns,
  			highVulns: req.body[i].high_vulns,
  			medVulns: req.body[i].med_vulns,
  			lowVulns: req.body[i].low_vulns,
  			totalVulns: req.body[i].vulns_found,
  			ackVulns: 0,
  			timestamp: timestamp,
				snapstamp: snapstamp
  		})
  		riskItem.save().then(() => console.log(riskItem))
  	}
  	res.send(req.body.length + ' images saved')
  })

  app.listen(port, () => console.log(`Risk timeseries API server listening on port ${port}`));

