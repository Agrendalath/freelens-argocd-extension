import { TextDecoder, TextEncoder } from "node:util";
import "@testing-library/jest-dom";

Object.assign(globalThis, { TextDecoder, TextEncoder });

if (!global.MobxReact) {
  global.MobxReact = {
    observer: (component: any) => component,
  } as any;
}
