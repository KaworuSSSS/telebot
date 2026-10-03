const address = document.getElementById("address");
const homeSearch = document.getElementById("homeSearch");

const homePage = document.querySelector(".home-page");
const webview = document.getElementById("webview");

const backButton = document.getElementById("back");
const forwardButton = document.getElementById("forward");
const reloadButton = document.getElementById("reload");
const homeButton = document.getElementById("home");

const bookmarkButton = document.getElementById("bookmark");
const newTabButton = document.getElementById("newTab");

const shortcuts = document.querySelectorAll(".shortcuts button");


// Convertir lo escrito en una URL
function getURL(text) {

  text = text.trim();

  if (!text) {
    return null;
  }

  // Si parece una dirección web
  if (
    text.startsWith("http://") ||
    text.startsWith("https://")
  ) {
    return text;
  }

  if (
    text.includes(".") &&
    !text.includes(" ")
  ) {
    return "https://" + text;
  }

  // Si no es URL, hacer una búsqueda
  return "https://www.google.com/search?q=" +
    encodeURIComponent(text);
}


// Abrir una página
function navigate(text) {
  const url = getURL(text);

  if (!url) {
    return;
  }

  address.value = url;

  // Las páginas externas se abren en una pestaña normal
  window.open(url, "_blank");

  updateTabTitle(url);
});


// Buscar desde la página de inicio
homeSearch.addEventListener("keydown", function(event) {

  if (event.key === "Enter") {
    navigate(homeSearch.value);
  }

});


// Botones de páginas rápidas
shortcuts.forEach(button => {

  button.addEventListener("click", function() {

    const url = button.dataset.url;

    navigate(url);

  });

});


// Inicio
homeButton.addEventListener("click", function() {

  webview.hidden = true;
  webview.src = "";

  homePage.style.display = "flex";

  address.value = "";

});


// Recargar
reloadButton.addEventListener("click", function() {

  if (!webview.hidden) {
    webview.contentWindow.location.reload();
  }

});


// Atrás
backButton.addEventListener("click", function() {

  try {
    webview.contentWindow.history.back();
  } catch (error) {
    console.log(error);
  }

});


// Adelante
forwardButton.addEventListener("click", function() {

  try {
    webview.contentWindow.history.forward();
  } catch (error) {
    console.log(error);
  }

});


// Favoritos
bookmarkButton.addEventListener("click", function() {

  if (!address.value) {
    return;
  }

  const favorites =
    JSON.parse(localStorage.getItem("favorites") || "[]");

  if (!favorites.includes(address.value)) {

    favorites.push(address.value);

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );

    bookmarkButton.textContent = "★";

  } else {

    const index = favorites.indexOf(address.value);

    favorites.splice(index, 1);

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );

    bookmarkButton.textContent = "☆";
  }

});


// Cambiar título de pestaña
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


// Nueva pestaña
newTabButton.addEventListener("click", function() {

  webview.hidden = true;
  webview.src = "";

  homePage.style.display = "flex";

  address.value = "";
  homeSearch.value = "";

  document.querySelector(".tab-title").textContent =
    "Nueva pestaña";

});
