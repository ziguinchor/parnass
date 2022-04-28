export const request = {
  // formData to JSON
  toJson: (formData) => {
    const object = {};
    formData.forEach((value, key) => {
      object[key] = key.toLowerCase().includes("date")
        ? value.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
        : value;
    });

    return JSON.stringify(object);
  },
  // HTTP Error Handling
  isOk: (response) =>
    response.ok ? response.json() : Promise.reject(response.json()),

  // Get Request
  get: (url) => {
    return fetch(url, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "Application/json",
      }),
    }).then(request.isOk);
  },

  // Send POST Request
  post: (url, formEl) => {
    const formData = new FormData(formEl);
    return fetch(url, {
      method: "POST",
      body: request.toJson(formData), // a FormData will automatically set the 'Content-Type'
      headers: new Headers({
        "Content-Type": "Application/json",
        Accept: "Application/json",
      }),
    }).then(request.isOk);
    // .then((data) => console.log(data));
  },
  // Send PUT Request
  put: (url, formEl) => {
    const formData = new FormData(formEl);
    return fetch(url, {
      method: "PUT",
      body: request.toJson(formData), // a FormData will automatically set the 'Content-Type'
      headers: new Headers({
        "Content-Type": "Application/json",
        Accept: "Application/json",
      }),
    }).then(request.isOk);
  },
  // Send DELETE  Request
  delete: (url, formEl) => {
    if (confirm("Etes vous sur de vouloir supprimer?")) {
      return fetch(url, {
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "Application/json",
        }),
      }).then(request.isOk);
    }
  },
};
