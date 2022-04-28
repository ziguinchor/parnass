"use strict";
import { request } from "../ajax.js";
import { flash, redirect } from "../util.js";
// Class definition
let stats = null;
let KTWidgets = (function () {
  let initRevenueChart = function () {
    let element = document.getElementById("monthly-revenue-chart");
    let height = parseInt(KTUtil.css(element, "height"));
    let labelColor = KTUtil.getCssVariableValue("--bs-gray-500");
    let borderColor = KTUtil.getCssVariableValue("--bs-gray-200");
    let baseColor = KTUtil.getCssVariableValue("--bs-warning");
    let secondaryColor = KTUtil.getCssVariableValue("--bs-gray-300");

    if (!element) {
      return;
    }

    let options = {
      series: [
        {
          name: "Rendez-vous confirmés",
          data: stats.dailyConfirmedLeads.map((stat) => stat.data.totalBudget),
        },
        {
          name: "Rendez-vous Annulés",
          data: stats.dailyCancelledLeads.map((stat) => stat.data.totalBudget),
        },
      ],
      chart: {
        fontFamily: "inherit",
        type: "bar",
        height: height,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: ["60%"],
          borderRadius: 4,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["transparent"],
      },
      xaxis: {
        categories: stats.dailyConfirmedLeads.map((stat) => stat.day),
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: "12px",
          },
        },
      },
      fill: {
        opacity: 1,
      },
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        hover: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "none",
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: "12px",
        },
        y: {
          formatter: function (val) {
            return val + "€";
          },
        },
      },
      colors: [baseColor, secondaryColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
    };

    let chart = new ApexCharts(element, options);
    chart.render();
  };

  let initConversionRateChart = function () {
    var options = {
      series: stats.conversionRate.series,
      labels: stats.conversionRate.labels,
      colors: [
        KTUtil.getCssVariableValue("--bs-success"),
        KTUtil.getCssVariableValue("--bs-danger"),
      ],
      chart: {
        type: "pie",
      },
      stroke: {
        colors: ["#fff"],
      },
      fill: {
        opacity: 1,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };

    var chart = new ApexCharts(
      document.querySelector("#conversion-rate-chart"),
      options
    );
    chart.render();
  };

  let initRevenuePerCenter = function () {
    var options = {
      series: stats.revPerCenter.series,
      chart: {
        type: "pie",
      },
      labels: stats.revPerCenter.labels,
      fill: {
        opacity: 1,
      },
      stroke: {
        width: 1,
        colors: undefined,
      },
      yaxis: {
        show: false,
      },
      legend: {
        position: "bottom",
      },
      plotOptions: {
        polarArea: {
          rings: {
            strokeWidth: 0,
          },
          spokes: {
            strokeWidth: 0,
          },
        },
      },
      theme: {
        monochrome: {
          enabled: true,
          shadeTo: "light",
          shadeIntensity: 0.6,
        },
      },
    };
    var chart = new ApexCharts(
      document.querySelector("#revenue-per-center-chart"),
      options
    );
    chart.render();
  };

  // Public methods
  return {
    init: function () {
      request
        .get("/dashboard/stats")
        .then((data) => {
          stats = data;
          initRevenueChart();
          initConversionRateChart();
          initRevenuePerCenter();
        })
        .catch((err) => {
          console.dir(err);
          flash("danger", err);
          // err.then(({ message }) => {
          //   flash("danger", message);
          // });
        });
    },
  };
})();

// Webpack support
if (typeof module !== "undefined") {
  module.exports = KTWidgets;
}

// On document ready
KTUtil.onDOMContentLoaded(function () {
  KTWidgets.init();
});
