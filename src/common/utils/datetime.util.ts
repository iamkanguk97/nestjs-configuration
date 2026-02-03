import dayjs from 'dayjs';

export namespace DateTime {
  export namespace Now {
    export function iso(): string {
      return dayjs().toISOString();
    }

    export function date(): Date {
      return dayjs().toDate();
    }
  }

  export function format(date: Date | string, format: string): string {
    return dayjs(date).format(format);
  }

  export function addDays(day: number): string {
    return dayjs().add(day, 'day').toISOString();
  }
}
