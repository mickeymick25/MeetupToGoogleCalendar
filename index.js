require('dotenv').load();
const Meetup = require('./meetup');
const Google = require('./google');
const isProd = false;

// function setupHttp(){
//     // Load HTTP module
//     let http = require("http");
//
//     // Create HTTP server and listen on port 8000 for requests
//     http.createServer(function(request, response) {
//
//        // Set the response HTTP header with HTTP status and Content type
//        response.writeHead(200, {'Content-Type': 'text/plain'});
//
//        // Send the response body "Hello World"
//        response.end('Hello World\n');
//     }).listen(8000);
//
//     // Print URL for accessing server
//     console.log('Server running at http://127.0.0.1:8000/');
// }

/**
 * Init the application by creating an http server, calling the meetup API,
 * retrive last upcoming event regarding topics stored into .env file
 *
 */
async function init(req, res){
  try {
    if (process.env.NODE_ENV !== 'production') {
      this.isProd = false;
      // const _serverhttp = await setupHttp();
      // console.log("_serverhttp  :: "+ _serverhttp);

      console.log('\n *** Start fetching upcoming Meetup...');
      const _myMeetup =  new Meetup(process.env.MEETUP_TOPICS);
      let _meetupUxList =  await _myMeetup.upcomingEvents;
      // console.log("**_meetupUxList :: "+_meetupUxList);
      for (let i in _meetupUxList) {
          console.log("meetup"+i+":: "+ JSON.stringify(_meetupUxList[i].name) );
      }

      console.log('\n *** Start Connecting to Google...');

      // const _myGoogle =  new Google(_meetupUxList);
      new Google(_meetupUxList);
    }
  }catch (err) {
    //logger.error('Http error', err)
    //return res.status(500).send();
    return 'Error into the catch block:'+err;
  }
}

init();
