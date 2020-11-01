export class Event {

  private static readonly SPRING = new Event('SPRING', Event.makeDate(2020, 3, 21), Event.makeDate(2020, 6, 20), []);
  private static readonly SUMMER = new Event('SUMMER', Event.makeDate(2020, 6, 21), Event.makeDate(2020, 9, 20), []);
  private static readonly FALL = new Event('FALL', Event.makeDate(2020, 9, 21), Event.makeDate(2020, 12, 20), []);
  private static readonly WINTER = new Event('WINTER', Event.makeDate(2020, 12, 21), Event.makeDate(2020, 3, 20), []);
  private static readonly CHRISTMAS = new Event('CHRISTMAS', Event.makeDate(2020, 12, 25), Event.makeDate(2020, 12, 26), []);
  private static readonly HALLOWEEN = new Event('HALLOWEEN', Event.makeDate(2020, 12, 25), Event.makeDate(2020, 10, 31), []);
  private static readonly EASTER = new Event('EASTER', Event.makeDate(2020, 4, 4), Event.makeDate(2020, 4, 5), []);

  private constructor(private readonly key: string, public start: Date, public end: Date, public value: []) {

  }

  public static makeDate(y, m, d) {
    return new Date(y, m - 1, d);
  }

  public toString(): {} {
    return this.value;
  }
}
