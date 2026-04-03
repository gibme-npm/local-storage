# @gibme/local-storage

A simple, universal local storage helper that uses the browser's [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) when available and falls back to file-based storage in the host's temporary directory for Node.js environments.

Storage is generally persistent across pages within a domain in the browser. In Node.js, data persists across application executions via the filesystem.

## Requirements

- Node.js >= 22

## Installation

```bash
yarn add @gibme/local-storage
```

or

```bash
npm install @gibme/local-storage
```

A webpack bundle (`local-storage.min.js`) is also published for direct browser use.

## Documentation

[https://gibme-npm.github.io/local-storage/](https://gibme-npm.github.io/local-storage/)

## Usage

### Basic Operations

```typescript
import LocalStorage from '@gibme/local-storage';

// Store a value
LocalStorage.set('user', { name: 'Alice', role: 'admin' });

// Check if a key exists
if (LocalStorage.includes('user')) {
    // Retrieve a value (with type inference)
    const user = LocalStorage.get<{ name: string; role: string }>('user');
    console.log(user?.name); // 'Alice'
}

// Remove a specific key
LocalStorage.remove('user');

// Clear all stored data
LocalStorage.clear();
```

### Domain Scoping

Isolate storage between different applications or modules to prevent key collisions. Must be called before any other storage operations.

```typescript
import LocalStorage from '@gibme/local-storage';

LocalStorage.domain('my-app');

// All subsequent operations are scoped to 'my-app'
LocalStorage.set('config', { debug: true });
```

### Change Listeners

Listen for changes to specific keys:

```typescript
import LocalStorage, { StorageCallback } from '@gibme/local-storage';

const onConfigChange: StorageCallback<{ debug: boolean }> = (oldValue, newValue, url) => {
    console.log('Config changed:', { oldValue, newValue, url });
};

// Subscribe to changes
LocalStorage.on('config', onConfigChange);

// Listen for a single change
LocalStorage.once('config', (oldValue, newValue) => {
    console.log('Config changed once');
});

// Unsubscribe
LocalStorage.off('config', onConfigChange);
```

### Custom Storage Path (Node.js only)

Override the default temporary directory location:

```typescript
import LocalStorage from '@gibme/local-storage';

LocalStorage.path = '/var/data/my-app-storage';
```

### Environment Detection

```typescript
import LocalStorage from '@gibme/local-storage';

if (LocalStorage.isBrowserLocalStorage) {
    console.log('Using browser localStorage');
} else {
    console.log('Using file-based storage at:', LocalStorage.path);
}
```

## API

| Method | Description |
|--------|-------------|
| `get<V>(key)` | Retrieve a value by key |
| `set<V>(key, value)` | Store a value |
| `includes(key)` | Check if a key exists |
| `remove(key)` | Remove a key |
| `clear()` | Remove all stored data |
| `on(key, callback)` | Listen for changes to a key |
| `once(key, callback)` | Listen for the next change to a key |
| `off(key, callback)` | Remove a change listener |
| `domain(scope)` | Set the storage scope (Node.js, call before other operations) |
| `path` | Get or set the file storage directory (Node.js only) |
| `id(key)` | Get the underlying SHA-512 hash for a key |
| `isBrowserLocalStorage` | Whether browser localStorage is in use |

## License

MIT
