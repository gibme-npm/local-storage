// Copyright (c) 2021-2025, Brandon Lehmann <brandonlehmann@gmail.com>
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

import assert from 'assert';
import { describe, it, before, after } from 'mocha';
import LocalStorage from '../src';

describe('Local Storage Tests', () => {
    const key = 'test_key';
    const value = { value: true, value1: 9, value3: 9.4, value4: 'test' };

    before(() => {
        LocalStorage.domain('unit-tests');
        LocalStorage.clear();
        LocalStorage.set('test', 1);
    });

    after(() => {
        LocalStorage.set('unit_tests', true);
    });

    it('Path', function () {
        if (LocalStorage.isBrowserLocalStorage) {
            return this.skip();
        }

        assert.notEqual(LocalStorage.path, undefined);
    });

    it('Id', () => {
        const id = LocalStorage.id(key);

        if (LocalStorage.isBrowserLocalStorage) {
            assert.equal(id, key);
        } else {
            assert.notEqual(id, key);
        }
    });

    it('Set', () => {
        LocalStorage.set(key, value);

        assert.equal(LocalStorage.includes(key), true);
    });

    it('Get', () => {
        const data = LocalStorage.get(key);

        assert.deepEqual(data, value);
    });

    it('Remove', () => {
        LocalStorage.remove('test');

        assert.equal(LocalStorage.includes('test'), false);
    });

    it('Clear', () => {
        LocalStorage.clear();

        assert.equal(LocalStorage.includes(key), false);
    });
});
