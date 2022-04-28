const config = require("config");

module.exports = (req, res, next) => {
  const accept = req.accepts(["html", "json"]);
  if (accept === "html") {
    const paths = {
      leads: "Rendez-vous",
      agents: "Agents",
      settings: "Parametres",
      dashboard: "Tableau de Bord",
      courses: "Catalogue",
      catalog: "Catalogue",
      customer: "Clients",
    };
    const action = {
      create: "Nouveau",
      details: "Détails",
      index: "Parcourir",
    };
    res.locals.breadCrumbs = {
      parent: "",
      parentUrl: "",
      sub: "",
    };
    const parts = req.path.split("/");
    if (parts.length) {
      res.locals.breadCrumbs = {
        parentUrl: `/${parts[1]}`,
        parent: paths[parts[1]] || config.get("appName"),
        sub: action[parts[2]] || "",
      };
    } else {
      res.locals.breadCrumbs = {
        parent: "Paneau d'administration",
      };
    }
  }
  next();
};
