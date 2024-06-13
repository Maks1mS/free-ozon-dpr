import { el } from "./utils.js";

class Analytics {
    static event(name, data = undefined) {
        if (typeof ym !== 'undefined') {
            // eslint-disable-next-line no-undef
            ym(window.YANDEX_METRICA_ID, 'reachGoal', name, data);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const popupPVZId = el("popup-pvz-id");
    const pvzData = { pvz: popupPVZId.innerText };

    const popupLink = el("popup-link");
    const sourceLink = el("popup-source");
    const infoPopupButton = el("info-popup-button");

    popupLink.addEventListener("click", function  ()  {
        Analytics.event("pvz-link-clicked", pvzData);
    });

    sourceLink.addEventListener("click", function  ()  {
        Analytics.event("pvz-source-clicked", pvzData);
    });

    infoPopupButton.addEventListener("click", function  () {
        Analytics.event("info-popup-closed");
    });
});

