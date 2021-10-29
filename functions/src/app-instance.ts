import admin = require("firebase-admin");

const APP_KEY = Symbol.for("lists.cloud-functions.app");

const globalSymbols = Object.getOwnPropertySymbols(global);
const hasAppInstance = globalSymbols.includes(APP_KEY);

type globalType = typeof globalThis & {
    [APP_KEY]: admin.app.App
}

if (!hasAppInstance) {
  (global as globalType)[APP_KEY] = admin.initializeApp();
}
type singletonType = {
    app: admin.app.App
}
const singleton= {};

Object.defineProperty(singleton, "app", {
  get: function() {
    return (global as globalType)[APP_KEY];
  },
});

Object.freeze(singleton);

const getApp = (): admin.app.App => {
  return (singleton as singletonType).app;
};

export {
  getApp,
};
