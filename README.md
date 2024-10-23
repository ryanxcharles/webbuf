# WebBuf

This is a simple package that provides a `Buffer`-like interface for the
browser. It is implemented using `Uint8Array` and `TextEncoder`/`TextDecoder`.

Usage:

```javascript
import { WebBuf } from "webbuf";

const buf = WebBuf.from("Hello, world!");
console.log(buf.toString("utf8"));
```

