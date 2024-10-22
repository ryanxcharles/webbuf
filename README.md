# WebBuf

WebBuf is a fork of the NPM package [`buffer`](https://github.com/feross/buffer)
with a different name. The purpose is to prohibit use of the global `Buffer`
object throughout your code base for any code wants to use the `buffer` package
in the browser and wants to ensure that the global `Buffer` object is not used.
Also, it uses ES Modules instead of CommonJS.

Usage:

```javascript
import { WebBuf } from "webbuf";

const buf = WebBuf.from("Hello, world!");
console.log(buf.toString("utf8"));
```

The interface, of course, is the same as the `buffer` package.
