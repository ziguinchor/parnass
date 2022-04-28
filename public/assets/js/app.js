import { router } from "./router.js";
import { request } from "./ajax.js";
import { flash, redirect, initDatePicker, initBtnIndicator } from "./util.js";
import { agentHandler } from "./agentHandler.js";
import { leadHandler } from "./leadHandler.js";
import { courseHandler } from "./courseHandler.js";
import { authHandler } from "./authHandler.js";
import { InitEmailSend, initCCSKeyCheck } from "./modalHandler.js";

const app = {
  init: () => {
    router.init();
    app.displayFlash();
    initDatePicker();
    initBtnIndicator();
    InitEmailSend();
    initCCSKeyCheck();
  },
  displayFlash() {
    flash();
  },
};

// Routes Registrations
router.use("agents", agentHandler);
router.use("leads", leadHandler);
router.use("courses", courseHandler);
router.use("auth", authHandler);

// Init App
document.addEventListener("DOMContentLoaded", app.init);
