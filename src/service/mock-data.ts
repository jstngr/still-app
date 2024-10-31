import formatTimeFromTimestamp from 'shared/helpers/format-time-from-timestamp';
import { IFeedingEntry } from 'shared/types/types';

const startNumber =
  Math.floor(new Date().getTime() / 1000000000) * 1000000000 + 60 * 60 * 1000 * 10;
console.log(startNumber);

const hour = 60 * 60 * 1000;
const day = 24 * hour;

function timeToStamp(time: string, offset: number) {
  const today = new Date();
  const todayStamp = today.getTime();
  const newDayStamp = todayStamp - offset * day;
  const newDay = new Date(newDayStamp);
  const hours = parseInt(time.split(':')[0], 10);
  const minutes = parseInt(time.split(':')[1], 10);
  newDay.setHours(hours);
  newDay.setMinutes(minutes);
  return newDay.getTime();
}

function getStartAndEnd(startTime: string, durationMinutes: number, dayOffset: number) {
  const startStamp = timeToStamp(startTime, dayOffset);
  const stoppedStamp = startStamp + durationMinutes * 1000 * 60;
  return `${startStamp}, ${stoppedStamp}`;
}

function getRandomInterval(): number {
  return Math.floor(Math.random() * 30) + 1; // Generates a random interval between 1 and 30 minutes
}

export default function inserMok(db) {
  db.query(`
  INSERT INTO feeding (created, stopped, boob) VALUES
(${getStartAndEnd('00:15', getRandomInterval(), 0)}, 'Left'), 
(${getStartAndEnd('01:45', getRandomInterval(), 0)}, 'Right'), 
(${getStartAndEnd('03:30', getRandomInterval(), 0)}, 'Left'), 
(${getStartAndEnd('04:00', getRandomInterval(), 0)}, 'Right'), 
(${getStartAndEnd('04:30', getRandomInterval(), 0)}, 'Left'), 
(${getStartAndEnd('08:00', getRandomInterval(), 0)}, 'Right'), 
(${getStartAndEnd('09:45', getRandomInterval(), 0)}, 'Left'), 
(${getStartAndEnd('11:15', getRandomInterval(), 0)}, 'Right'), 
(${getStartAndEnd('00:15', getRandomInterval(), 1)}, 'Left'), 
(${getStartAndEnd('01:45', getRandomInterval(), 1)}, 'Right'), 
(${getStartAndEnd('03:30', getRandomInterval(), 1)}, 'Left'), 
(${getStartAndEnd('04:00', getRandomInterval(), 1)}, 'Right'), 
(${getStartAndEnd('04:30', getRandomInterval(), 1)}, 'Left'), 
(${getStartAndEnd('08:00', getRandomInterval(), 1)}, 'Right'), 
(${getStartAndEnd('09:45', getRandomInterval(), 1)}, 'Left'), 
(${getStartAndEnd('11:15', getRandomInterval(), 1)}, 'Right'), 
(${getStartAndEnd('12:45', getRandomInterval(), 1)}, 'Left'), 
(${getStartAndEnd('13:30', getRandomInterval(), 1)}, 'Right'), 
(${getStartAndEnd('14:15', getRandomInterval(), 1)}, 'Left'), 
(${getStartAndEnd('15:30', getRandomInterval(), 1)}, 'Right'), 
(${getStartAndEnd('16:45', getRandomInterval(), 1)}, 'Left'), 
(${getStartAndEnd('17:15', getRandomInterval(), 1)}, 'Right'), 
(${getStartAndEnd('18:00', getRandomInterval(), 1)}, 'Left'), 
(${getStartAndEnd('19:30', getRandomInterval(), 1)}, 'Right'), 
(${getStartAndEnd('20:15', getRandomInterval(), 1)}, 'Left'), 
(${getStartAndEnd('21:45', getRandomInterval(), 1)}, 'Right'), 
(${getStartAndEnd('23:00', getRandomInterval(), 1)}, 'Left'), 
(${getStartAndEnd('23:45', getRandomInterval(), 1)}, 'Right'), 
(${getStartAndEnd('00:15', getRandomInterval(), 2)}, 'Left'), 
(${getStartAndEnd('01:45', getRandomInterval(), 2)}, 'Right'), 
(${getStartAndEnd('03:30', getRandomInterval(), 2)}, 'Left'), 
(${getStartAndEnd('05:00', getRandomInterval(), 2)}, 'Right'), 
(${getStartAndEnd('06:30', getRandomInterval(), 2)}, 'Left'), 
(${getStartAndEnd('08:00', getRandomInterval(), 2)}, 'Right'), 
(${getStartAndEnd('09:45', getRandomInterval(), 2)}, 'Left'), 
(${getStartAndEnd('11:15', getRandomInterval(), 2)}, 'Right'), 
(${getStartAndEnd('12:45', getRandomInterval(), 2)}, 'Left'), 
(${getStartAndEnd('13:30', getRandomInterval(), 2)}, 'Right'), 
(${getStartAndEnd('14:15', getRandomInterval(), 2)}, 'Left'), 
(${getStartAndEnd('15:30', getRandomInterval(), 2)}, 'Right'), 
(${getStartAndEnd('16:45', getRandomInterval(), 2)}, 'Left'), 
(${getStartAndEnd('17:15', getRandomInterval(), 2)}, 'Right'), 
(${getStartAndEnd('18:00', getRandomInterval(), 2)}, 'Left'), 
(${getStartAndEnd('19:30', getRandomInterval(), 2)}, 'Right'), 
(${getStartAndEnd('20:15', getRandomInterval(), 2)}, 'Left'), 
(${getStartAndEnd('21:45', getRandomInterval(), 2)}, 'Right'), 
(${getStartAndEnd('23:00', getRandomInterval(), 2)}, 'Left'), 
(${getStartAndEnd('23:45', getRandomInterval(), 2)}, 'Right'),
(${getStartAndEnd('00:15', getRandomInterval(), 3)}, 'Left'), 
(${getStartAndEnd('01:45', getRandomInterval(), 3)}, 'Right'), 
(${getStartAndEnd('03:30', getRandomInterval(), 3)}, 'Left'), 
(${getStartAndEnd('05:00', getRandomInterval(), 3)}, 'Right'), 
(${getStartAndEnd('06:30', getRandomInterval(), 3)}, 'Left'), 
(${getStartAndEnd('08:00', getRandomInterval(), 3)}, 'Right'), 
(${getStartAndEnd('09:45', getRandomInterval(), 3)}, 'Left'), 
(${getStartAndEnd('11:15', getRandomInterval(), 3)}, 'Right'), 
(${getStartAndEnd('12:45', getRandomInterval(), 3)}, 'Left'), 
(${getStartAndEnd('13:30', getRandomInterval(), 3)}, 'Right'), 
(${getStartAndEnd('14:15', getRandomInterval(), 3)}, 'Left'), 
(${getStartAndEnd('15:30', getRandomInterval(), 3)}, 'Right'), 
(${getStartAndEnd('16:45', getRandomInterval(), 3)}, 'Left'), 
(${getStartAndEnd('17:15', getRandomInterval(), 3)}, 'Right'), 
(${getStartAndEnd('18:00', getRandomInterval(), 3)}, 'Left'), 
(${getStartAndEnd('19:30', getRandomInterval(), 3)}, 'Right'), 
(${getStartAndEnd('20:15', getRandomInterval(), 3)}, 'Left'), 
(${getStartAndEnd('21:45', getRandomInterval(), 3)}, 'Right'), 
(${getStartAndEnd('23:00', getRandomInterval(), 3)}, 'Left'), 
(${getStartAndEnd('23:45', getRandomInterval(), 3)}, 'Right');
`);
}
