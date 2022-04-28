module.exports.breadCrumbs = (resourceName) => {
  const routeNames = {
    edit: "Détails",
    create: "Nouveau",
    create: "Nouveau",
  };
  return {
    page: routeName["resourceName"],
    parent: resourceName,
  };
};

module.exports.formatDate = (dt) => {
  const isValid = isValidDate(dt);
  if (isValid) {
    const formattedDate = dt
      .toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
      .replace(/\//g, "-");
    return formattedDate;
  }
  return null;
};

const isValidDate = (date) => {
  return (
    date &&
    Object.prototype.toString.call(date) === "[object Date]" &&
    !isNaN(date)
  );
};

module.exports.CurrMonthRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const daysCount = new Date(year, month + 1, 0).getDate();

  const start = new Date(year, month, 1);
  const end = new Date(year, month, daysCount);
  const today = new Date(year, month, date + 1);

  return {
    start,
    end,
    today,
  };
};
