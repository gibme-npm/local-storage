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

import { resolve } from 'path';
import { tmpdir } from 'os';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';

/** @ignore */
let localStoragePath = (() => {
    const path = resolve(`${tmpdir()}/localstorage`);

    if (!existsSync(path)) {
        mkdirSync(path);
    }

    return path;
})();

/** @ignore */
let baseLocalStoragePath = localStoragePath;

/** @ignore */
const digest = (key: string): string => {
    return createHash('sha512')
        .update(key)
        .digest('hex');
};

export default abstract class FileStorage {
    /**
     * Retrieves the file storage path
     *
     * @private
     */
    public static get path (): string {
        return localStoragePath;
    }

    /**
     * Sets the file storage path
     *
     * @param value
     * @private
     */
    public static set path (value: string) {
        localStoragePath = resolve(value);

        if (!existsSync(localStoragePath)) {
            mkdirSync(localStoragePath);
        }

        baseLocalStoragePath = localStoragePath;
    }

    /**
     * Retrieves the underlying key ID for the specified key
     *
     * @param key
     */
    public static id (key: string): string {
        return digest(key);
    }

    /**
     * Retrieves an item from file storage
     *
     * @param key
     * @param noThrow
     */
    public static getItem<Type> (key: string, noThrow = true): Type | undefined {
        try {
            const data = readFileSync(resolve(`${localStoragePath}/${digest(key)}`));

            return JSON.parse(data.toString());
        } catch (error: any) {
            if (!noThrow) {
                throw error;
            }
        }
    }

    /**
     * Sets the scope of the local storage on disk
     *
     * This prevents other applications using this library from stomping on the storage of others
     *
     * Note: For scope to apply, must be called before all other calls
     *
     * @param scope
     */
    public static domain (scope: string) {
        localStoragePath = resolve(`${baseLocalStoragePath}/${scope}`);

        if (!existsSync(localStoragePath)) {
            mkdirSync(localStoragePath);
        }
    }

    /**
     * Sets an item in file storage
     *
     * @param key
     * @param value
     */
    public static setItem<Type> (key: string, value: Type): void {
        if (!existsSync(localStoragePath)) {
            mkdirSync(localStoragePath);
        }

        writeFileSync(
            resolve(`${localStoragePath}/${digest(key)}`),
            JSON.stringify(value, undefined, 4));
    }

    /**
     * Removes an item from file storage
     *
     * @param key
     */
    public static removeItem (key: string): void {
        if (existsSync(resolve(`${localStoragePath}/${digest(key)}`))) {
            rmSync(resolve(`${localStoragePath}/${digest(key)}`));
        }
    }

    /**
     * Clears the file storage
     */
    public static clear (): void {
        if (existsSync(localStoragePath)) {
            rmSync(localStoragePath, { recursive: true });
        }

        mkdirSync(localStoragePath);
    }
}
