"use strict";

// Class definition
let courseListing = (function () {
  // Shared variables
  let table;
  let datatable;

  // Private functions
  let initDatatable = function () {
    // Init datatable --- more info on datatables: https://datatables.net/manual/
    datatable = $(table).DataTable({
      searchDelay: 500,
      processing: true,
      serverSide: true,
      order: [[5, "desc"]],
      stateSave: false,
      select: {
        style: "multi",
        selector: 'td:first-child input[type="checkbox"]',
        className: "row-selected",
      },
      ajax: {
        url: "/courses",
      },
      columns: [
        { data: "id" },
        {
          data: "name",
        },
        {
          data: "center",
        },
        {
          data: "budget",
          render: function (data, type, row) {
            return row.budget + " €";
          },
        },
        {
          data: "urlStatus",
          render: function (data, type, row) {
            if (data === "success")
              return `<div class="badge badge-light-success fw-bolder">Succès</div>`;
            else if (data === "failed")
              return `<div class="badge badge-light-danger fw-bolder">Echoué</div>`;
            else if (data === "error")
              return `<div class="badge badge-light-warning fw-bolder"> Erreur </div>`;
            if (data === "unchecked")
              return `<div class="badge badge-light-primary fw-bolder">En cours</div>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="/courses/${data._id}" data-course-url="${data.url}" class="course-send-button btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"  data-bs-toggle='modal' data-bs-target='#course-send-modal'>
            <span class="svg-icon svg-icon-3">
																	<svg data-course-url="${data.url}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
																		<path data-course-url="${data.url}" d="M15.43 8.56949L10.744 15.1395C10.6422 15.282 10.5804 15.4492 10.5651 15.6236C10.5498 15.7981 10.5815 15.9734 10.657 16.1315L13.194 21.4425C13.2737 21.6097 13.3991 21.751 13.5557 21.8499C13.7123 21.9488 13.8938 22.0014 14.079 22.0015H14.117C14.3087 21.9941 14.4941 21.9307 14.6502 21.8191C14.8062 21.7075 14.9261 21.5526 14.995 21.3735L21.933 3.33649C22.0011 3.15918 22.0164 2.96594 21.977 2.78013C21.9376 2.59432 21.8452 2.4239 21.711 2.28949L15.43 8.56949Z" fill="black"></path>
																		<path data-course-url="${data.url}" opacity="0.3" d="M20.664 2.06648L2.62602 9.00148C2.44768 9.07085 2.29348 9.19082 2.1824 9.34663C2.07131 9.50244 2.00818 9.68731 2.00074 9.87853C1.99331 10.0697 2.04189 10.259 2.14054 10.4229C2.23919 10.5869 2.38359 10.7185 2.55601 10.8015L7.86601 13.3365C8.02383 13.4126 8.19925 13.4448 8.37382 13.4297C8.54839 13.4145 8.71565 13.3526 8.85801 13.2505L15.43 8.56548L21.711 2.28448C21.5762 2.15096 21.4055 2.05932 21.2198 2.02064C21.034 1.98196 20.8409 1.99788 20.664 2.06648Z" fill="black"></path>
																	</svg>
																</span>

                                </a>
                                <a href="/courses/${data._id}" data-course-id="${data._id}" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 course-send-btn">
            <span class="svg-icon svg-icon-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="black"></path>
                <path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="black"></path>
              </svg>
            </span>
          </a>`;
          },
        },
      ],
      columnDefs: [
        { orderable: false, targets: [0, 1, 2, 3, 4, 5] },
        { orderable: false, targets: [0, 1, 2, 3, 4, 5] },
        {
          targets: 0,
          orderable: false,
          render: function (data) {
            return `
                            <div class="form-check form-check-sm form-check-custom form-check-solid">
                                <input class="form-check-input" type="checkbox" value="${data}" />
                            </div>`;
          },
        },
      ],
    });

    // Re-init functions on datatable re-draws
    datatable.on("draw", function () {
      // handleDeleteRows();
    });
  };

  // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
  let handleSearchDatatable = () => {
    const filterSearch = document.querySelector(
      '[data-courses-filter="search"]'
    );
    filterSearch.addEventListener("keyup", function (e) {
      datatable.search(e.target.value).draw();
    });
  };

  // Public methods
  return {
    init: function () {
      table = document.querySelector("#courses-datatable");

      if (!table) {
        return;
      }
      initDatatable();
      handleSearchDatatable();
    },
  };
})();

// On document ready
KTUtil.onDOMContentLoaded(function () {
  courseListing.init();
});
