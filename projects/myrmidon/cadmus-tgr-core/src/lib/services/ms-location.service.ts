import { Injectable } from '@angular/core';
import { RomanNumber } from '@myrmidon/ng-tools';
import { MsLocation, MsLocationRange } from '../models';

/**
 * Service for parsing and stringifying a MsLocation.
 */
@Injectable({
  providedIn: 'root',
})
export class MsLocationService {
  public static readonly locRegexp = new RegExp(
    '^\\s*([0-9]+|[IVX]+)([a-z]{0,2})\\s*([0-9]+)?\\s*$'
  );
  public static readonly locsRegexp = new RegExp(
    '^(?:([0-9]+|[IVX]+)([a-z]{0,2})\\s*([0-9]+)?\\s*)*$'
  );
  public static readonly rangesRegexp = new RegExp(
    '^(?:([0-9]+|[IVX]+)([a-z]{0,2})\\s*([0-9]+)?(\\s*-\\s*([0-9]+|[IVX]+)([a-z]{0,2})\\s*([0-9]+)?)?)*$'
  );

  /**
   * Parse the text representing a MsLocation, in the form
   * nr + 0-2 lowercase letters + optional whitespace + ln,
   * like "36r 12", where nr can be either Arabic or Roman
   * (uppercase).
   *
   * @param text The text to be parsed.
   * @returns The location, or null if invalid text.
   */
  public parseLocation(text?: string | null): MsLocation | null {
    if (!text) {
      return null;
    }

    const m = MsLocationService.locRegexp.exec(text);
    if (!m) {
      return null;
    }

    // n
    let n = 0;
    let r: boolean;

    if (m[1][0] >= '0' && m[1][0] <= '9') {
      n = +m[1];
      r = false;
    } else {
      n = RomanNumber.fromRoman(m[1]);
      r = true;
    }

    return {
      n,
      r,
      s: m[2] ? m[2] : undefined,
      l: m[3] ? +m[3] : 0,
    };
  }

  /**
   * Convert the specified MsLocation into a string, parsable
   * with parseLocation.
   *
   * @param location The location. If null, null is returned.
   * @returns String with form nr + suffix + ln, like "36r12", "IIrv13", etc.
   */
  public locationToString(
    location: MsLocation | undefined | null
  ): string | null {
    if (!location || location.n === null || location.n === undefined) {
      return null;
    }
    const sb: string[] = [];
    if (location.r) {
      sb.push(RomanNumber.toRoman(location.n));
    } else {
      sb.push(location.n.toString());
    }

    if (location.s) {
      sb.push(location.s);
    }

    if (location.l) {
      sb.push(location.l.toString());
    }
    return sb.join('');
  }

  /**
   * Convert the specified range of start-end locations to a string.
   *
   * @param range The range.
   * @returns String or null.
   */
  public rangeToString(
    range?: MsLocationRange | undefined | null
  ): string | null {
    if (!range || !range.start) {
      return null;
    }
    const sb: string[] = [];
    const start = this.locationToString(range.start);
    sb.push(start!);
    if (range.end) {
      const end = this.locationToString(range.end);
      if (start !== end) {
        sb.push('-');
        sb.push(end!);
      }
    }
    return sb.join('');
  }
}
