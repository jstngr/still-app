import { IFeedingEntry } from 'shared/types/types';

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

export function WebMock(): IFeedingEntry[] {
  return [
    getStartAndEnd('00:15', getRandomInterval(), 0),
    getStartAndEnd('01:45', getRandomInterval(), 0),
    getStartAndEnd('03:30', getRandomInterval(), 0),
    getStartAndEnd('04:00', getRandomInterval(), 0),
    getStartAndEnd('04:30', getRandomInterval(), 0),
    getStartAndEnd('08:00', getRandomInterval(), 0),
    getStartAndEnd('09:45', getRandomInterval(), 0),
    getStartAndEnd('11:15', getRandomInterval(), 0),
    getStartAndEnd('00:15', getRandomInterval(), 1),
    getStartAndEnd('01:45', getRandomInterval(), 1),
    getStartAndEnd('03:30', getRandomInterval(), 1),
    getStartAndEnd('04:00', getRandomInterval(), 1),
    getStartAndEnd('04:30', getRandomInterval(), 1),
    getStartAndEnd('08:00', getRandomInterval(), 1),
    getStartAndEnd('09:45', getRandomInterval(), 1),
    getStartAndEnd('11:15', getRandomInterval(), 1),
    getStartAndEnd('12:45', getRandomInterval(), 1),
    getStartAndEnd('13:30', getRandomInterval(), 1),
    getStartAndEnd('14:15', getRandomInterval(), 1),
    getStartAndEnd('15:30', getRandomInterval(), 1),
    getStartAndEnd('16:45', getRandomInterval(), 1),
    getStartAndEnd('17:15', getRandomInterval(), 1),
    getStartAndEnd('18:00', getRandomInterval(), 1),
    getStartAndEnd('19:30', getRandomInterval(), 1),
    getStartAndEnd('20:15', getRandomInterval(), 1),
    getStartAndEnd('21:45', getRandomInterval(), 1),
    getStartAndEnd('23:00', getRandomInterval(), 1),
    getStartAndEnd('23:45', getRandomInterval(), 1),
    getStartAndEnd('00:15', getRandomInterval(), 2),
    getStartAndEnd('01:45', getRandomInterval(), 2),
    getStartAndEnd('03:30', getRandomInterval(), 2),
    getStartAndEnd('05:00', getRandomInterval(), 2),
    getStartAndEnd('06:30', getRandomInterval(), 2),
    getStartAndEnd('08:00', getRandomInterval(), 2),
    getStartAndEnd('09:45', getRandomInterval(), 2),
    getStartAndEnd('11:15', getRandomInterval(), 2),
    getStartAndEnd('12:45', getRandomInterval(), 2),
    getStartAndEnd('13:30', getRandomInterval(), 2),
    getStartAndEnd('14:15', getRandomInterval(), 2),
    getStartAndEnd('15:30', getRandomInterval(), 2),
    getStartAndEnd('16:45', getRandomInterval(), 2),
    getStartAndEnd('17:15', getRandomInterval(), 2),
    getStartAndEnd('18:00', getRandomInterval(), 2),
    getStartAndEnd('19:30', getRandomInterval(), 2),
    getStartAndEnd('20:15', getRandomInterval(), 2),
    getStartAndEnd('21:45', getRandomInterval(), 2),
    getStartAndEnd('23:00', getRandomInterval(), 2),
    getStartAndEnd('23:45', getRandomInterval(), 2),
    getStartAndEnd('00:15', getRandomInterval(), 3),
    getStartAndEnd('01:45', getRandomInterval(), 3),
    getStartAndEnd('03:30', getRandomInterval(), 3),
    getStartAndEnd('05:00', getRandomInterval(), 3),
    getStartAndEnd('06:30', getRandomInterval(), 3),
    getStartAndEnd('08:00', getRandomInterval(), 3),
    getStartAndEnd('09:45', getRandomInterval(), 3),
    getStartAndEnd('11:15', getRandomInterval(), 3),
    getStartAndEnd('12:45', getRandomInterval(), 3),
    getStartAndEnd('13:30', getRandomInterval(), 3),
    getStartAndEnd('14:15', getRandomInterval(), 3),
    getStartAndEnd('15:30', getRandomInterval(), 3),
    getStartAndEnd('16:45', getRandomInterval(), 3),
    getStartAndEnd('17:15', getRandomInterval(), 3),
    getStartAndEnd('18:00', getRandomInterval(), 3),
    getStartAndEnd('19:30', getRandomInterval(), 3),
    getStartAndEnd('20:15', getRandomInterval(), 3),
    getStartAndEnd('21:45', getRandomInterval(), 3),
    getStartAndEnd('23:00', getRandomInterval(), 3),
    getStartAndEnd('23:45', getRandomInterval(), 3),
  ].map((e, index) => {
    const start = e.split(', ')[0];
    const end = e.split(', ')[1];
    return {
      type: index % 2 === 1 ? 'Left' : 'Right',
      created: parseInt(start, 10),
      stopped: parseInt(end, 10),
      id: index,
    } as IFeedingEntry;
  });
}

export default function inserMok(db) {
  db.query(`
  INSERT INTO feeding (created, stopped, type) VALUES
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
