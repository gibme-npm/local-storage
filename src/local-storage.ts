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

/**
 * Defines a StorageCallback for certain storage events
 */
export type StorageCallback<TYPE = any> = (oldValue: TYPE | undefined, newValue: TYPE | undefined, url: string) => void;

export default abstract class LocalStorage {
    /**
     * Returns if the module is using a browser's [localStorage](https://www.w3schools.com/html/html5_webstorage.asp)
     */
    public static get isBrowserLocalStorage (): boolean {
        return localStorageAvailable;
    }

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
     * Returns the underlying key ID for the specified key
     *
     * @param key
     */
    public static id (key: string): string {
        return localStorageAvailable ? key : FileStorage.id(key);
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
    public static has<Type = any> (key: string): boolean {
        return typeof LocalStorage.get<Type>(key) !== 'undefined';
    }

    /**
     * Retrieves the value for the specified key if it exists in the local storage
     * @param key
     */
    public static get<Type = any> (key: string): Type | undefined {
        return localStorageAvailable ? ls.get<Type>(key) : FileStorage.getItem<Type>(key);
    }

    /**
     * Removes a listener previously attached with LocalStorage.on(key, fn).
     *
     * value: the current value for key in local storage, parsed from the persisted JSON
     * old: the old value for key in local storage, parsed from the persisted JSON
     * url: the url for the tab where the modification came from
     *
     * @param key
     * @param StorageCallback
     */
    public static off<Type = any> (key: string, StorageCallback: StorageCallback<Type>): void {
        events.off(key, StorageCallback);
    }

    /**
     * Listen for changes persisted against key on other tabs.
     * Triggers StorageCallback when a change occurs, passing the following arguments.
     *
     * value: the current value for key in local storage, parsed from the persisted JSON
     * old: the old value for key in local storage, parsed from the persisted JSON
     * url: the url for the tab where the modification came from
     *
     * @param key
     * @param StorageCallback
     */
    public static on<Type = any> (key: string, StorageCallback: StorageCallback<Type>): void {
        events.on(key, StorageCallback);
    }

    /**
     * Listen ONCE for changes persisted against key on other tabs
     * Triggers StorageCallback when a change occurs, passing the following arguments.
     *
     * value: the current value for key in local storage, parsed from the persisted JSON
     * old: the old value for key in local storage, parsed from the persisted JSON
     * url: the url for the tab where the modification came from
     *
     * @param key
     * @param StorageCallback
     */
    public static once<Type = any> (key: string, StorageCallback: StorageCallback<Type>): void {
        events.once(key, StorageCallback);
    }

    /**
     * Removes the key from local storage
     *
     * @param key
     */
    public static remove<Type = any> (key: string): void {
        const old = LocalStorage.get<Type>(key);

        localStorageAvailable ? ls.remove(key) : FileStorage.removeItem(key);

        events.emit(key, old, undefined, localStorageAvailable ? window.location.toString() : process.cwd());
    }

    /**
     * Sets the value for the key in local storage
     *
     * @param key
     * @param value
     */
    public static set<Type> (key: string, value: Type): void {
        const old = LocalStorage.get<Type>(key);

        localStorageAvailable ? ls.set<Type>(key, value) : FileStorage.setItem<Type>(key, value);

        events.emit(key, old, value, localStorageAvailable ? window.location.toString() : process.cwd());
    }

    /**
     * Sets the domain scope of the local storage on disk
     *
     * This prevents other applications using this library from stomping on the storage of others
     *
     * Note: For scope to apply, must be called before all other calls
     *
     * @param scope
     */
    public static domain (scope: string) {
        if (!localStorageAvailable) {
            FileStorage.domain(scope);
        }
    }
}

export { LocalStorage };
