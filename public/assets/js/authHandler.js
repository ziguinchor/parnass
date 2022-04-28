import { request } from "./ajax.js";
import { flash, redirect } from "./util.js";

/**
 * Lead Handler
 */
export const authHandler = {
  load: () => {
    const handleLogin = (e) => {
      e.preventDefault();
      request
        .post(window.location.href, loginForm)
        .then(({ message, data }) => {
          flash("success", message);
          setTimeout(() => {
            location.href = "/dashboard";
          }, 2000);
        })
        .catch((err) => {
          err.then(({ message }) => {
            flash("danger", message);
          });
        });
    };
    const loginForm = document.querySelector("#login-form");
    loginForm.addEventListener("submit", handleLogin);
  },
};
