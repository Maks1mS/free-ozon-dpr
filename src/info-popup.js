import Cookies from "js-cookie";

const HIDE_INFO_POPUP = "hideInfoPopup";

document.addEventListener("DOMContentLoaded", function () {
    const infoPopup = document.querySelector(".info-popup");
    const noShowCheckbox = document.querySelector('input[name="no-show"]');
    const confirmButton = document.querySelector('.info-popup footer button');

    const hidePopupCookie = Cookies.get(HIDE_INFO_POPUP);
    if (!hidePopupCookie) {
        infoPopup.style.display = "block";
      }

    confirmButton.addEventListener("click", function () {
        if (noShowCheckbox.checked) {
          Cookies.set(HIDE_INFO_POPUP, "true", { expires: 400 });
        }

        infoPopup.style.display = "none";
      });
});
