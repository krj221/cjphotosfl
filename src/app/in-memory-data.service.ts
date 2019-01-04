import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Appointment } from './appointment'

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const appointments = [
      // { id: 11, first: 'Mr. Nice', last: 'Johnson', email: 'example.@gmail.com' },
      // { id: 12, first: 'Narco', last: 'Something', email: 'example.@gmail.com' },
      // { id: 13, first: 'Bombasto', last: 'Yupp', email: 'example.@gmail.com' },
      // { id: 14, first: 'Celeritas', last: 'working', email: 'example.@gmail.com' },
      // { id: 15, first: 'Magneta', last: 'yesss', email: 'example.@gmail.com' },
      // { id: 16, first: 'RubberMan', last: 'testt', email: 'example.@gmail.com' },
      // { id: 17, first: 'Dynama', last: 'testname', email: 'example.@gmail.com' },
      // { id: 18, first: 'Dr IQ', last: 'lastname', email: 'example.@gmail.com' },
      // { id: 19, first: 'Magma', last: 'wtf', email: 'example.@gmail.com' },
      // { id: 20, first: 'Tornado', last: 'enough', email: 'example.@gmail.com' }
    ];
    return {appointments};
  }
  // genId(appointments: Appointment[]): number {
  //   return appointments.length > 0 ? Math.max(...appointments.map(appointment => appointment._id)) + 1 : 1;
  // }
}
