import Event from './entities/event.entity';
// import Sequ
import sequelize, { QueryTypes } from 'sequelize'
import Workshop from './entities/workshop.entity';
import Server from '../../server'

export class EventsService {

  async getWarmupEvents() {
    return await Event.findAll();
  }

  /* TODO: complete getEventsWithWorkshops so that it returns all events including the workshops
    Requirements:
    - maximum 2 sql queries
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    - Don't post process query result in javascript
    Hints:
    - open the `src/events/events.service` file
    - partial or not working answers also get graded so make sure you commit what you have
    Sample response on GET /events/events:
    ```json
    [
      {
        id: 1,
        name: 'Laravel convention 2021',
        createdAt: '2021-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 1,
            start: '2021-02-21 10:00:00',
            end: '2021-02-21 16:00:00',
            eventId: 1,
            name: 'Illuminate your knowledge of the laravel code base',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
      {
        id: 2,
        name: 'Laravel convention 2023',
        createdAt: '2023-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 2,
            start: '2023-10-21 10:00:00',
            end: '2023-10-21 18:00:00',
            eventId: 2,
            name: 'The new Eloquent - load more with less',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
          {
            id: 3,
            start: '2023-11-21 09:00:00',
            end: '2023-11-21 17:00:00',
            eventId: 2,
            name: 'AutoEx - handles exceptions 100% automatic',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
      {
        id: 3,
        name: 'React convention 2023',
        createdAt: '2023-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 4,
            start: '2023-08-21 10:00:00',
            end: '2023-08-21 18:00:00',
            eventId: 3,
            name: '#NoClass pure functional programming',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
          {
            id: 5,
            start: '2023-08-21 09:00:00',
            end: '2023-08-21 17:00:00',
            eventId: 3,
            name: 'Navigating the function jungle',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
    ]
    ```
     */
    
  async getEventsWithWorkshops() {
    const sqlQuery = "Select E1.id, E1.name, E1.createdAt, workshop_data.* from Event E1 Join (Select id as workshopId, start,end, eventId, name as workshopName, createdAt as workshopCreatedAt from Workshop) workshop_data on workshop_data.eventId = E1.id";
    const app = Server.getApp()
    try {
      const events = await app.getDataSource().query(sqlQuery, { type: QueryTypes.SELECT });
      let result: any = {}  
      events.forEach((event: any) => {
        const eventId = event.eventId;
        const workShopData = {
          id: event.workshopId,
          name: event.workshopName,
          start: event.start,
          end: event.end,
          createdAt: event.workshopCreatedAt,
          eventId
        }
        if (result[eventId]) {
          result[eventId].workshops.push(workShopData)
        } else {
          result[eventId] = {
            id: eventId,
            name: event.name,
            createdAt: event.createdAt,
            workshops: [workShopData]
          } 
        }
      })

      const response = Object.values(result);
      return response
    } catch(err) {
      console.log('error ======>', err)
    }
  }

  /* TODO: complete getFutureEventWithWorkshops so that it returns events with workshops, that have not yet started
    Requirements:
    - only events that have not yet started should be included
    - the event starting time is determined by the first workshop of the event
    - the code should result in maximum 3 SQL queries, no matter the amount of events
    - all filtering of records should happen in the database
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    - Don't post process query result in javascript
    Hints:
    - open the `src/events/events.service.ts` file
    - partial or not working answers also get graded so make sure you commit what you have
    - join, whereIn, min, groupBy, havingRaw might be helpful
    - in the sample data set  the event with id 1 is already in the past and should therefore be excluded
    Sample response on GET /futureevents:
    ```json
    [
        {
            "id": 2,
            "name": "Laravel convention 2023",
            "createdAt": "2023-04-20T07:01:14.000000Z",
            "workshops": [
                {
                    "id": 2,
                    "start": "2023-10-21 10:00:00",
                    "end": "2023-10-21 18:00:00",
                    "eventId": 2,
                    "name": "The new Eloquent - load more with less",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                },
                {
                    "id": 3,
                    "start": "2023-11-21 09:00:00",
                    "end": "2023-11-21 17:00:00",
                    "eventId": 2,
                    "name": "AutoEx - handles exceptions 100% automatic",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                }
            ]
        },
        {
            "id": 3,
            "name": "React convention 2023",
            "createdAt": "2023-04-20T07:01:14.000000Z",
            "workshops": [
                {
                    "id": 4,
                    "start": "2023-08-21 10:00:00",
                    "end": "2023-08-21 18:00:00",
                    "eventId": 3,
                    "name": "#NoClass pure functional programming",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                },
                {
                    "id": 5,
                    "start": "2023-08-21 09:00:00",
                    "end": "2023-08-21 17:00:00",
                    "eventId": 3,
                    "name": "Navigating the function jungle",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                }
            ]
        }
    ]
    ```
     */
  async getFutureEventWithWorkshops() {
    const sqlQuery = "Select E1.id, E1.name, E1.createdAt, workshop_data.* from Event E1 Join (Select id as workshopId, start,end, eventId, name as workshopName, createdAt as workshopCreatedAt from Workshop) workshop_data on workshop_data.eventId = E1.id AND workshop_data.start > date('NOW')";
    const app = Server.getApp()
    try {
      const events = await app.getDataSource().query(sqlQuery, { type: QueryTypes.SELECT });
      let result: any = {}  
      events.forEach((event: any) => {
        const eventId = event.eventId;
        const workShopData = {
          id: event.workshopId,
          name: event.workshopName,
          start: event.start,
          end: event.end,
          createdAt: event.workshopCreatedAt,
          eventId
        }
        if (result[eventId]) {
          result[eventId].workshops.push(workShopData)
        } else {
          result[eventId] = {
            id: eventId,
            name: event.name,
            createdAt: event.createdAt,
            workshops: [workShopData]
          } 
        }
      })

      const response = Object.values(result);
      console.log(JSON.stringify(response, null, 10))
      return response
    } catch(e) {
      console.log(e)
    }  
  }
}
