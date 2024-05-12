import { getCurrentTime } from './index';

export function displayCurrentTime() {
  const callMessage = `Called at ${getCurrentTime()}`;
  console.log(callMessage);
  console.log('');
}
