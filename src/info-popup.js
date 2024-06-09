import Cookies from "js-cookie";
import { el } from "./utils.js";

const HIDE_INFO_POPUP = "hideInfoPopup";

document.addEventListener("DOMContentLoaded", function () {
  const infoPopup = document.querySelector(".info-popup");
  const noShowCheckbox = document.querySelector('input[name="no-show"]');
  const confirmButton = document.querySelector(".info-popup footer button");
  const map = el("map");

  const hidePopupCookie = Cookies.get(HIDE_INFO_POPUP);
  if (!hidePopupCookie) {
    infoPopup.style.display = "block";
    map.style.display = "none";
  }

  confirmButton.addEventListener("click", function () {
    if (noShowCheckbox.checked) {
      Cookies.set(HIDE_INFO_POPUP, "true", { expires: 400 });
    }

    infoPopup.style.display = "none";
    map.style.display = "block";
  });
});
