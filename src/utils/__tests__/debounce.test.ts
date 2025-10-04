import { debounce } from '../debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should debounce function calls', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn('test1');
    debouncedFn('test2');
    debouncedFn('test3');

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test3');
  });

  it('should cancel previous timeout when called multiple times', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn('call1');
    jest.advanceTimersByTime(200);

    debouncedFn('call2');
    jest.advanceTimersByTime(200);

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('call2');
  });

  it('should work with multiple arguments', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 200);

    debouncedFn('arg1', 'arg2', 'arg3');

    jest.advanceTimersByTime(200);

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
  });
});
