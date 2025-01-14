export const INITIAL_SCHEDULE = [
  { days: 'MONDAY-FRIDAY', hours: '9AM - 5PM' },
  { days: 'SATURDAY', hours: '9AM - 2PM' },
  { days: 'SUNDAY', hours: 'CLOSED' },
];

export const INITIAL_STYLES = {
  title: { color: '#FFFFFF', animation: 'none' },
  hours: Array(3).fill({ color: '#FFFFFF', animation: 'none' }),
  days: Array(3).fill({ color: '#4fd1c5', animation: 'none' }),
  divider: { color: '#FFFFFF', animation: 'none' },
};
