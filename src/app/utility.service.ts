import { Injectable } from '@angular/core';
import { Special } from './special';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  // capitalize the first letter of a word
  capitalize(word: string): string{
    word = word.toLowerCase();
    return word.replace(/\b\w/g, l => l.toUpperCase());
  }

  // check to make sure email is valid
  checkEmail(email: string): boolean {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // covert phone number to (xxx) xxx-xxxx
  convertPhone(phone: number): string {
    var workPhone = phone.toString().trim();
    var year = workPhone.substring(0, 4);

    return ('(' + workPhone.substring(0, 3) + ') ' +
            workPhone.substring(3, 6) + '-' +
            workPhone.substring(6, 10));
  }

  // convert date to Month Day, Year
  convertDate(date: number): string {
    var workDate = date.toString().trim();
    var monthNames = [
      "Jan.", "Feb.", "Mar.",
      "Apr.", "May", "June", "July",
      "Aug.", "Sept.", "Oct.",
      "Nov.", "Dec."
    ];
    var monthIndex = parseInt(workDate.substring(4, 6))-1;
    var day = workDate.substring(6, 8);
    var year = workDate.substring(0, 4);

    return monthNames[monthIndex] + ' ' + day + ', ' + year;
  }

  // convert time to XX:XX AM
  convertTime(time: number): string {
    var workTime = time;
    var workType;
    var timeStr;
    var TimeType = [
      "AM", "PM"
    ];
    if (workTime >= 1200)
    {
      workType = 1;
      if (workTime >= 1300)
      {
        workTime -= 1200;
      }
    }
    else
    {
      workType = 0;
    }

    var workTimeStr = workTime.toString();

    if (workTime >= 1000)
    {
      timeStr = workTimeStr.substring(0, 2) + ':' + workTimeStr.substring(2, 4);
    }
    else
    {
      timeStr = workTimeStr.substring(0, 1) + ':' + workTimeStr.substring(1, 3);
    }
    timeStr = timeStr + ' ' + TimeType[workType];

    return timeStr;
  }

  // get the index for that date
  getDateIndex(date: number, special: Special): number {
    if (date != null)
    {
      for(var i = 0; i < special.dates.length; i++)
      {
        if(special.dates[i].value == date)
        {
          // console.log("Date is: " + date);
          // console.log("Found index: "+ i)
          return i;
        }
      }
    }
    return 0;
  }

  // get the index for that time
  getTimeIndex(time: number, dateIndex: number, special: Special): number {
    if (time > 0)
    {
      for(var i = 0; i < special.dates[dateIndex].times.length; i++)
      {
        // console.log("Current index: "+ i)
        if(special.dates[dateIndex].times[i].value == time)
        {
          // console.log("Time is: " + time);
          // console.log("Found index: "+ i)
          return i;
        }
      }
    }
    return 0;
  }

}
