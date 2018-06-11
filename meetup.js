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

// module.exports.myMeetup = function (){
//   return new Promise(function(resolve, reject) {
//     var _meetup = require('meetup-api')({
//       key: process.env.MEETUP_KEY
//     });
//
//     _meetup.getUpcomingEvents({
//         //topic_category: "tech",
//         text: process.env.MEETUP_TOPICS,
//         order: "time"
//     }, function(err, resp) {
//       if(err != true){
//         console.log("Il y a exactement :: " + resp.events.length + " Meetups");
//         //
//         for(var i=0; i<resp.events.length; i++){
//            console.log("------------------------------------------------------------------------------ Meetup"+i);
//            //console.log("Meetup id: "+ resp.events[i].id);
//            console.log("Meetup Name: "+resp.events[i].name);
//
//            if(resp.events[i].venue != undefined){
//               console.log("Meetup venue: "+resp.events[i].venue["name"]+", "+resp.events[i].venue["address_1"]+", "+resp.events[i].venue["city"]);
//            }else{
//               console.log("Meetup venue: Pas de lieu défini");
//            }
//
//           //console.log("Meetup time: "+new Date(resp.events[i].time));
//           //console.log("Meetup participants is: "+ resp.events[i].yes_rsvp_count+"/"+resp.events[i].rsvp_limit);
//           //console.log("Meetup waiting list: "+ resp.events[i].waitlist_count);
//           //console.log("Meetup link: "+ resp.events[i].link);
//           //console.log("Meetup link: "+ resp.events[i].description);
//          }
//       }else{
//         // il y a une erreur...
//         reject("raison d'echec :: "+ err);
//       }
//     });
//     // resolve for callback
//     resolve('resolved fetch meetup');
//   });
// }
