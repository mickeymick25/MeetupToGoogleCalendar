const _meetup = require('meetup-api')({
  key: process.env.MEETUP_KEY
});

class Meetup{

  constructor(_topics){
    this.topics = _topics;
    console.log("Topics are: " + _topics);
  }

  _retrieveMeetup(){
    const options={
      topic_category: "tech",
      text: this.topics,
      order: "time"
    };
    // Return new promise
    return new Promise(function(resolve, reject) {
      _meetup.getUpcomingEvents(options, function(err,resp){
        if(err){
          reject(err);
        }else{
          resolve(resp.events);
        }
      });
    });
  }

  get upcomingEvents() {
    let _meetuplist = this._retrieveMeetup();
    return _meetuplist;
  }
}

module.exports = Meetup;
