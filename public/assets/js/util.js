export const flash = (type, message) => {
  // Register a Flash message
  if (type)
    localStorage.setItem(
      "flash",
      JSON.stringify({
        type: type,
        message: message,
      })
    );
  // Display Flash message if exists
  if (localStorage.getItem("flash")) {
    const { message, type } = JSON.parse(localStorage.getItem("flash"));
    const flashContainer = document.querySelector("#flash-container");
    flashContainer.classList.remove("d-none");
    flashContainer.setAttribute(
      "class",
      `alert alert-${type} d-flex align-items-center p-5 mb-10`
    );
    setTimeout(() => {
      flashContainer.classList.add("fade");
      setTimeout(() => {
        flashContainer.classList.add("d-none");
      }, 500);
    }, 4000);
    flashContainer.querySelector(".flash-message").innerText = message;
    flashContainer
      .querySelector(".svg-icon")
      .setAttribute("class", `svg-icon svg-icon-2hx svg-icon-${type} me-4`);
    flashContainer.querySelector(".flash-title").innerText =
      type === "success" ? "Succés" : "Erreur";
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Destroy Flash Message after displaying
    localStorage.removeItem("flash");
  }
};

export const redirect = (location, flashMessage = undefined) => {
  localStorage.setItem(
    "flash",
    JSON.stringify({
      type: flashMessage[0],
      message: flashMessage[1],
    })
  );
  window.location.href = location;
};

export const initDatePicker = () => {
  const elements = document.querySelectorAll("[type='date']");
  [...elements].forEach((element) => {
    flatpickr = $(element).flatpickr({
      altInput: true,
      altFormat: "d/m/Y",
      dateFormat: "d-m-Y",
    });
  });
};

export const initBtnIndicator = () => {
  let submitBtn = document.querySelector("#btn-submit");
  submitBtn?.addEventListener("click", function () {
    submitBtn.setAttribute("data-kt-indicator", "on");
    setTimeout(function () {
      submitBtn.removeAttribute("data-kt-indicator");
    }, 3000);
  });
};

export const formatDate = (dt) => {
  const formattedDate = new Date(dt)
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
    .replace(/\//g, "-");
  return formattedDate;
};
