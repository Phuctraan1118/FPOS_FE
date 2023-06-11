import { _success, _info, _warning, _error } from '../src';

describe('Log tests', () => {
  test('_success should out put success log message', () => {
    const msg = _success('log message');
    expect(msg).toBe('success');
  });

  test('_info should out put info log message', () => {
    const msg = _info('log message');
    expect(msg).toBe('info');
  });

  test('_warning should out put warning log message', () => {
    const msg = _warning('log message');
    expect(msg).toBe('warning');
  });

  test('_error should out put error log message', () => {
    const msg = _error('log message');
    expect(msg).toBe('error');
  });
});
