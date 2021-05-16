# aki-plugin-manager

![npm](https://img.shields.io/npm/v/aki-plugin-manager?style=flat-square)

Aki is a fast, lightweight plugin manager for Node.js applications. It
supports finding, downloading, and loading packages dynamically at runtime.

Aki currently only retrieves packages from npm, although alternative
sources may be added in the future.

## Usage

#### Install a package

```js
install = (
  name: string,    // package name on npm
  version: string, // package version, e.g. "1.2.3" or "latest"
  baseDir: string, // directory to save plugins
  callback: (error?: Error) => void // called after installation
)
```

```js
import aki from "aki-plugin-manager";

const dir = path.join(process.env.XDG_CONFIG_HOME, "myapp", "plugins");
aki.install("is-number", "latest", dir, () => console.log("installed!"));
```

#### List installed packages

```js
list = (
  baseDir: string     // directory where plugins are saved
): [string, string][] // installed packages as [name, version]
```

```js
import aki from "aki-plugin-manager";

const dir = path.join(process.env.XDG_CONFIG_HOME, "myapp", "plugins");
aki.list(dir); // [["is-number", "7.0.0"]]
```

#### Load installed package

```js
load = (
  baseDir: string,    // directory where plugins are saved
  name: string,       // name of package to load
  requireFn = require // (optional) specify a require function
)
```

```js
import aki from "aki-plugin-manager";

const dir = path.join(process.env.XDG_CONFIG_HOME, "myapp", "plugins");
const mymod = aki.load(dir, "mypackage");
mymod.sayHi();
```

**Note:** Specifying a require function may be necessary if you are using
webpack, or if you want to load a plugin in Electron's renderer thread.
See the [Webpack Usage](#Webpack-Usage) and
[Electron Usage](#Electron-Usage) sections.

#### Searching for packages

```js
search = (
  {
    text = "", // (optional) text to search for
    scope = "" // (optional) registry to use
  }
): Promise<RegistrySearchResults>
```

```js
import aki from "aki-plugin-manager";

aki.search({ text: "foo" }).then((results: RegistrySearchResults) => {
  if (results.total > 0) {
    console.log(results.objects[0].package.name);
  }
});
```

#### Unload package

```js
load = (
  baseDir: string,    // directory where plugins are saved
  name: string,       // name of loaded package
  requireFn = require // (optional) specify a require function
)
```

```js
import aki from "aki-plugin-manager";

const dir = path.join(process.env.XDG_CONFIG_HOME, "myapp", "plugins");

const mymod = aki.load(dir, "mypackage");
mymod.sayHi();
aki.unload(dir, "mypackage");
```

#### Uninstall package

```js
uninstall = (
  name: string,    // name of installed package
  baseDir: string, // directory where plugins are saved
  callback: () => void // called after uninstallation
)
```

```js
import aki from "aki-plugin-manager";

const dir = path.join(process.env.XDG_CONFIG_HOME, "myapp", "plugins");
aki.uninstall("is-number", dir, () => console.log("uninstalled!"));
```

## With Other Tools

### Webpack Usage

Webpack attempts to rewrite `require` statements at compile time, which means
that if you try to load a plugin with a name or directory set at runtime,
you will likely get a "module not found" error even if it is referencing
the correct path.

To get around this, we need to keep webpack from attempting to rewrite
the require function. The easiest way, although not best-practice,
is with exec:

```js
aki.load(dir, "mypackage", exec("require"));
```

Alternatively, depending on your module system, you may be able to use:

```js
aki.load(dir, "mypackage", module[`require`].bind(module));
```

You may also be able to update your webpack config. Add
[IgnorePlugin](https://webpack.js.org/plugins/ignore-plugin/) to specify a
regex pattern for which webpack won't rewrite the `require` call.

### Electron Usage

The recommended way to use Aki with Electron is by performing all
actions in the main thread and communicating input/output through ipc.
You can create
[ipcMain handlers](https://www.electronjs.org/docs/api/ipc-main)
in the main thread to accomplish this.

You _might_ also be able to pass `remote.require` as the requireFn for
`aki.load`. This is very discouraged, particularly because `remote` is
deprecated and you will likely have issues resolving plugin functions.

## Testing

```bash
npm run test
```

## License

[MIT License](https://github.com/xgi/aki-plugin-manager/blob/master/LICENSE)
