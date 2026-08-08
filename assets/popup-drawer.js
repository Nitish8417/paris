function modelElementsInit() {
  let modelHeadElements = document.querySelectorAll("[data-model-main-head]");
  let modelConetntBody = document.querySelectorAll("[data-model-main-body]");
  Array.from(modelHeadElements).forEach(function (element) {
    element.addEventListener("click", function (event) {
      event.preventDefault();
      let dataId = element.getAttribute("data-id");
      Array.from(modelConetntBody).forEach(function (bodyElement) {
        bodyElement.classList.remove("active");
      });
      if (element.classList.contains("search")) {
        document.querySelector("body").classList.add("search-open");
        focusElement = element;
        trapFocusElements(
          document.querySelector(".predictive-search-container"),
        );
        setTimeout(() => {
          document
            .querySelector("#Search-In-Template")
            .setAttribute("tabindex", "0");
          document.querySelector("#Search-In-Template").focus();
        }, 100);
      }
      document.querySelector("body").classList.add("no-scroll");
      const mainslector = document.querySelector("#" + dataId);
      mainslector.classList.add("active");
      focusElement = element;

      if (dataId == "product-media-popup") {
        trapFocusElements(mainslector.querySelector(".product-gallery-inner"));
        const popupSliderEl = mainslector.querySelector("#main-popup-slider");
        if (popupSliderEl) {
          let index = parseInt(element.getAttribute("data-index"), 10);
          const mediaId =
            element.closest("[data-media-id]")?.getAttribute("data-media-id") ||
            element.getAttribute("data-media-id");

          if (mediaId) {
            const matchedSlide = popupSliderEl.querySelector(
              `[data-media-id="${mediaId}"]`,
            );
            if (matchedSlide) {
              const matchedIndex = matchedSlide.getAttribute("data-popup-index");
              if (matchedIndex !== null) {
                index = parseInt(matchedIndex, 10);
              } else {
                const cells = Array.from(popupSliderEl.children);
                const found = cells.indexOf(matchedSlide);
                if (found > -1) index = found;
              }
            }
          }

          if (Number.isNaN(index) || index < 0) index = 0;

          let slider = Flickity.data(popupSliderEl);
          if (!slider && typeof themeSlidersInit === "function") {
            themeSlidersInit(window.jQuery ? window.jQuery(popupSliderEl) : popupSliderEl);
            slider = Flickity.data(popupSliderEl);
          }

          if (slider) {
            slider.resize();
            slider.select(index, false, true);
          }

          if (window.ProductModel) window.ProductModel.loadShopifyXR();
        }
      } else {
        trapFocusElements(mainslector);
      }
    });
  });
  let modelCloseElements = document.querySelectorAll("[data-model-close]");
  Array.from(modelCloseElements).forEach(function (closeElement) {
    closeElement.addEventListener("click", function (event) {
      event.preventDefault();
      document.querySelector("body").classList.remove("no-scroll");
      if (document.querySelector("body").classList.contains("search-open")) {
        document.querySelector("body").classList.remove("search-open");
      }

      closeElement.closest("[data-model-main-body]").classList.remove("active");
      if (document.querySelector("[data-predictive-search]")) {
        document.querySelector("[data-predictive-search]").innerHTML = "";
      }
      focusElement = "";
      removeTrapFocus();
    });
  });
}
document.addEventListener("DOMContentLoaded", function (section = document) {
  modelElementsInit();
});

document.addEventListener("shopify:section:load", function (section) {
  let sectiontarget = section.target;
  modelElementsInit(sectiontarget);
});
