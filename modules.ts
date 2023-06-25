import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;

interface CalendarInterface {
  createCalendarEvent(name: string, location: string): void;
  getConstants: any;
}

export default CalendarModule as CalendarInterface;
