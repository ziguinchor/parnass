import { request } from "./ajax.js";
import { flash, redirect } from "./util.js";

/**
 * Agent Handler
 */
export const agentHandler = {
  load: () => {
    const handleAgentDelete = (e) => {
      e.preventDefault();
      request
        .delete(location.href)
        .then(({ message }) => {
          redirect(`/agents/`, ["success", message]);
        })
        .catch((err) => {
          console.dir(err);
          err.then(({ message }) => {
            flash("danger", message);
          });
        });
    };
    const handleAgentCreate = (e) => {
      e.preventDefault();
      request
        .post("/agents", agentCreateForm)
        .then(({ message, data }) => {
          redirect(`/agents/${data._id}`, ["success", message]);
        })
        .catch((err) => {
          console.dir(err);
          err.then(({ message }) => {
            flash("danger", message);
          });
        });
    };
    const handleAgentUpdate = (e) => {
      e.preventDefault();
      request
        .put(window.location.href, agentUpdateForm)
        .then(({ message, data }) =>
          redirect(`/agents/${data._id}`, ["success", message])
        )
        .catch((err) => {
          err.then(({ message }) => {
            flash("danger", message);
          });
        });
    };
    const agentCreateForm = document.querySelector("#agent-create-form");
    const agentUpdateForm = document.querySelector("#agent-update-form");
    const agentDeleteBtn = document.querySelector("#agent-delete-btn");
    // Submit new Agent
    agentCreateForm?.addEventListener("submit", handleAgentCreate);
    // Update Agent
    agentUpdateForm?.addEventListener("submit", handleAgentUpdate);
    // Delete Agent
    agentDeleteBtn?.addEventListener("click", handleAgentDelete);
  },
};
