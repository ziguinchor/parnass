import { request } from "./ajax.js";
import { flash, redirect } from "./util.js";

export const InitEmailSend = () => {
  const mailForm = document.querySelector("#mail-send-form");
  mailForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    request
      .post("/courses/send-mail", mailForm)
      .then(({ message, data }) => {
        flash("success", message);
      })
      .catch((err) => {
        console.dir(err);
        err.then(({ message }) => {
          flash("danger", message);
        });
      });
    mailForm.reset();
  });
};

export const initCCSKeyCheck = () => {
  function checkSsnKey(ssnum) {
    const ssn = String(ssnum);
    const root = ssn.slice(0, 13);
    const controlKey = Number(ssn.slice(13, 15));
    const computedKey = 97 - (Number(root) % 97);
    return controlKey === computedKey;
  }

  function getSsnKey(ssnum) {
    const root = ssnum.slice(0, 13);
    return 97 - (Number(root) % 97);
  }

  const FrenchDepartments = {
    _01: "Ain",
    _02: "Aisne",
    _03: "Allier",
    _04: "Alpes-de-Haute-Provence",
    _05: "Hautes-Alpes",
    _06: "Alpes-Maritimes",
    _07: "Ardèche",
    _08: "Ardennes",
    _09: "Ariège",
    _10: "Aube",
    _11: "Aude",
    _12: "Aveyron",
    _13: "Bouches-du-Rhône",
    _14: "Calvados",
    _15: "Cantal",
    _16: "Charente",
    _17: "Charente-Maritime",
    _18: "Cher",
    _19: "Corrèze",
    _2A: "Corse-du-Sud",
    _2B: "Haute-Corse",
    _21: "Côte-d'Or",
    _22: "Côtes-d'Armor",
    _23: "Creuse",
    _24: "Dordogne",
    _25: "Doubs",
    _26: "Drôme",
    _27: "Eure",
    _28: "Eure-et-Loir",
    _29: "Finistère",
    _30: "Gard",
    _31: "Haute-Garonne",
    _32: "Gers",
    _33: "Gironde",
    _34: "Hérault",
    _35: "Ille-et-Vilaine",
    _36: "Indre",
    _37: "Indre-et-Loire",
    _38: "Isère",
    _39: "Jura",
    _40: "Landes",
    _41: "Loir-et-Cher",
    _42: "Loire",
    _43: "Haute-Loire",
    _44: "Loire-Atlantique",
    _45: "Loiret",
    _46: "Lot",
    _47: "Lot-et-Garonne",
    _48: "Lozère",
    _49: "Maine-et-Loire",
    _50: "Manche",
    _51: "Marne",
    _52: "Haute-Marne",
    _53: "Mayenne",
    _54: "Meurthe-et-Moselle",
    _55: "Meuse",
    _56: "Morbihan",
    _57: "Moselle",
    _58: "Nièvre",
    _59: "Nord",
    _60: "Oise",
    _61: "Orne",
    _62: "Pas-de-Calais",
    _63: "Puy-de-Dôme",
    _64: "Pyrénées-Atlantiques",
    _65: "Hautes-Pyrénées",
    _66: "Pyrénées-Orientales",
    _67: "Bas-Rhin",
    _68: "Haut-Rhin",
    _69: "Rhône",
    _70: "Haute-Saône",
    _71: "Saône-et-Loire",
    _72: "Sarthe",
    _73: "Savoie",
    _74: "Haute-Savoie",
    _75: "Paris",
    _76: "Seine-Maritime",
    _77: "Seine-et-Marne",
    _78: "Yvelines",
    _79: "Deux-Sèvres",
    _80: "Somme",
    _81: "Tarn",
    _82: "Tarn-et-Garonne",
    _83: "Var",
    _84: "Vaucluse",
    _85: "Vendée",
    _86: "Vienne",
    _87: "Haute-Vienne",
    _88: "Vosges",
    _89: "Yonne",
    _90: "Territoire de Belfort",
    _91: "Essonne",
    _92: "Hauts-de-Seine",
    _93: "Seine-Saint-Denis",
    _94: "Val-de-Marne",
    _95: "Val-d'Oise",
    _971: "Guadeloupe",
    _972: "Martinique",
    _973: "Guyane",
    _974: "La Réunion",
    _975: "Saint-Pierre-et-Miquelon",
    _976: "Mayotte",
    _977: "Saint-Barthélemy",
    _978: "Saint-Martin",
    _986: "Wallis-et-Futuna",
    _987: "Polynésie française",
    _988: "Nouvelle-Calédonie",
    _989: "Île de Clippertoon",
  };

  const ssnBtn = document.querySelector(".ssn-btn");
  const ssnCalcContainer = document.querySelector("#ccs-key-modal");
  const ssnForm = document.querySelector("#ssn-form");
  const ssnCheckResContainer = ssnCalcContainer.querySelector(".ssn-result");
  ssnForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const ssn = ssnForm
      .querySelector("#code")
      .value.replaceAll("/", "")
      .replaceAll(" ", "");

    try {
      if (ssn.length !== 13)
        throw new Error("Veuiller Saisir un Numéro valide de 13 chiffres");

      const ssnKey = getSsnKey(ssn);
      if (!ssnKey) throw new Error("Le Numero fournit n'est pas valide!");

      const sexe =
        ssn.slice(0, 1) === "1"
          ? "Homme"
          : ssn.slice(0, 1) === "2"
          ? "Femme"
          : ssn.slice(0, 1) === "8"
          ? "[Temporaire]"
          : "Incorrect";

      const birthYear = "19" + ssn.slice(1, 3);
      const birthMonth =
        +ssn.slice(3, 5) >= 20
          ? "Etat civil incomplet"
          : [
              "Janvier",
              "Fevrier",
              "Mars",
              "Avril",
              "Mai",
              "Juin",
              "Juillet",
              "Aout",
              "September",
              "Octobre",
              "Novembre",
              "Décombre",
              "Inconnu",
              "Inconnu",
              "Inconnu",
              "Inconnu",
              "Inconnu",
              "Inconnu",
              "Inconnu",
              "Inconnu",
              "Inconnu",
            ][+ssn.slice(3, 5) - 1];
      const birthDep = FrenchDepartments["_" + ssn.slice(5, 7)] || "Etranger";
      const birthComCode = ssn.slice(7, 10);

      ssnCheckResContainer.innerHTML = "";
      ssnCheckResContainer.setAttribute("class", "alert alert-info ssn-info");

      let html = `Le numéro de sécurité sociale ${ssn} est bien formé.`;
      html += `<br>${sexe} né(e) en ${birthMonth} ${birthYear} / Département ${birthDep} `;
      html += `<br> Clé de Controle : <b>${ssnKey}</b>`;

      ssnCheckResContainer.insertAdjacentHTML("beforeend", html);

      ssnForm.reset();
    } catch (e) {
      ssnCheckResContainer.setAttribute(
        "class",
        "alert alert-danger ssn-result"
      );
      ssnCheckResContainer.innerText = e.message;
    }
  });
};
