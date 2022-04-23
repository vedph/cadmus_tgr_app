import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * General purpose bucket store for sharing data clips across
 * components. This is used like a clipboard, avoiding the hassles
 * connected with OS clipboard, its browser support, and browser
 * implementations (see e.g.
 * https://medium.com/geekculture/explore-clipboard-operation-in-javascript-c6399619c0ac).
 * This is just a wrapper for a singleton Map<string, any>.
 */
@Injectable({
  providedIn: 'root',
})
export class BucketStoreService {
  private readonly _map: Map<string, any>;
  private readonly _changes$: BehaviorSubject<string | undefined>;

  /**
   * Emitted whenever the store has changed. The value emitted
   * is the key of the bucket which has been modified, or undefined
   * (when initialized or cleared).
   */
  public get changes$(): Observable<string | undefined> {
    return this._changes$.asObservable();
  }

  constructor() {
    this._map = new Map<string, any>();
    this._changes$ = new BehaviorSubject<string | undefined>(undefined);
  }

  public set(key: string, value: any): void {
    this._map.set(key, value);
    this._changes$.next(key);
  }

  public get(key: string): any {
    return this._map.get(key);
  }

  public delete(key: string): void {
    if (this._map.has(key)) {
      this._map.delete(key);
      this._changes$.next(key);
    }
  }

  public clear(): void {
    this._map.clear();
    this._changes$.next(undefined);
  }

  public has(key: string): boolean {
    return this._map.has(key);
  }
}
