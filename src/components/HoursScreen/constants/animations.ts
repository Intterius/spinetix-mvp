export const BACKGROUND_ANIMATIONS = {
  '@keyframes kenBurnsZoomIn': {
    '0%': { transform: 'scale(1)' },
    '100%': { transform: 'scale(1.3)' },
  },
  '@keyframes kenBurnsZoomOut': {
    '0%': { transform: 'scale(1.3)' },
    '100%': { transform: 'scale(1)' },
  },
  '@keyframes kenBurnsRight': {
    '0%': { transform: 'scale(1.3) translate(-10%, 0)' },
    '100%': { transform: 'scale(1.3) translate(10%, 0)' },
  },
  '@keyframes kenBurnsLeft': {
    '0%': { transform: 'scale(1.3) translate(10%, 0)' },
    '100%': { transform: 'scale(1.3) translate(-10%, 0)' },
  },
  '@keyframes kenBurnsUp': {
    '0%': { transform: 'scale(1.3) translate(0, 10%)' },
    '100%': { transform: 'scale(1.3) translate(0, -10%)' },
  },
  '@keyframes kenBurnsDown': {
    '0%': { transform: 'scale(1.3) translate(0, -10%)' },
    '100%': { transform: 'scale(1.3) translate(0, 10%)' },
  },
};

export const CONTENT_ANIMATIONS = {
  fade: {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  slide: {
    '0%': { transform: 'translateX(-100px)', opacity: 0 },
    '100%': { transform: 'translateX(0)', opacity: 1 },
  },
  zoom: {
    '0%': { transform: 'scale(0)', opacity: 0 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
};
