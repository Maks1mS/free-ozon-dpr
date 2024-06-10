import Cookies from "js-cookie";
import { el } from "./utils.js";

const HIDE_INFO_POPUP = "hideInfoPopup";

let infoPopup;
let map;

function getHidePopup() {
  const hidePopupCookie = Cookies.get(HIDE_INFO_POPUP);
  return hidePopupCookie === 'true';
}

function setHidePopup(hidePopupCookie) {
  Cookies.set(HIDE_INFO_POPUP, hidePopupCookie ? "true" : "false", { expires: 400 });
}

export function showPopup() {
  infoPopup.style.display = "block";
  map.style.display = "none";

  const hidePopupCookie = getHidePopup();

  if (hidePopupCookie) {
    const noShowCheckbox = document.querySelector('input[name="no-show"]');
    noShowCheckbox.checked = true;
  }
}

export function hidePopup() {
  infoPopup.style.display = "none";
  map.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  infoPopup = el("info-popup");
  const noShowCheckbox = document.querySelector('input[name="no-show"]');
  const confirmButton = document.querySelector(".info-popup footer button");
  map = el("map");

  const hidePopupCookie = getHidePopup();

  if (!hidePopupCookie) {
    showPopup();
  }

  confirmButton.addEventListener("click", function () {
    setHidePopup(noShowCheckbox.checked);
    hidePopup();
  });
});
