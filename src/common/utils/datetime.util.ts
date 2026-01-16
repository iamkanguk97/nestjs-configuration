import dayjs from 'dayjs';

export namespace DateTime {
  export function now(): string {
    return dayjs().toISOString();
  }

  export function format(date: Date | string, format: string): string {
    return dayjs(date).format(format);
  }

  export function addDays(day: number): string {
    return dayjs().add(day, 'day').toISOString();
  }
}
