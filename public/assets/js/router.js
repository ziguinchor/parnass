export const router = {
  baseUrl: "https://localhost:3000",

  // Router init
  init: () => {
    // ...
    router.load();
  },
  // Routes data
  routes: {},
  // Register Routes
  use: (path, handler) => {
    router.routes[path] = handler;
  },
  // Router
  load: () => {
    let page = document.body.id;
    if (!router.routes[page]) return;
    router.routes[page].load();
  },
};
