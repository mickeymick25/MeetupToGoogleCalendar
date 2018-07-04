const fs = require('fs');
const mkdirp = require('mkdirp');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
//const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'credentials.json';
const CALENDAR_ID = process.env.GOOGLE_CALENDAR;
// const CALENDAR_ID = 'octo.com_jbo2ben9ldqrfjpbq7v74bnb4k@group.calendar.google.com';
//const CALENDAR_ID = 'primary';


class Google{

  constructor(aMeetup){
    // Load client secrets from a local file.
    fs.readFile('client_secret.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google API.
      const callback = this.getAddEvent;
      const meetupList = aMeetup;
      const path = this ;
      //const callback = function(){console.log("init done!");};
      this.authorize(JSON.parse(content), callback, meetupList, path);
      //this.authorize(JSON.parse(content));
      //console.log("callback :: "+ callback);
    });
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  authorize(credentials, callback, paramMeetup, context) {
  //authorize(credentials) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return this.getAccessToken(oAuth2Client, callback);
      //if (err) return this.getAccessToken(oAuth2Client);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client, paramMeetup, context);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  getAccessToken(oAuth2Client, callback, paramMeetup, context) {
  //getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:\n', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here:\n', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return callback(err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client, paramMeetup, context);
      });
    });
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  listEvents(auth) {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      // calendarId: 'primary',
      calendarId: CALENDAR_ID,
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, {data}) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = data.items;
      if (events.length) {
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('No upcoming events found.');
      }
    });
  }

  /**
   * Lists all the events on the user's primary calendar for a specific date.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   * @param {date} date A date to get events
   */
  listEventsByDate(auth, date){
    console.log("-> Into listEventsByDate for :: " + new Date(date));

    let _day = date.getDate();
    let _month = date.getMonth();
    let _year = date.getFullYear();

    let startDate = new Date(Date.UTC(_year, _month, _day, -2, 0, 0));
    let endDate = new Date(Date.UTC(_year, _month, _day, 22, 0, 0));
    // console.log(" startDate :: " + startDate);
    // console.log(" endDate :: " + endDate);

    const calendar = google.calendar({version: 'v3', auth});

    return new Promise((resolve, reject) => {
      calendar.events.list({
        // calendarId: 'primary',
        calendarId: CALENDAR_ID,
        timeMin: startDate,
        timeMax: endDate,
        // maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
      }, (err, {data}) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = data.items;
        if (events.length) {
          events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
          });
        }
        resolve(events);
      });
    });
  }

  /**
   * return if event was found into the retreive calendar list.
   * @param {currentEvents} Array List of event of the day
   * @param {eventToAdd} Object Object that we need an answer if is already into calendar or not
   */
   checkIfEventExist(currentEvents, eventToAdd){
     console.log("-> Into checkIfEventExist" );
     console.log("Event to add Time :: "+ eventToAdd.start.dateTime);
     let isExist = false;
     //check if event to add wad already added!
     for(let i=0; i< currentEvents.length ;i++){
       console.log("Current Event Time :: "+ new Date( currentEvents[i].start.dateTime));

       // compare current date to all event dateTime + subject
       if(new Date(eventToAdd.start.dateTime).getTime() == new Date(currentEvents[i].start.dateTime).getTime()){
         //check is summary is the same
         if((eventToAdd.summary) == (currentEvents[i].summary)){
            isExist=true;
            console.log("Event Subject is the same... We consider this is the same event");
            break;
         }else {
           // means it is not the same event
           isExist=false;
         }
       }else {
         isExist=false;
       }
     }
     return isExist;
   }

   /**
    * Transform meetup object into calendar object
    * @param {meetuptable} Object List of meetup matching topics
    */
   convertMeetupToEvent(meetuptable){
     let eventsTable = [];


     //on parcourt le tableau des meetup.
     for(let i=0; i<meetuptable.length ; i++){
       // console.log("meetuptable. name :: " + meetuptable[i].name);
       // console.log("meetuptable.venue :: " + meetuptable[i].venue);
       if(meetuptable[i].venue != undefined){
         let event = {
             'summary': meetuptable[i].name,
             'location': meetuptable[i].venue.name +", "+meetuptable[i].venue.address_1+", "+ meetuptable[i].venue.city,
             'description': meetuptable[i].description,
             "creator": {
               "email": 'mibo@octo.com',
               "displayName": 'Michael via Ux Tribe Bot'
             },
             "organizer": {
               "displayName": meetuptable[i].group.name
             },
             'start': {
               'dateTime': new Date(meetuptable[i].time),
               'timeZone': meetuptable[i].group.timezone
             },
             'end': {
               'dateTime': new Date(meetuptable[i].time + meetuptable[i].duration),
               'timeZone': meetuptable[i].group.timezone
             },
             "source": {
               "url": meetuptable[i].link,
               "title": 'Meetup'
             }
         };
         eventsTable.push(event);
       }
     }
     //console.log("eventsTable length :: " + eventsTable.length);
     return eventsTable;
   }

  /**
   * Add an event on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   * @param {meetuptable} Object List of meetup matching topics
   */
  async getAddEvent(auth, meetuptable, context) {
    // console.log("Into getAddEvent");
    // console.log("auth ::"+auth);
    const calendar = google.calendar({version: 'v3', auth});

    console.log("Start converting Meetups into Google Calendar events...");
    let eventTable = await context.convertMeetupToEvent(meetuptable);
    console.log(eventTable.length + " Convertions finished! ");

    for(let i=0; i<eventTable.length; i++ ){
      let eventToAdd = eventTable[i];

      console.log("\nWe will try to add event #"+i+" ::\n"+ eventToAdd.summary +', '+ new Date(eventToAdd.start.dateTime));
      // Retreive events regarding "the event to add" date
      let currentEvents = await context.listEventsByDate(auth, eventToAdd.start.dateTime);
      console.log("There is " + currentEvents.length + " events this day !");

       let ifEventExist = context.checkIfEventExist(currentEvents, eventToAdd);
       if(ifEventExist){
         // if exist -> check if need to be moved
         console.log("Event already added to Calendar!");
       }else {
         //if do no exist -> create
         calendar.events.insert({
           // calendarId: 'primary',
           calendarId: CALENDAR_ID,
           'resource': eventToAdd
         }, (err, {data}) => {
           if (err) return console.log('The API returned an error: ' + err);
           console.log('Event '+ eventToAdd.summary +' sucessfully added !');
         });

         console.log("==> Event added to Calendar!");
       }
    }
    console.log("\n*** *** ****************** *** ***");
    console.log("*** END of Ux Tribe Automation ***");
    console.log("*** *** ****************** *** ***");
  }
//fin de classe
}

module.exports = Google;
