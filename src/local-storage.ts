// Copyright (c) 2021-2022, Brandon Lehmann <brandonlehmann@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as ls from 'local-storage';
import { EventEmitter } from 'events';
import FileStorage from './file-storage';

/** @ignore */
const localStorageAvailable = !!(global && global.localStorage);

/** @ignore */
const events = new EventEmitter();

/** @ignore */
export type Callback<TYPE = any> = (value: TYPE | undefined, old: TYPE | undefined, url: string) => void;

export default class LocalStorage {
    /**
     * Returns the current local storage path if not browser
     */
    public static get path (): string | undefined {
        return !localStorageAvailable ? FileStorage.path : undefined;
    }

    /**
     * Sets the local storage path if not browser
     *
     * @param value
     */
    public static set path (value: string | undefined) {
        if (!localStorageAvailable && value) {
            FileStorage.path = value;
        }
    }

    /**
     * Clears the local storage
     */
    public static clear () {
        localStorageAvailable ? ls.clear() : FileStorage.clear();
    }

    /**
     * Returns if the local storage has the key available
     *
     * @param key
     */
    public static has (key: string): boolean {
        return typeof LocalStorage.get(key) !== 'undefined';
    }

    /**
     * Retrieves the value for the specified key if it exists in the local storage
     * @param key
     */
    public static get<Type = any> (key: string): Type | undefined {
        return localStorageAvailable ? ls.get(key) : FileStorage.getItem(key);
    }

    /**
     * Removes a listener previously attached with LocalStorage.on(key, fn).
     *
     * value: the current value for key in local storage, parsed from the persisted JSON
     * old: the old value for key in local storage, parsed from the persisted JSON
     * url: the url for the tab where the modification came from
     *
     * @param key
     * @param callback
     */
    public static off<Type = any> (key: string, callback: Callback<Type>): void {
        events.off(key, callback);
    }

    /**
     * Listen for changes persisted against key on other tabs.
     * Triggers callback when a change occurs, passing the following arguments.
     *
     * value: the current value for key in local storage, parsed from the persisted JSON
     * old: the old value for key in local storage, parsed from the persisted JSON
     * url: the url for the tab where the modification came from
     *
     * @param key
     * @param callback
     */
    public static on<Type = any> (key: string, callback: Callback<Type>): void {
        events.on(key, callback);
    }

    /**
     * Listen ONCE for changes persisted against key on other tabs
     * Triggers callback when a change occurs, passing the following arguments.
     *
     * value: the current value for key in local storage, parsed from the persisted JSON
     * old: the old value for key in local storage, parsed from the persisted JSON
     * url: the url for the tab where the modification came from
     *
     * @param key
     * @param callback
     */
    public static once<Type = any> (key: string, callback: Callback<Type>): void {
        events.once(key, callback);
    }

    /**
     * Removes the key from local storage
     *
     * @param key
     */
    public static remove (key: string): void {
        const old = LocalStorage.get(key);

        localStorageAvailable ? ls.remove(key) : FileStorage.removeItem(key);

        events.emit(key, undefined, old, localStorageAvailable ? window.location.toString() : process.cwd());
    }

    /**
     * Sets the value for the key in local storage
     *
     * @param key
     * @param value
     */
    public static set<Type> (key: string, value: Type): void {
        const old = LocalStorage.get(key);

        localStorageAvailable ? ls.set(key, value) : FileStorage.setItem(key, value);

        events.emit(key, value, old, localStorageAvailable ? window.location.toString() : process.cwd());
    }
}
