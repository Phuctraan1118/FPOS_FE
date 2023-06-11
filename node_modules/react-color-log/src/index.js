const COLORS = {
  SUCCESS: 'LimeGreen',
  INFO: 'DodgerBlue',
  WARNING: 'Orange',
  ERROR: 'Red',
};
const FONT_SIZE = '12px';
const FONT_WEIGHT = 'normal';

export const _success = (msg) => {
  console.log(`%c${msg}`, `color:${COLORS.SUCCESS};font-size: ${FONT_SIZE}; font-weight: ${FONT_WEIGHT}`);
  return 'success';
};

export const _info = (msg) => {
  console.log(`%c${msg}`, `color:${COLORS.INFO};font-size: ${FONT_SIZE}; font-weight: ${FONT_WEIGHT}`);
  return 'info';
};

export const _warning = (msg) => {
  console.log(`%c${msg}`, `color:${COLORS.WARNING};font-size: ${FONT_SIZE}; font-weight: ${FONT_WEIGHT}`);
  return 'warning';
};

export const _error = (msg) => {
  console.log(`%c${msg}`, `color:${COLORS.ERROR};font-size: ${FONT_SIZE}; font-weight: ${FONT_WEIGHT}`);
  return 'error';
};
