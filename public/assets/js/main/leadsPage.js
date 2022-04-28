"use strict";
import { formatDate } from "../util.js";
import { request } from "../ajax.js";

// Class definition
let leadsListing = (function () {
  // Shared variables
  let table;
  let datatable;
  let flatpickr;
  let minDate, maxDate;

  let searchQuery = {
    search: "",
    center: "",
    dateRange: "",
  };

  const serializeQueryString = function (params) {
    const serialized = Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");
    const downloadBtn = document.querySelector("#lead-download-btn");
    downloadBtn.href = `/leads/download/?${serialized}`;
    return serialized;
  };

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
        url: "/leads",
      },
      columns: [
        { data: "id" },
        {
          data: "contact",
          render: function (data, type, row) {
            return `<div class="d-flex flex-column">
                  <a href="/" class="text-gray-800 text-hover-primary mb-1">${row.contact}</a>
                  <span>${row.email}</span>
                </div>`;
          },
        },
        {
          data: "phone",
          render: function (data, type, row) {
            return `<a href="SIP:33${row.phone}" class="text-gray-800 text-hover-primary mb-1">${row.phone}</a>`;
          },
        },
        {
          data: "course",
          render: function (data, type, row) {
            return `<div class="d-flex flex-column">
            <a href="/courses/${row.course?._id}" class="text-gray-800 text-hover-primary mb-1">
              ${row.course.name}
            </a>
            <span>${row.center}</span>
          </div>`;
          },
        },
        {
          data: "agent",
          render: function (data, type, row) {
            return `<div class="d-flex flex-column">
                  <a href="/agents/${
                    row.agent._id
                  }" class="text-gray-800 text-hover-primary mb-1">${
              row.agent.name
            }</a>
                  <span>${formatDate(row.createdAt)}</span>
                </div>`;
          },
        },
        {
          data: "status",
          render: function (data, type, row) {
            if (data === "confirmed")
              return `<div class="badge badge-light-success fw-bolder">Confirmé</div>`;
            if (data === "cancelled")
              return `<div class="badge badge-light-danger fw-bolder">Annulé</div>`;
            if (data === "pending")
              return `<div class="badge badge-light-primary fw-bolder">En cours</div>`;
            else
              return `<div class="badge badge-light-primary fw-bolder">-</div>`;
          },
        },
        {
          data: "finalBudget",
          render: function (data, type, row) {
            return `${data} &euro;`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="/leads/${data._id}" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
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
        { sortable: false, targets: [0, 1, 2, 3, 4, 5, 6, 7] },
        { orderable: false, targets: [0, 1, 2, 3, 4, 5, 6, 7] },
        { searchable: false, targets: [0, 1, 2, 3, 4, 5, 6, 7] },
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

  // Init flatpickr --- more info :https://flatpickr.js.org/getting-started/
  let initFlatpickr = () => {
    const element = document.querySelector("#leads_flatpickr");
    flatpickr = $(element).flatpickr({
      altInput: true,
      altFormat: "d/m/Y",
      dateFormat: "d-m-Y",
      mode: "range",
      onChange: function (selectedDates, dateStr, instance) {
        handleFlatpickr(selectedDates, dateStr, instance);
      },
    });
  };

  // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
  let handleSearchDatatable = () => {
    const filterSearch = document.querySelector('[data-leads-filter="search"]');
    filterSearch.addEventListener("keyup", function (e) {
      searchQuery.search = e.target.value;
      datatable.search(serializeQueryString(searchQuery)).draw();
    });
  };

  // Handle status filter dropdown
  let handleStatusFilter = () => {
    const filterStatus = document.querySelector('[data-leads-filter="status"]');
    $(filterStatus).on("change", (e) => {
      let value = e.target.value;
      if (value === "all") {
        value = "";
      }
      searchQuery.status = value;

      datatable.search(serializeQueryString(searchQuery)).draw();
      datatable.column(3).search(value).draw();
    });
  };

  // Handle status filter dropdown
  let handleCenterFilter = () => {
    const filterStatus = document.querySelector('[data-leads-filter="center"]');
    $(filterStatus).on("change", (e) => {
      let value = e.target.value;
      if (value === "all") {
        value = "";
      }
      searchQuery.center = value;
      datatable.search(serializeQueryString(searchQuery)).draw();
    });
  };
  // Handle status filter dropdown
  let handleDateFilter = () => {
    const filterStatus = document.querySelector("#leads_flatpickr");
    $(filterStatus).on("change", (e) => {
      let value = e.target.value;
      if (value === "all") {
        value = "";
      }
      searchQuery.dateRange = value;

      datatable.search(serializeQueryString(searchQuery)).draw();
    });
  };

  // Handle flatpickr --- more info: https://flatpickr.js.org/events/
  let handleFlatpickr = (selectedDates, dateStr, instance) => {
    minDate = selectedDates[0] ? new Date(selectedDates[0]) : null;
    maxDate = selectedDates[1] ? new Date(selectedDates[1]) : null;

    // Datatable date filter --- more info: https://datatables.net/extensions/datetime/examples/integration/datatables.html
    // Custom filtering function which will search data in column four between two values
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
      let min = minDate;
      let max = maxDate;
      let dateAdded = new Date(moment($(data[5]).text(), "DD/MM/YYYY"));
      let dateModified = new Date(moment($(data[6]).text(), "DD/MM/YYYY"));

      if (
        (min === null && max === null) ||
        (min === null && max >= dateModified) ||
        (min <= dateAdded && max === null) ||
        (min <= dateAdded && max >= dateModified)
      ) {
        return true;
      }
      return false;
    });
    datatable.draw();
  };

  // Handle clear flatpickr
  let handleClearFlatpickr = () => {
    const clearButton = document.querySelector("#leads_flatpickr_clear");
    clearButton.addEventListener("click", (e) => {
      flatpickr.clear();
    });
  };

  // Public methods
  return {
    init: function () {
      table = document.querySelector("#leads-datatable");

      if (!table) {
        return;
      }

      initDatatable();
      initFlatpickr();
      handleSearchDatatable();
      handleStatusFilter();
      handleCenterFilter();
      handleDateFilter();
      // handleDeleteRows();
      handleClearFlatpickr();
    },
  };
})();

// On document ready
KTUtil.onDOMContentLoaded(function () {
  leadsListing.init();
});
