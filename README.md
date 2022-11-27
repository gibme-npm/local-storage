# Simple Local Storage Helper

Static wrapper around a browser's [localStorage](https://www.w3schools.com/html/html5_webstorage.asp) that
falls back to File based storage in the host's temporary directory.

Such storage is [*generally*](https://www.npmjs.com/package/local-storage#api) persistent across pages within a domain; and, if file based, across application executions.

## Documentation

[https://gibme-npm.github.io/local-storage/](https://gibme-npm.github.io/local-storage/)

## Sample Code

```typescript
import LocalStorage from '@gibme/local-storage';

LocalStorage.set('somekey', 'somevalue');

if (LocalStorage.has('somekey')) {
    console.log(LocalStorage.get<string>('somekey'));
    
    LocalStorage.remove('somekey');
}
```
