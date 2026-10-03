const address = document.getElementById("address");
const homeSearch = document.getElementById("homeSearch");

const homePage = document.querySelector(".home-page");

const backButton = document.getElementById("back");
const forwardButton = document.getElementById("forward");
const reloadButton = document.getElementById("reload");
const homeButton = document.getElementById("home");

const bookmarkButton = document.getElementById("bookmark");
const newTabButton = document.getElementById("newTab");


// ==============================
// CONVERTIR TEXTO EN URL
// ==============================

function getURL(text) {

  text = text.trim();

  if (!text) {
    return null;
  }

  // URL completa
  if (
    text.startsWith("http://") ||
    text.startsWith("https://")
  ) {
    return text;
  }

  // Dirección web
  if (
    text.includes(".") &&
    !text.includes(" ")
  ) {
    return "https://" + text;
  }

  // Buscar en Google
  return "https://www.google.com/search?q=" +
    encodeURIComponent(text);
}


// ==============================
// NAVEGAR
// ==============================

function navigate(text) {

  const url = getURL(text);

  if (!url) {
    return;
  }

  address.value = url;

  updateTabTitle(url);

  // Abrir fuera de Nova
  window.open(url, "_blank");
}


// ==============================
// BARRA DE DIRECCIONES
// ==============================

address.addEventListener("keydown", function (event) {

  if (event.key === "Enter") {
    navigate(address.value);
  }

});


// ==============================
// BUSCADOR DE INICIO
// ==============================

homeSearch.addEventListener("keydown", function (event) {

  if (event.key === "Enter") {
    navigate(homeSearch.value);
  }

});


// ==============================
// ATAJOS
// ==============================

const shortcuts =
  document.querySelectorAll(".shortcuts button");

shortcuts.forEach(function (button) {

  button.addEventListener("click", function () {

    const url = button.dataset.url;

    navigate(url);

  });

});


// ==============================
// INICIO
// ==============================

homeButton.addEventListener("click", function () {

  address.value = "";
  homeSearch.value = "";

  homePage.style.display = "flex";

  document.querySelector(".tab-title").textContent =
    "Nueva pestaña";

});


// ==============================
// RECARGAR
// ==============================

reloadButton.addEventListener("click", function () {

  window.location.reload();

});


// ==============================
// ATRÁS
// ==============================

backButton.addEventListener("click", function () {

  window.history.back();

});


// ==============================
// ADELANTE
// ==============================

forwardButton.addEventListener("click", function () {

  window.history.forward();

});


// ==============================
// FAVORITOS
// ==============================

bookmarkButton.addEventListener("click", function () {

  if (!address.value) {
    return;
  }

  const favorites =
    JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

  if (!favorites.includes(address.value)) {

    favorites.push(address.value);

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );

    bookmarkButton.textContent = "★";

  } else {

    const index =
      favorites.indexOf(address.value);

    favorites.splice(index, 1);

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );

    bookmarkButton.textContent = "☆";
  }

});


// ==============================
// TÍTULO DE PESTAÑA
// ==============================

function updateTabTitle(url) {

  const tabTitle =
    document.querySelector(".tab-title");

  try {

    const domain =
      new URL(url).hostname;

    tabTitle.textContent =
      domain.replace("www.", "");

  } catch {

    tabTitle.textContent =
      "Nueva pestaña";

  }

}


// ==============================
// NUEVA PESTAÑA
// ==============================

newTabButton.addEventListener("click", function () {

  address.value = "";
  homeSearch.value = "";

  homePage.style.display = "flex";

  document.querySelector(".tab-title").textContent =
    "Nueva pestaña";

});
