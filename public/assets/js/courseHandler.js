import { request } from "./ajax.js";
import { flash, redirect } from "./util.js";
/**
 * Agent Handler
 */
export const courseHandler = {
  load: () => {
    const handleCourseDelete = (e) => {
      e.preventDefault();
      request
        .delete(location.href)
        .then(({ message }) => {
          redirect(`/courses/`, ["success", message]);
        })
        .catch((err) => {
          err.then(({ message }) => {
            flash("danger", message);
          });
        });
    };
    const handleCourseCreate = (e) => {
      e.preventDefault();
      request
        .post("/courses", courseCreateForm)
        .then(({ message, data }) => {
          redirect(`/courses/${data._id}`, ["success", message]);
        })
        .catch((err) => {
          console.dir(err);
          err.then(({ message }) => {
            flash("danger", message);
          });
        });
    };
    const handleCourseUpdate = (e) => {
      e.preventDefault();
      request
        .put(window.location.href, courseUpdateForm)
        .then(({ message, data }) => flash("success", message))
        .catch((err) => {
          // console.dir(err);
          err.then(({ message }) => {
            flash("danger", message);
          });
        });
    };
    const handleCourseSend = (e) => {
      e.preventDefault();
      request
        .post("/courses/send-course", courseSendForm)
        .then(({ message, data }) => {
          flash("success", message);
        })
        .catch((err) => {
          err.then(({ message }) => {
            flash("danger", message);
          });
        });
      courseSendForm.reset();
    };

    const courseDataTable = document.querySelector("#courses-datatable");
    const courseCreateForm = document.querySelector("#course-create-form");
    const courseUpdateForm = document.querySelector("#course-update-form");
    const courseDeleteBtn = document.querySelector("#course-delete-btn");
    // const courseSendBtn = document.querySelector(".course-send-btn");
    const courseSendForm = document.querySelector("#course-send-form");
    const courseSendModalInput = document.querySelector(
      "#course-send-form [name='url']"
    );

    // Submit new course
    courseCreateForm?.addEventListener("submit", handleCourseCreate);
    // Update Agent
    courseUpdateForm?.addEventListener("submit", handleCourseUpdate);
    // Delete Agent
    courseDeleteBtn?.addEventListener("click", handleCourseDelete);
    // Send Course Button
    courseSendForm?.addEventListener("submit", handleCourseSend);
    // Delegating Rest of Events
    courseDataTable?.addEventListener("click", async (e) => {
      if (e.target.hasAttribute("data-course-url")) {
        const id = e.target.dataset.courseUrl;
        courseSendModalInput.value = id;
      }
    });
    //
  },
};
