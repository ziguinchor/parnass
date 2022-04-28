import { request } from "./ajax.js";
import { flash, redirect } from "./util.js";

/**
 * Lead Handler
 */
export const leadHandler = {
  load: () => {
    const handleLeadDelete = (e) => {
      e.preventDefault();
      request
        .delete(location.href)
        .then(({ message }) => {
          redirect(`/leads/`, ["success", message]);
        })
        .catch((err) => {
          console.dir(err);
          err.then(({ message }) => {
            flash("danger", message);
          });
        });
    };
    const handleLeadCreate = (e) => {
      e.preventDefault();
      request
        .post("/leads", leadCreateForm)
        .then(({ message, data }) => {
          redirect(`/leads/${data._id}`, ["success", message]);
        })
        .catch((err) => {
          console.dir(err);
          err.then(({ message }) => {
            flash("danger", message);
          });
        });
    };
    const handleLeadUpdate = (e) => {
      e.preventDefault();
      request
        .put(window.location.href, leadUpdateForm)
        .then(({ message, data }) => {
          flash("success", message);
        })
        .catch((err) => {
          err.then(({ message }) => {
            flash("danger", message);
          });
        });
    };
    const handleFinalBudgetCalc = () => {
      finalBudgetInput.value =
        budgetInput.value - discountInput.value || "Erreur";
    };
    const handleRecapCopy = () => {
      navigator.permissions
        .query({ name: "clipboard-write" })
        .then((result) => {
          if (result.state == "granted" || result.state == "prompt") {
            navigator.clipboard.writeText(recapText.innerText);
          }
        });
    };
    const leadCreateForm = document.querySelector("#lead-create-form");
    const leadUpdateForm = document.querySelector("#lead-update-form");
    const leadDeleteBtn = document.querySelector("#lead-delete-btn");
    const budgetInput = document.querySelector("#budget-input");
    const discountInput = document.querySelector("#discount-input");
    const finalBudgetInput = document.querySelector("#final-budget-input");
    const recapText = document.querySelector("#recap");
    const recapBtn = document.querySelector("#recap-btn");
    recapBtn?.addEventListener("click", handleRecapCopy);
    [budgetInput, discountInput].forEach((el) => {
      el?.addEventListener("keyup", handleFinalBudgetCalc);
    });
    // Submit new Lead
    leadCreateForm?.addEventListener("submit", handleLeadCreate);
    // Update Lead
    leadUpdateForm?.addEventListener("submit", handleLeadUpdate);
    // Delete Lead
    leadDeleteBtn?.addEventListener("click", handleLeadDelete);
  },
};
