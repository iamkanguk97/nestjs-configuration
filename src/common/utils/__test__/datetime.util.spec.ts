import dayjs from 'dayjs';

import { DateTime } from '@common/utils/datetime.util';

describe('DateTime Util', () => {
  const MOCK_DATE = new Date('2026-01-01T00:00:00.000Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_DATE);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('now', () => {
    it('현재 시간을 ISO 문자열로 반환해야 합니다.', () => {
      const result = DateTime.Now.iso();
      expect(result).toBe('2026-01-01T00:00:00.000Z');
    });
  });

  describe('format', () => {
    it('주어진 날짜를 지정된 형식으로 변환해야 한다.', () => {
      const input = new Date('2026-12-25T10:30:00.000Z');
      const format = 'YYYY-MM-DD';

      const result = DateTime.format(input, format);

      expect(result).toBe('2026-12-25');
    });

    it('문자열 날짜도 정상적으로 변환해야 한다.', () => {
      const input = '2026-12-25T10:30:00.000Z';
      const format = 'YYYY.MM.DD HH:mm';

      const result = DateTime.format(input, format);
      const expected = dayjs(input).format(format);

      expect(result).toBe(expected);
    });

    // it('잘못된 포맷이 인수로 들어온다면?', () => {});
  });

  describe('addDays', () => {
    it('현재 시간 기준으로 날짜를 더해서 ISO 문자열로 반환해야 한다.', () => {
      const daysToAdd = 7;
      const result = DateTime.addDays(daysToAdd);

      expect(result).toBe('2026-01-08T00:00:00.000Z');
    });

    it('음수를 넣으면 날짜를 뺴야 한다.', () => {
      const daysToAdd = -1;
      const result = DateTime.addDays(daysToAdd);

      expect(result).toBe('2025-12-31T00:00:00.000Z');
    });
  });
});
