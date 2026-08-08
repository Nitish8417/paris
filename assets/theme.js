function themeAllSliderInt(section = document) {
  let sliderElements = section.querySelectorAll("[data-flickity-slider]");
  Array.from(sliderElements).forEach(function (element) {
    if (!jQuery(element).hasClass("flickity-enabled")) {
      themeSlidersInit(element);
    } else {
      jQuery(element).flickity("resize");
    }
  });
}

function themeSlidersInit(element, slideIndex) {
  let selector = element;
  if (element.nodeType) {
    selector = jQuery(element);
  }
  var optionSlectors = selector.attr("data-flickity");
  if (optionSlectors) {
    var options = JSON.parse(optionSlectors);
    if (selector.hasClass("flickity-enabled")) {
      jQuery(selector).flickity("resize");
    } else {
      if (slideIndex) {
        selector
          .not(".flickity-enabled")
          .flickity(options)
          .flickity("select", slideIndex);
      } else {
        selector.not(".flickity-enabled").flickity(options);
        selector.flickity("resize");
      }
    }
    if (animationCheck) {
      if (AOS) {
        AOS.refreshHard();
      }
    }
  }
  selector.on("change.flickity", function (event, index) {
    if (selector.find(".announcement-item.is-selected")) {
      let textColor = selector
        .find(".announcement-item.is-selected")
        .attr("data-color");
      let backgroundColor = selector
        .find(".announcement-item.is-selected")
        .attr("data-bg");
      let linkColor = selector
        .find(".announcement-item.is-selected")
        .attr("data-link");
      selector.closest(".announcement-wrapper").css({
        "--annouceBgColor": backgroundColor,
        "--annouceTextColor": textColor,
        "--announcementLinkColor": linkColor,
      });
    }
    selector[0]
      .querySelectorAll(
        ".product-media-youtube,.youtube-video,iframe[src*='www.youtube.com']",
      )
      .forEach((video) => {
        if (
          video.getAttribute("data-autoplay") == "true" ||
          video.hasAttribute("autoplay")
        )
          return false;
        video.contentWindow.postMessage(
          '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
          "*",
        );
      });
    Array.from(
      selector[0].querySelectorAll(
        ".product-media-vimeo,iframe[src*='player.vimeo.com']",
      ),
    ).forEach((video) => {
      if (
        video.getAttribute("data-autoplay") == "true" ||
        video.hasAttribute("autoplay")
      )
        return false;
      video.contentWindow.postMessage('{"method":"pause"}', "*");
    });
    selector[0].querySelectorAll("video").forEach((video) => {
      if (
        video.getAttribute("data-autoplay") == "true" ||
        video.hasAttribute("autoplay")
      )
        return false;
      video.pause();
    });

    if (selector[0].hasAttribute("data-lookbook-slide")) {
      let parent = selector[0].closest(".shopify-section");
      let active = parent.querySelector(".active[data-lookbook-btn]");
      if (active) {
        active.classList.remove("active");
        let newActive = parent.querySelector(
          '[data-lookbook-btn][data-index="' + index + '"]',
        );
        if (newActive) {
          newActive.classList.add("active");
        }
      }
    }
  });
  //customdotsIcon();
}

// function customdotsIcon() {
//   let sliderElements =$(".section-hero-banner");
//   sliderElements.each(function(i, container){
//     var $container = $(container);
//     var $slider = $container.find('[data-flickity-slider]');
//     var $customIcon =$container.find(".custom-slider-dots");
//     if($slider && $customIcon.hasClass("flickity-page-dots")){
//       var flkty = $slider.data('flickity');
//       var selectedIndex = flkty.selectedIndex;
//       var $pager =  $customIcon.find('.slider-dots');
//       $pager.eq(0).addClass('is-selected');
//       $slider.on('select.flickity', function() {
//         $pager.filter('.is-selected').removeClass('is-selected');
//         $pager.eq(flkty.selectedIndex).addClass('is-selected');
//       });
//       $customIcon.on('click', '.slider-dots', function() {
//         var index = $(this).index();
//         $slider.flickity('select', index);
//       });
//       $customIcon.on('keypress', '.slider-dots', function(event) {
//         if(event.keyCode === 13 ){
//           var index = $(this).index();
//           $slider.flickity('select', index);
//         }
//       });
//     }
//   });
// }

function customdotsIcon() {
  let sliderElements = $(".section-hero-banner");
  sliderElements.each(function (i, container) {
    var $container = $(container);
    var $slider = $container.find("[data-flickity-slider]");
    var $customIcon = $container.find(".custom-slider-dots");

    // Check if Flickity is initialized
    var flkty = $slider.data("flickity");
    if (!flkty) {
      console.error("Flickity is not initialized on the slider:", $slider);
      return;
    }

    // Ensure custom dots container exists and has the expected class
    if (
      $customIcon.length === 0 ||
      !$customIcon.hasClass("flickity-page-dots")
    ) {
      // console.error("Custom dots container not found or missing class:", $customIcon);
      return;
    }

    // Ensure custom dots are present
    var $pager = $customIcon.find(".slider-dots");
    if ($pager.length === 0) {
      console.error("Custom dots (.slider-dots) not found in:", $customIcon);
      return;
    }

    // Set initial active class
    $pager.eq(0).addClass("is-selected");

    // Bind Flickity's select event
    $slider.on("select.flickity", function () {
      $pager.filter(".is-selected").removeClass("is-selected");
      $pager.eq(flkty.selectedIndex).addClass("is-selected");
    });

    // Bind click event on custom dots
    $customIcon.on("click", ".slider-dots", function () {
      var index = $(this).index();
      $slider.flickity("select", index);
    });

    // Bind keypress event for accessibility
    $customIcon.on("keypress", ".slider-dots", function (event) {
      if (event.keyCode === 13) {
        // Enter key
        var index = $(this).index();
        $slider.flickity("select", index);
      }
    });
  });
}

window.addEventListener("resize", (event) => {
  setTimeout(function () {
    let sliderElements = document.querySelectorAll("[data-flickity-slider]");
    Array.from(sliderElements).forEach(function (selector) {
      if (!jQuery(selector).hasClass("flickity-enabled")) {
        themeSlidersInit(selector);
      } else {
        jQuery(selector).flickity("resize");
      }
    });
  }, 500);
});

function scrollingContentInt(section = document) {
  let marqueeElements = section.querySelectorAll("[data-scrolling-content]");
  Array.from(marqueeElements).forEach((element) => {
    ScrollingTextAutoplay(element);
  });
}

function ScrollingTextAutoplay(element) {
  let scrollingSpeedValue = parseInt(
    element.getAttribute("data-scrolling-speed") || 15,
  );
  if (
    window.innerWidth < 768 &&
    element.hasAttribute("data-scrolling-speed-mobile")
  ) {
    scrollingSpeedValue = parseInt(
      element.getAttribute("data-scrolling-speed-mobile"),
    );
  }
  const elementWidth = element.clientWidth,
    node = element.querySelector("[data-scrolling-item]"),
    nodeWidth = node.clientWidth;
  let slowFactor = 1 + (Math.max(1600, elementWidth) - 375) / (1600 - 375);
  element.parentElement.style.setProperty(
    "--loopSpeed",
    `${((scrollingSpeedValue * slowFactor * nodeWidth) / elementWidth).toFixed(3)}s`,
  );
}

function beforeandAfterInit(section = document) {
  let pointers = section.querySelectorAll("[data-before-after-pointer]");
  setTimeout(() => {
    Array.from(pointers).forEach(function (pointer) {
      const parentSection = pointer.closest(".shopify-section");
      if (!pointer.offsetParent) {
        return false;
      }
      let pointerDown = false;
      let _offsetX = (_currentX = 0);
      let minOffset = -pointer.offsetLeft - 0;
      let maxOffset = pointer.offsetParent.clientWidth + minOffset;
      parentSection.addEventListener("pointerdown", function (event) {
        if (
          event.target === pointer ||
          event.target.closest(".before-after-cursor-point") === pointer
        ) {
          _initialX = event.clientX - _offsetX;
          pointerDown = true;
        }
      });
      parentSection.addEventListener("pointermove", function (event) {
        if (!pointerDown) {
          return;
        }
        _currentX = Math.min(
          Math.max(event.clientX - _initialX, minOffset),
          maxOffset,
        );
        _offsetX = _currentX;
        _currentX = _currentX.toFixed(1);
        parentSection.style.setProperty(
          "--image-clip-position",
          `${_currentX}px`,
        );
      });
      parentSection.addEventListener("pointerup", function (event) {
        pointerDown = false;
      });
      window.addEventListener("resize", function () {
        if (!pointers.offsetParent) {
          return false;
        }
        minOffset = -pointer.offsetLeft - 0;
        maxOffset = pointer.offsetParent.clientWidth + minOffset;
        _currentX = Math.min(Math.max(minOffset, _currentX), maxOffset);
        parentSection.style.setProperty(
          "--image-clip-position",
          `${_currentX}px`,
        );
      });
    });
  }, 500);
}

function tabContentInit(section = document) {
  let tabheaders = section.querySelectorAll("[data-tab-head]");
  Array.from(tabheaders).forEach((tabheader) => {
    tabheader.addEventListener("click", (event) => {
      event.preventDefault();
      tabElementsCall(tabheader);
    });
  });
}

function tabContentInitOnHover(section = document) {
  let tabheaders = section.querySelectorAll("[data-image-header]");
  Array.from(tabheaders).forEach((tabheader) => {
    tabheader.addEventListener("mouseover", (event) => {
      tabElementsCall(tabheader);
    });
  });
}

function tabElementsCall(tabheader) {
  let activeTabSelector = "";
  activeTabSelector = tabheader.getAttribute("data-url");
  if (tabheader.closest(".tabs-with-image-list")) {
    activeTabSelector = tabheader
      .querySelector(".images-carousel-item-head")
      .getAttribute("data-url");
  }
  let parent = tabheader.closest("[data-content-main]");
  let currentActiveTabheading = parent.querySelector(".active[data-tab-head]");
  let currentActiveImageTabHeading = parent.querySelector(
    ".active[data-image-header]",
  );
  if (currentActiveTabheading) {
    currentActiveTabheading.classList.remove("active");
  }
  if (currentActiveImageTabHeading) {
    currentActiveImageTabHeading.classList.remove("active");
  }
  tabheader.classList.add("active");
  let tabContentElement = parent.querySelector(activeTabSelector);
  let tabsContentall = parent.querySelectorAll("[data-tab-content]");
  if (tabContentElement) {
    if (
      tabheader.parentElement.classList.contains("tab-item-list") ||
      tabheader.classList.contains("tab-item-list")
    ) {
      let currentActiveTabContent = parent.querySelector(
        ".active[data-tab-content]",
      );
      if (currentActiveTabContent) {
        if (currentActiveTabContent.classList.contains("tab-content")) {
          currentActiveTabContent.style.display = "none";
          currentActiveTabContent.classList.remove("active");
        }
      }

      tabContentElement.style.display = "block";
      tabContentElement.classList.add("active");
      if (tabContentElement.querySelector("[data-flickity]")) {
        let slider = Flickity.data(
          tabContentElement.querySelector("[data-flickity].flickity-enabled"),
        );
        slider.resize();
      }
    }
  }
}

function colorMediaInit(section = document) {
  let swatchColorElement = section.querySelectorAll("[data-card-color-option]");
  Array.from(swatchColorElement).forEach(function (element) {
    element.addEventListener("mouseover", function (event) {
      let productGrid = element.closest("[data-product-grid]");
      let mainImageGrid = productGrid.querySelector("[data-main-image]");
      let allImageElement = element.querySelector("script");
      if (productGrid.querySelector(".product-swatch-item.active")) {
        productGrid
          .querySelector(".product-swatch-item.active")
          .classList.remove("active");
      }
      element.classList.add("active");
      if (allImageElement && mainImageGrid) {
        let swatchMedia = new DOMParser()
          .parseFromString(JSON.parse(allImageElement.textContent), "text/html")
          .querySelector(".media-content");
        console.log(swatchMedia);
        mainImageGrid.innerHTML = swatchMedia.innerHTML;
      }
    });
    element.addEventListener("click", function (event) {
      let url = element.getAttribute("data-product-url");
      if (url) {
        let mainUrl = window.location.origin + url;
        window.location.href = mainUrl;
      }
    });
  });
}

function videobannerInit(section = document) {
  if (document.querySelectorAll("[data-play-button]")) {
    let playButtons = document.querySelectorAll("[data-play-button]");
    Array.from(playButtons).forEach(function (playButton) {
      if (playButton) {
        videoPlayEvent(playButton);
      }
    });
  }
}

function videoPlayEvent(playButton) {
  let parentWrapper = playButton.closest("[data-video-wrapper]");
  playButton.addEventListener("click", function (event) {
    event.preventDefault();
    let videoStyle = parentWrapper.querySelector("video");
    let iframeStyle = parentWrapper.querySelector("iframe");

    playButton.style.display = "none";
    let imageWrapper = parentWrapper.querySelector("[data-place-image]");
    if (parentWrapper.querySelector(".content-overlay")) {
      parentWrapper.querySelector(".content-overlay").style.display = "none";
      parentWrapper
        .querySelector(".video-wrapper")
        .classList.remove("content-overlay-true");
    }
    if (imageWrapper) {
      imageWrapper.style.display = "none";
    }
    if (videoStyle) {
      videoStyle.style.display = "block";
      videoStyle.play();
    } else {
      iframeStyle.style.display = "block";
    }
  });
}

function countdownInit(section = document) {
  const countdownSelectors = section.querySelectorAll("[data-countdown-main]");
  if (countdownSelectors) {
    Array.from(countdownSelectors).forEach(function (countdownSelector) {
      const dateElement = countdownSelector.querySelector("[data-countdown]");
      if (dateElement) {
        if (dateElement.value != "") {
          const myArr = dateElement.value.split("/");
          let _day = myArr[0];
          let _month = myArr[1];
          let _year = myArr[2];
          const endtime = _month + "/" + _day + "/" + _year + " 00:00:00";
          const days = countdownSelector.querySelector("#dDays");
          const hours = countdownSelector.querySelector("#Hours");
          const minutes = countdownSelector.querySelector("#Minutes");
          const seconds = countdownSelector.querySelector("#Seconds");

          var timeinterval = setInterval(function () {
            var time = getRemainingTime(endtime);
            if (time.total <= 0) {
              countdownSelector.style.display = "none";
              clearInterval(timeinterval);
            } else {
              days.innerHTML = pad(time.days, 2);
              hours.innerHTML = pad(time.hours, 2);
              minutes.innerHTML = pad(time.minutes, 2);
              seconds.innerHTML = pad(time.seconds, 2);
            }
          }, 1000);
        }
      }
    });
  }
}

window.addEventListener("scroll", function () {
  document
    .querySelectorAll(
      ".product-media-youtube,.youtube-video,iframe[src*='www.youtube.com']",
    )
    .forEach((video) => {
      if (
        !isOnScreen(video) &&
        video.getAttribute("data-autoplay") == "false"
      ) {
        video.contentWindow.postMessage(
          '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
          "*",
        );
      }
    });
  document
    .querySelectorAll(".product-media-vimeo, iframe[src*='player.vimeo.com']")
    .forEach((video) => {
      if (
        !isOnScreen(video) &&
        video.getAttribute("data-autoplay") == "false"
      ) {
        video.contentWindow.postMessage('{"method":"pause"}', "*");
      }
    });
  document.querySelectorAll("video").forEach((video) => {
    if (!isOnScreen(video) && video.getAttribute("data-autoplay") == "false") {
      video.pause();
    }
  });
});

function contentAccordian(section = document) {
  if (window.innerWidth < 768) {
    var Accordion = function (el, multiple) {
      this.el = el || {};
      this.multiple = multiple || false;
      var links = this.el.find("[data-accordian-head]");
      links.on(
        "click",
        { el: this.el, multiple: this.multiple },
        this.dropdown,
      );
    };
    Accordion.prototype.dropdown = function (e) {
      var $el = e.data.el;
      (($this = $(this)), ($next = $this.next()));
      $next.slideToggle();
      $this.parent().toggleClass("active");

      if (!e.data.multiple) {
        $el
          .find("[data-accordian-content]")
          .not($next)
          .slideUp()
          .parent()
          .removeClass("active");
      }
    };
    var accordion = new Accordion($("[data-accordian-wrapper]"), false);
  }
}

function menuHoverInit(section = document) {
  let allSiteMenus = document.querySelectorAll("li.site-nav-item");
  Array.from(allSiteMenus).forEach(function (allSiteMenu) {
    allSiteMenu.addEventListener("mouseover", function () {
      if (
        document
          .querySelector(".predictive-search-main")
          .classList.contains("active")
      ) {
        document
          .querySelector(".predictive-search-main")
          .classList.remove("active");
      }
      if (document.querySelector("body").classList.contains("search-open")) {
        document
          .querySelector("body")
          .classList.remove("search-open", "no-scroll");
      }
    });
  });
}
function detailsDisclouser() {
  document.querySelectorAll("details").forEach((accordion) => {
    if (
      accordion.closest(".product-collapsed-wrapper") ||
      accordion.closest(".section-accordion")
    ) {
      accordion.addEventListener("toggle", function (event) {
        if (this.open) {
          document.querySelectorAll("details").forEach((otherAccordion) => {
            if (otherAccordion !== this) otherAccordion.removeAttribute("open");
          });
        }
      });
    }
    if (accordion.closest(".sorting")) {
      accordion.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          setTimeout(function () {
            focusElement == "" && (focusElement = accordion);
            trapFocusElements(document.querySelector(".sortby-dropdown"));
          }, 500);
        }
      });
    }
  });
}

function lookbookSlider(section = document) {
  let lookbookbtns = section.querySelectorAll("[data-lookbook-btn]");
  Array.from(lookbookbtns).forEach((lookbookbtn) => {
    lookbookbtn.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("adadadadadasd");
      if (lookbookbtn.classList.contains("active")) return false;
      let parentSection = lookbookbtn.closest(".shopify-section");
      let activeItem = parentSection.querySelector(
        ".active[data-lookbook-btn]",
      );
      if (activeItem) {
        activeItem.classList.remove("active");
        lookbookbtn.classList.add("active");
        let sliderElement = parentSection.querySelector(
          ".flickity-enabled[data-flickity-slider]",
        );
        if (sliderElement) {
          let index = parseInt(lookbookbtn.getAttribute("data-index"));
          let slider = Flickity.data(sliderElement);
          slider.select(index);
        }
      }
    });
  });
}

function pauseAllMedia() {
  window.addEventListener("scroll", function () {
    document
      .querySelectorAll("iframe[src*='www.youtube.com']")
      .forEach((video) => {
        if (
          !isOnScreen(video) &&
          video.getAttribute("data-autoplay") == "false"
        ) {
          video.contentWindow.postMessage(
            '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
            "*",
          );
        }
      });
    document
      .querySelectorAll("iframe[src*='player.vimeo.com']")
      .forEach((video) => {
        if (
          !isOnScreen(video) &&
          video.getAttribute("data-autoplay") == "false"
        ) {
          video.contentWindow.postMessage('{"method":"pause"}', "*");
        }
      });
    document.querySelectorAll("video").forEach((video) => {
      if (
        !isOnScreen(video) &&
        video.getAttribute("data-autoplay") == "false"
      ) {
        video.pause();
      }
    });
  });
}

function mediaScollClose(section = document) {
  let allMediaWrapper = document.querySelectorAll(".product-images-wrapper");
  Array.from(allMediaWrapper).forEach(function (media) {
    window.addEventListener("scroll", function () {
      media
        .querySelectorAll(
          ".product-media-vimeo,iframe[src*='player.vimeo.com']",
        )
        .forEach((video) => {
          let top = video.getBoundingClientRect().top;
          if (!(top > -50 && top < window.innerWidth - 100)) {
            video.contentWindow.postMessage('{"method":"pause"}', "*");
          }
        });
      media
        .querySelectorAll(
          ".product-media-youtube,iframe[src*='www.youtube.com']",
        )
        .forEach((video) => {
          let top = video.getBoundingClientRect().top;
          if (!(top > -50 && top < window.innerWidth - 100)) {
            video.contentWindow.postMessage(
              '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
              "*",
            );
          }
        });

      media.querySelectorAll("video").forEach((video) => {
        let left = video.getBoundingClientRect().left;
        if (!video.hasAttribute("autoplay")) {
          if (!(left > -50 && left < window.innerWidth - 100)) {
            video.pause();
          }
        }
      });
    });
  });
}

function localizations(section = document) {
  let allLocalizationsWrapper = document.querySelectorAll(
    "[data-item-localization-main]",
  );
  Array.from(allLocalizationsWrapper).forEach(function (allLocalizations) {
    allLocalizations.addEventListener("toggle", function () {
      if (this.open) {
        document
          .querySelectorAll("[data-item-localization-main][open]")
          .forEach((otherItem) => {
            if (otherItem !== this) otherItem.removeAttribute("open");
          });
      }
    });
  });
  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-item-localization-main]")) return;
    document
      .querySelectorAll("[data-item-localization-main][open]")
      .forEach((otherItem) => {
        otherItem.removeAttribute("open");
      });
  });
}
function parallaxMedia(section = document) {
  if (document.querySelector("[data-parallax-media]")) {
    new universalParallax().init({
      speed: 6,
    });
  }
}

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    if (this.classList.contains("autoplay-false")) {
      const buttonClickLoad =
        this.closest(".shopify-section").querySelector(".load-data");
      buttonClickLoad.addEventListener("click", this.loadContent.bind(this));
    } else {
      this.addObserver();
    }
  }
  addObserver() {
    if ("IntersectionObserver" in window === false) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadContent();
            observer.unobserve(this);
          }
        });
      },
      { rootMargin: "0px 0px 1000px 0px" },
    );
    observer.observe(this);
  }
  loadContent() {
    if (
      this.parentElement.classList.contains("parallax-scrolling-image-wrapper")
    ) {
      this.style.position = "absolute";
      this.parentElement.style.position = "fixed";
    }
    const content =
      this.querySelector("template").content.firstElementChild.cloneNode(true);
    this.appendChild(content);
    if (
      (this.querySelector("video") &&
        this.querySelector("video").hasAttribute("data-autoplay")) ||
      (this.querySelector("video") &&
        this.querySelector("video").hasAttribute("autoplay"))
    ) {
      this.querySelector("video").play();
    }
  }
}
customElements.define("deferred-media", DeferredMedia);

document.addEventListener("DOMContentLoaded", function (section = document) {
  themeAllSliderInt();
  scrollingContentInt();
  beforeandAfterInit();
  tabContentInit();
  tabContentInitOnHover();
  colorMediaInit();
  videobannerInit();
  countdownInit();
  contentAccordian();
  menuHoverInit();
  detailsDisclouser();
  lookbookSlider();
  pauseAllMedia();
  mediaScollClose();
  localizations();
  customdotsIcon();
  parallaxMedia();
  videoTagPause();
  if (animationCheck) {
    if (AOS) {
      AOS.refreshHard();
    }
  }
});

document.addEventListener("shopify:section:load", function (section) {
  let sectiontarget = section.target;
  themeAllSliderInt(sectiontarget);
  if (sectiontarget.querySelector("[data-parallax-media]")) {
    new universalParallax().init({
      speed: 6,
    });
  }
  scrollingContentInt(sectiontarget);
  beforeandAfterInit(sectiontarget);
  tabContentInit(sectiontarget);
  tabContentInitOnHover(sectiontarget);
  colorMediaInit(sectiontarget);
  videobannerInit(sectiontarget);
  countdownInit(sectiontarget);
  contentAccordian(sectiontarget);
  menuHoverInit(sectiontarget);
  detailsDisclouser(sectiontarget);
  lookbookSlider(sectiontarget);
  pauseAllMedia(sectiontarget);
  if (animationCheck) {
    if (AOS) {
      AOS.refreshHard();
    }
  }
});

document.addEventListener(
  "shopify:block:select",
  function (block) {
    // _sectionUnLoadEvent(section);
    let target = block.target;
    let slider = target.closest("[data-flickity-slider].flickity-enabled");
    if (slider) {
      let index = Array.from(target.parentElement.children).indexOf(target);
      let sliderElement = Flickity.data(slider);
      sliderElement.select(index);
    }
    if (animationCheck) {
      if (AOS) {
        AOS.refreshHard();
      }
    }
  },
  false,
);

class BannerWithText extends HTMLElement {
  constructor() {
    super();
    this.backgroundChange();
  }
  backgroundChange() {
    let hoverElements = this.querySelectorAll("[data-banner-item]");
    Array.from(hoverElements).forEach(function (hoverElement) {
      hoverElement.addEventListener("mouseover", function (event) {
        let backgroundColor = hoverElement.getAttribute("data-color");
        this.closest("[data-main-wrapper]").style.transition =
          "background 1.5s";
        this.closest("[data-main-wrapper]").style.background = backgroundColor;
      });
    });
  }
}
customElements.define("banner-with-text", BannerWithText);
async function getGeoDetails(geocoder, address) {
  let getAddress = new Promise(function (resolve, reject) {
    geocoder.geocode({ address: address }, function (results, status) {
      if (status === "OK") {
        resolve([
          results[0].geometry.location.lat(),
          results[0].geometry.location.lng(),
        ]);
      } else {
        reject(new Error("Couldnt't find the location " + address));
      }
    });
  });
  return await getAddress;
}

async function createMarker(map, position) {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  return new AdvancedMarkerElement({
    position: position,
    map: map,
  });
}
let markers = [];
function updateMap(map, latitude, longitude) {
  map.setCenter({ lat: latitude, lng: longitude });
  map.setZoom(15);
  const position = { lat: latitude, lng: longitude };
  const marker = createMarker(map, position);
  markers.push(marker);
}

class StoreLocatorMap extends HTMLElement {
  constructor() {
    super();
    this.prepMapApi();
    this.mapLocatorElementsInt();
  }
  prepMapApi() {
    this.loadScript().then(this.initMap.bind(this));
  }
  loadScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      (document.body.appendChild(script),
        (script.onload = resolve),
        (script.onerror = reject),
        (script.async = !0),
        (script.src =
          "https://maps.googleapis.com/maps/api/js?key=" +
          googleMapApiKey +
          "&loading=async"));
    });
  }
  initMap() {
    let selector = this.querySelector("[data-map-main-container]");
    let mapStyle = selector.getAttribute("data-map-style");
    let mappAddress = selector.getAttribute("data-location");
    setTimeout(() => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: mappAddress }, function (results, status) {
        if (results != null) {
          let options = {
            zoom: 8,
            center: results[0].geometry.location,
            mapId: mapID,
          };
          let map = new google.maps.Map(selector, options);
          let center = map.getCenter();
          const marker = createMarker(map, map.getCenter());
          window.addEventListener("resize", function () {
            setTimeout(function () {
              google.maps.event.trigger(map, "resize");
              map.setCenter(center);
            }, 250);
          });
        }
      });
    }, 500);
  }

  mapLocatorElementsInt() {
    var mapElements = this.querySelectorAll(".store-locator-list-item");
    Array.from(mapElements).forEach(function (element) {
      let parent = element.closest(".store-locator-wrapper");
      element.addEventListener("click", (event) => {
        setTimeout(() => {
          var geocoder = new google.maps.Geocoder();
          let activeLocatorElement = parent.querySelector(
            ".Store-locator-inner-item.active",
          );
          let sidebarStoreSelector = parent.querySelector(
            ".store-locator-list-item.active",
          );
          let activeSideElement = parent.querySelector(
            ".store-locator-image.active",
          );
          if (sidebarStoreSelector) {
            sidebarStoreSelector.classList.remove("active");
            element.classList.add("active");
          }
          let itemId = element.getAttribute("data-id");
          let storeImageId = parent.querySelector("#" + itemId);
          let contentId = parent.querySelector(
            '[ data-store-id="' + itemId + '"]',
          );
          if (storeImageId) {
            if (activeSideElement) {
              activeSideElement.classList.remove("active");
              activeSideElement.classList.add("hidden");
            }
            storeImageId.classList.remove("hidden");
            storeImageId.classList.add("active");
          }
          if (contentId) {
            if (activeLocatorElement) {
              activeLocatorElement.classList.remove("active");
              activeLocatorElement.classList.add("hidden");
            }
            contentId.classList.remove("hidden");
            contentId.classList.add("active");
          }
          let currentLocation = element.getAttribute("data-map-loaction");
          let mapWrapper = parent.querySelector(".store-locator-map-wrapper");
          if (currentLocation != "") {
            if (mapWrapper) {
              mapWrapper.classList.remove("hidden");
            }
            if (googleMapApiKey != "") {
              let geoDetail = getGeoDetails(geocoder, currentLocation);
              geoDetail.then(function (currentLocation) {
                if (geoDetail != null) {
                  let map = new google.maps.Map(mapWrapper, {
                    center: {
                      lat: 0,
                      lng: 0,
                    },
                    zoom: 8,
                    mapId: mapID,
                  });
                  updateMap(map, currentLocation[0], currentLocation[1]);
                }
              });
            }
          } else {
            if (mapWrapper) {
              mapWrapper.classList.add("hidden");
            }
          }
        }, 500);
      });
    });
  }
}
customElements.define("store-locator-map", StoreLocatorMap);

class VariantSelector extends HTMLElement {
  #pendingRequestUrl;
  #abortController;
  #requestId = 0;
  #isNavigating = false;

  constructor() {
    super();
    this.addEventListener("change", this.variantChanged.bind(this));
    this.hasUserInteracted = false;
  }

  connectedCallback() {
    this.other = Array.from(
      document.querySelectorAll("variant-selector"),
    ).filter((selector) => selector !== this);
    this.section = this.closest("section,.product-quick-view-drawer");
    this.updateOptions();
    this.updateMasterId();
    this.updateVariantClass();
    this.showInitialAvailability();
  }

  disconnectedCallback() {
    this.#abortController?.abort();
  }

  setVariantSelectors(variant) {
    const selects = this.querySelectorAll("select");
    selects.forEach((select, index) => {
      const optionValue = variant[`option${index + 1}`];
      if (
        optionValue &&
        select.querySelector(`option[value="${optionValue}"]`)
      ) {
        select.value = optionValue;
      }
    });

    const fieldsets = this.querySelectorAll("fieldset");
    fieldsets.forEach((fieldset, index) => {
      const optionValue = variant[`option${index + 1}`];
      if (optionValue) {
        const radio = fieldset.querySelector(`input[value="${optionValue}"]`);
        if (radio) {
          radio.checked = true;
          fieldset
            .querySelector(
              ".swatches-list-item.active, .product-swatch-item.active",
            )
            ?.classList.remove("active");
          radio
            .closest(".swatches-list-item, .product-swatch-item")
            ?.classList.add("active");
        }
      }
    });

    this.updateOptions();
  }

  variantChanged(event) {
    if (this.#isNavigating) return;
    if (!(event.target instanceof HTMLElement)) return;

    this.hasUserInteracted = true;

    const changedInput =
      event.target instanceof HTMLSelectElement
        ? event.target.options[event.target.selectedIndex]
        : event.target;

    if (!changedInput) return;

    this.updateSelectedOption(event.target);

    // Dispatch change event on the variant ID input so product form and other listeners react immediately
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`,
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      if (input) input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    // Detect context — combined listing navigation behaves differently per context
    const isOnProductPage = !!this.closest(".section-main-product");
    const isInQuickView = !!this.closest(".quickview-body-content");

    // Inline combined listing detection (Horizon pattern — no separate helper needed)
    const connectedUrl = changedInput.dataset.connectedProductUrl || "";
    const normalize = (url) =>
      url.split("?")[0].split("#")[0].replace(/\/$/, "");
    const currentProductPath = normalize(this.dataset.url || "");
    const targetProductPath = normalize(connectedUrl);
    const loadsNewProduct =
      (isOnProductPage || isInQuickView) &&
      !!connectedUrl &&
      targetProductPath !== currentProductPath;

    if (loadsNewProduct) {
      this.dataset.url = targetProductPath;

      const variantId = changedInput.dataset.variantId;

      // Only update browser URL on the main product page, not inside quick view
      if (isOnProductPage) {
        history.replaceState({}, "", targetProductPath);
      }

      const morphTarget = isInQuickView ? "quickview" : "main";

      if (variantId) {
        // Variant ID known — fetch with ?variant=
        this.fetchUpdatedSection(
          `${targetProductPath}?variant=${variantId}`,
          morphTarget,
        );
      } else {
        // Collect all currently selected option value IDs from this picker
        // (mirrors Horizon: sends ?option_values=ID1,ID2 — native combined listing param)
        const selectedIds = [
          ...Array.from(
            this.querySelectorAll('fieldset input[type="radio"]:checked'),
          ),
          ...Array.from(this.querySelectorAll("select"))
            .map((sel) => sel.options[sel.selectedIndex])
            .filter(Boolean),
        ]
          .map((el) => el.dataset.optionValueId)
          .filter(Boolean);

        // Ensure the clicked input's ID is included (it may already be checked via updateSelectedOption)
        const clickedId = changedInput.dataset.optionValueId;
        if (clickedId && !selectedIds.includes(clickedId))
          selectedIds.push(clickedId);

        const navUrl = selectedIds.length
          ? `${targetProductPath}?option_values=${selectedIds.join(",")}`
          : targetProductPath;

        this.fetchUpdatedSection(navUrl, morphTarget);
      }

      this.updateVariantClass();
      return;
    }

    this.updateOptions();
    this.updateMasterId();
    this.updateVariantClass();
    this.updateURL();
    this.updateOther();

    const requestUrl = this.buildRequestUrl();
    if (requestUrl) this.fetchUpdatedSection(requestUrl);
  }

  updateSelectedOption(target) {
    if (typeof target === "string") {
      const targetElement = this.querySelector(
        `[data-option-value-id="${target}"]`,
      );
      if (!targetElement) return;
      target = targetElement;
    }

    if (target instanceof HTMLInputElement) {
      target.checked = true;
      const fieldset = target.closest("fieldset");
      if (fieldset) {
        fieldset.querySelectorAll(".swatch-option").forEach((input) => {
          input.dataset.currentChecked = "false";
        });
        target.dataset.currentChecked = "true";
      }
    }

    if (target instanceof HTMLSelectElement) {
      const newSelectedOption = Array.from(target.options).find(
        (opt) => opt.value === target.value,
      );
      if (newSelectedOption) {
        for (const option of target.options) option.removeAttribute("selected");
        newSelectedOption.setAttribute("selected", "selected");
      }
    }
  }

  buildRequestUrl(source = null, sourceSelectedOptionsValues = []) {
    let productUrl = (this.#pendingRequestUrl || this.dataset.url || "").split(
      "?",
    )[0];
    this.#pendingRequestUrl = productUrl;

    const sectionId = this.dataset.originalSection || this.dataset.section;
    const optionValues = this.selectedOptionsValues;

    if (source === "product-card") {
      const values = sourceSelectedOptionsValues.length
        ? sourceSelectedOptionsValues
        : optionValues;
      return `${productUrl}?option_values=${values.join(",")}&section_id=${sectionId}`;
    }

    if (optionValues.length > 0) {
      return `${productUrl}?option_values=${optionValues.join(",")}&section_id=${sectionId}`;
    } else if (this.currentVariant) {
      return `${productUrl}?variant=${this.currentVariant.id}&section_id=${sectionId}`;
    }

    return null;
  }

  // morphTarget: null = normal section render | "main" = combined listing full page | "quickview" = combined listing in quick-view drawer
  fetchUpdatedSection(requestUrl, morphTarget = null) {
    if (!requestUrl) return;

    this.#abortController?.abort();
    this.#abortController = new AbortController();
    const requestId = ++this.#requestId;

    if (morphTarget) this.#isNavigating = true;

    this.showLoadingState();

    const quickViewBody =
      morphTarget === "quickview"
        ? this.closest(".quickview-body-content")
        : null;

    let fetchUrl = requestUrl;
    if (quickViewBody) {
      const base = requestUrl.split("?")[0];
      const qs = requestUrl.includes("?") ? `&${requestUrl.split("?")[1]}` : "";
      fetchUrl = `${base}?section_id=quick-view${qs}`;
    }

    fetch(fetchUrl, { signal: this.#abortController.signal })
      .then((response) => response.text())
      .then((responseText) => {
        if (requestId !== this.#requestId) return;
        this.#pendingRequestUrl = undefined;
        const html = new DOMParser().parseFromString(responseText, "text/html");

        if (quickViewBody) {
          const newBody = html.querySelector(".quickview-body-content");
          if (newBody) {
            quickViewBody.innerHTML = newBody.innerHTML;
            quickViewBody.querySelectorAll("volume-pricing").forEach((el) => {
              if (typeof el.connectedCallback === "function")
                el.connectedCallback();
            });
            quickViewBody.querySelectorAll("price-per-item").forEach((el) => {
              if (typeof el.connectedCallback === "function")
                el.connectedCallback();
            });
            quickViewBody.querySelectorAll("quantity-input").forEach((el) => {
              if (typeof el.init === "function") el.init();
            });
          }
        } else if (morphTarget === "main") {
          const newMain = html.querySelector("main");
          if (newMain) {
            // Full-page response (?variant= fetch) — swap entire <main>
            const main = document.querySelector("main");
            if (main) {
              main.innerHTML = newMain.innerHTML;
              if (html.title) document.title = html.title;
              if (window.lazySizes) {
                window.lazySizes.autoSizer.checkElems();
              } else {
                main.querySelectorAll("img[data-src]").forEach((img) => {
                  img.src = img.dataset.src;
                });
              }
              if (typeof themeAllSliderInt === "function")
                themeAllSliderInt(main);
              main.querySelectorAll("[data-flickity]").forEach((el) => {
                if (!el.classList.contains("flickity-enabled"))
                  themeSlidersInit(el);
              });
            }
          } else {
            // Section rendering response (?option_values=&section_id= fetch) — swap section
            const newSection = html.querySelector(".shopify-section");
            const currentSection = this.closest(".shopify-section");
            if (newSection && currentSection) {
              currentSection.id = newSection.id;
              currentSection.className = newSection.className;
              currentSection.innerHTML = newSection.innerHTML;
              const titleEl = currentSection.querySelector("h1");
              if (titleEl) document.title = titleEl.textContent.trim();
              if (window.lazySizes) {
                window.lazySizes.autoSizer.checkElems();
              } else {
                currentSection
                  .querySelectorAll("img[data-src]")
                  .forEach((img) => {
                    img.src = img.dataset.src;
                  });
              }
              if (typeof themeAllSliderInt === "function")
                themeAllSliderInt(currentSection);
              currentSection
                .querySelectorAll("[data-flickity]")
                .forEach((el) => {
                  if (!el.classList.contains("flickity-enabled"))
                    themeSlidersInit(el);
                });
            }
          }
        } else {
          this.updateVariantPicker(html);
        }

        this.#isNavigating = false;
        this.hideLoadingState();
      })
      .catch((error) => {
        this.#isNavigating = false;
        if (error.name === "AbortError") return;
        console.error(error);
        this.hideLoadingState();
      });
  }

  updateVariantPicker(html) {
    const sectionId = this.dataset.originalSection || this.dataset.section;

    // Replace the picker's inner HTML with the server-rendered version so option groups
    // (fieldsets) reflect what the server returned — e.g. Oxygen won't have Color/Skill/Gender
    // if those have no valid variants, matching the server-side rendering in Horizon.
    const tagName = this.tagName.toLowerCase();
    const responsePicker =
      html.querySelector(`${tagName}[data-section="${sectionId}"]`) ||
      html.querySelector(
        `${tagName}[data-section="${this.dataset.section}"]`,
      ) ||
      html.querySelector(tagName);
    if (responsePicker) {
      this.innerHTML = responsePicker.innerHTML;
      // Restore runtime data-current-checked from the server-rendered checked state
      this.querySelectorAll("fieldset").forEach((fieldset) => {
        const checkedInput = fieldset.querySelector(
          'input[type="radio"]:checked',
        );
        fieldset.querySelectorAll(".swatch-option").forEach((input) => {
          input.dataset.currentChecked =
            input === checkedInput ? "true" : "false";
        });
      });
      this.updateOptions();
      this.updateMasterId();
      this.showInitialAvailability();
      this.updateVariantClass();
    }

    const priceSource = html.getElementById(`price-${sectionId}`);
    const priceDestination = document.getElementById(
      `price-${this.dataset.section}`,
    );
    const skuSource = html.getElementById(`Sku-${sectionId}`);
    const skuDestination = document.getElementById(
      `Sku-${this.dataset.section}`,
    );
    const inventorySource = html.getElementById(`Inventory-${sectionId}`);
    const inventoryDestination = document.getElementById(
      `Inventory-${this.dataset.section}`,
    );

    if (priceSource && priceDestination) {
      priceDestination.innerHTML = priceSource.innerHTML;
      priceDestination.classList.remove("visibility-hidden");
    }

    if (inventorySource && inventoryDestination) {
      inventoryDestination.innerHTML = inventorySource.innerHTML;
      inventoryDestination.classList.toggle(
        "visibility-hidden",
        inventorySource.innerText.trim() === "",
      );
    }

    if (skuDestination) {
      if (skuSource) {
        skuDestination.textContent = skuSource.textContent;
        skuDestination
          .closest(".pro-sku-box")
          ?.classList.remove("visibility-hidden");
      } else {
        skuDestination
          .closest(".pro-sku-box")
          ?.classList.add("visibility-hidden");
      }
    }

    const responseVariantScript = html.querySelector("[data-selected-variant]");
    if (responseVariantScript) {
      try {
        const responseVariant = JSON.parse(responseVariantScript.textContent);
        if (responseVariant && responseVariant.id) {
          this.currentVariant = responseVariant;
          this.updateSelectedVariantScript(responseVariant);
          this.updateMedia();
        }
      } catch (_) {}
    }

    this.updateButtonFromResponse(html);

    if (!this.currentVariant) return;

    this.updateVariantInput();
    this.updatePickupAvailability();
  }

  updateButtonFromResponse(html) {
    const productForm = document.getElementById(
      `product-form-${this.dataset.section}`,
    );
    if (!productForm) return;

    const liveButton = productForm.querySelector('[name="add"]');
    const liveButtonText = productForm.querySelector("[data-addtocart-text]");
    if (!liveButton) return;

    const responseButton = html.querySelector('[name="add"]');
    const responseButtonText = html.querySelector("[data-addtocart-text]");

    if (responseButton) {
      if (responseButton.hasAttribute("disabled")) {
        liveButton.setAttribute("disabled", "disabled");
        liveButton.setAttribute("aria-disabled", "true");
      } else {
        liveButton.removeAttribute("disabled");
        liveButton.removeAttribute("aria-disabled");
      }
      if (liveButtonText && responseButtonText) {
        liveButtonText.textContent = responseButtonText.textContent.trim();
      }
    } else {
      const inventoryQty = Number(this.currentVariant?.inventory_quantity);
      const inventoryManaged = this.currentVariant?.inventory_management === 'shopify';
      const isZeroStock = inventoryManaged && !Number.isNaN(inventoryQty) && inventoryQty <= 0;
      const isAvailable = (this.currentVariant?.available ?? false) && !isZeroStock;
      this.toggleAddButton(
        !isAvailable,
        isAvailable ? null : window.variantStrings?.soldOut || "OUT OF STOCK",
      );
    }
  }

  updateElement(newHtml, elementSelector) {
    const element = this.closest(elementSelector);
    const newElement = newHtml.querySelector(elementSelector);
    if (!element || !newElement) return;
    element.innerHTML = newElement.innerHTML;
  }

  updateMain(newHtml) {
    const main = document.querySelector("main");
    const newMain = newHtml.querySelector("main");
    if (!main || !newMain) return;
    main.innerHTML = newMain.innerHTML;
  }

  get selectedOption() {
    const selectedOption = this.querySelector(
      "select option[selected], fieldset input:checked",
    );
    if (
      !(
        selectedOption instanceof HTMLInputElement ||
        selectedOption instanceof HTMLOptionElement
      )
    ) {
      return undefined;
    }
    return selectedOption;
  }

  get selectedOptionId() {
    const { selectedOption } = this;
    if (!selectedOption) return undefined;
    return selectedOption.dataset.optionValueId;
  }

  updateOther() {
    if (this.dataset.updateUrl !== "false" && this.other.length) {
      let fieldsets = this.other[0].querySelectorAll("fieldset"),
        fieldsetsArray = Array.from(fieldsets);
      var filteredArray = this.options.filter(function (element) {
        return element !== null && element !== undefined && element !== "";
      });
      Array.from(filteredArray).forEach(function (option, i) {
        fieldsetsArray.forEach(function (fieldsetsArrayValue) {
          if (fieldsetsArrayValue.querySelector("select")) {
            if (option != null) {
              if (
                fieldsetsArrayValue.querySelector(
                  `select option[value="${option}"]`,
                )
              ) {
                fieldsetsArrayValue.querySelector(
                  `select option[value="${option}"]`,
                ).selected = true;
              }
            }
          } else if (fieldsetsArrayValue.querySelectorAll("input").length) {
            if (fieldsetsArrayValue.querySelector(`input[value="${option}"]`)) {
              if (
                fieldsetsArrayValue.querySelector(
                  ".swatches-list-item.active, .product-swatch-item.active",
                )
              ) {
                fieldsetsArrayValue
                  .querySelector(
                    ".swatches-list-item.active, .product-swatch-item.active",
                  )
                  .classList.remove("active");
              }
              fieldsetsArrayValue
                .querySelector(`input[value="${option}"]`)
                .closest(".swatches-list-item, .product-swatch-item")
                .classList.add("active");
              fieldsetsArrayValue.querySelector(
                `input[value="${option}"]`,
              ).checked = true;
            }
          }
        });
      });
      this.other[0].updateOptions();
      this.other[0].updateMasterId();
    }
  }

  updateOptions() {
    this.options = [];

    const selects = Array.from(this.querySelectorAll("select"));
    selects.forEach((select) => {
      if (select.value) {
        this.options.push(select.value);
      }
    });

    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    fieldsets.forEach((fieldset) => {
      const checkedRadio = fieldset.querySelector(
        "input[type='radio']:checked",
      );
      if (checkedRadio && checkedRadio.value) {
        this.options.push(checkedRadio.value);
      }
    });

    this.options = this.options.filter(
      (option) => option && option.trim() !== "",
    );
  }

  updateMasterId() {
    this.currentVariant = this.getCurrentVariantData();
  }

  isHidden(elem) {
    const styles = window.getComputedStyle(elem);
    return styles.display === "none" || styles.visibility === "hidden";
  }

  updateMedia(attempts = 0) {
    if (!this.currentVariant?.featured_media) return;

    const mediaGalleries = document.querySelector(
      `[id^="mediaGallery-${this.dataset.section}"]`,
    );
    if (!mediaGalleries) {
      if (attempts < 5) {
        setTimeout(() => this.updateMedia(attempts + 1), 100 * (attempts + 1));
      }
      return;
    }

    const mediaWrapper = mediaGalleries.querySelector("[data-main-media]");
    const featuredMediaWrapper = mediaGalleries.querySelector(
      "[data-featured-product-media]",
    );

    let mediaVariant = mediaGalleries.querySelector(
      `#product-media-${this.currentVariant.featured_media.id}`,
    );

    if (!mediaVariant) {
      mediaVariant = mediaGalleries.querySelector(
        `[data-media-id="${this.currentVariant.featured_media.id}"]`,
      );
    }

    if (!mediaVariant) return;

    if (mediaVariant && mediaWrapper) {
      const childCount = mediaWrapper.children.length;
      const firstChild = mediaWrapper.firstChild;
      if (childCount > 1) {
        mediaWrapper.insertBefore(mediaVariant, firstChild);
      }
    } else if (mediaVariant && featuredMediaWrapper) {
      if (featuredMediaWrapper.classList.contains("flickity-enabled")) {
        const itemIndex = Array.from(
          mediaVariant.parentElement.children,
        ).indexOf(mediaVariant);
        const slider = Flickity.data(featuredMediaWrapper);
        if (slider) {
          slider.select(itemIndex);
        }
      }
    }
  }

  updateURL() {
    if (
      this.closest(".section-main-product") &&
      this.dataset.updateUrl !== "false"
    ) {
      if (!this.currentVariant) return;

      if (this.hasUserInteracted) {
        window.history.replaceState({}, "", this.dataset.url);
      }
    }
    return;
  }

  updateVariantInput() {
    if (!this.currentVariant) return;

    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`,
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      if (input) {
        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  }

  showInitialAvailability() {
    const inputWrappers = [...this.querySelectorAll(".product-form__controls")];
    inputWrappers.forEach((wrapper) => {
      const inputs = [
        ...wrapper.querySelectorAll('input[type="radio"], option'),
      ];
      this.syncVisualStates(inputs);
    });
  }

  syncVisualStates(optionInputs) {
    optionInputs.forEach((input) => {
      const parentItem = input.closest(".product-swatch-item");

      if (input.tagName === "OPTION") {
        input.innerText = input.getAttribute("value");
      } else if (input.tagName === "INPUT") {
        const isUnavailable = input.getAttribute("aria-disabled") === "true";
        input.classList.toggle("disabled", isUnavailable);
        if (parentItem) {
          parentItem.classList.toggle("unavailable", isUnavailable);
          parentItem.classList.toggle("available", !isUnavailable);
        }
      }
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector("pickup-availability");
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute("available");
      pickUpAvailability.innerHTML = "";
    }
  }

  get selectedOptionsValues() {
    return Array.from(
      this.querySelectorAll(
        'select option:checked, fieldset input[type="radio"]:checked',
      ),
    )
      .map((el) => el.dataset.optionValueId || null)
      .filter(Boolean);
  }

  updateAvailabilityFromResponse(html) {
    const liveWrappers = [...this.querySelectorAll(".product-form__controls")];

    liveWrappers.forEach((wrapper) => {
      const liveSelect = wrapper.querySelector("select");

      if (liveSelect) {
        const responseSelect = [...html.querySelectorAll("select")].find(
          (s) => s.name === liveSelect.name,
        );
        if (!responseSelect) return;

        const currentValue = liveSelect.value;
        liveSelect.innerHTML = "";

        [...responseSelect.querySelectorAll("option")].forEach((opt) => {
          if (!opt.disabled) {
            liveSelect.appendChild(opt.cloneNode(true));
          }
        });

        if (liveSelect.querySelector(`option[value="${currentValue}"]`)) {
          liveSelect.value = currentValue;
        } else if (liveSelect.options.length > 0) {
          liveSelect.value = liveSelect.options[0].value;
        }

        this.syncVisualStates([...liveSelect.querySelectorAll("option")]);
      } else {
        const liveInputs = [...wrapper.querySelectorAll('input[type="radio"]')];

        if (liveInputs.length <= 1) {
          this.syncVisualStates(liveInputs);
          return;
        }

        const allResponseInputs = [
          ...html.querySelectorAll('input[type="radio"]'),
        ];

        liveInputs.forEach((input) => {
          const responseInput = allResponseInputs.find(
            (r) => r.name === input.name && r.value === input.value,
          );

          // If no matching input in response (e.g., combined-listing nav option not present),
          // preserve the existing state rather than defaulting to available.
          if (!responseInput) return;

          const isAvailable = responseInput.dataset.optionAvailable !== "false";

          input.setAttribute("aria-disabled", isAvailable ? "false" : "true");
          input.dataset.optionAvailable = String(isAvailable);

          const parentItem = input.closest(".product-swatch-item");
          if (parentItem) {
            parentItem.classList.toggle("available", isAvailable);
            parentItem.classList.toggle("unavailable", !isAvailable);
          }
        });

        this.syncVisualStates(liveInputs);
      }
    });

    this.updateVariantClass();
    this.updateOptions();
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(
      `product-form-${this.dataset.section}`,
    );
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector("[data-addtocart-text]");
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute("aria-disabled", "true");
      addButton.setAttribute("disabled", "disabled");
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute("aria-disabled");
      addButton.removeAttribute("disabled");
      addButtonText.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(
      `product-form-${this.dataset.section}`,
    );
    const addButton = button?.querySelector('[name="add"]');
    const price = document.getElementById(`price-${this.dataset.section}`);
    const inventory = document.getElementById(
      `Inventory-${this.dataset.section}`,
    );
    const sku = document.getElementById(`Sku-${this.dataset.section}`);

    if (!addButton) return;
    this.toggleAddButton(true, window.variantStrings.unavailable);
    if (price) price.classList.add("visibility-hidden");
    if (inventory) inventory.classList.add("visibility-hidden");
    if (sku) sku.classList.add("visibility-hidden");
  }

  getVariantData() {
    console.warn(
      "getVariantData() is deprecated. Use Section Rendering API instead.",
    );
    return [];
  }

  getCurrentVariantData() {
    const script = this.querySelector("[data-selected-variant]");
    if (!script) return null;

    try {
      return JSON.parse(script.textContent);
    } catch (error) {
      console.error("Invalid JSON in selected variant data:", error);
      console.error("JSON content:", script.textContent);
      return null;
    }
  }

  updateSelectedVariantScript(variant) {
    const variantScript = this.querySelector("[data-selected-variant]");
    if (variantScript) {
      variantScript.textContent = JSON.stringify(variant);
    }
  }

  showLoadingState() {
    const addButton = document.querySelector(
      `#product-form-${this.dataset.section} [name="add"]`,
    );
    if (addButton) {
      addButton.classList.add("loading");
      addButton.setAttribute("aria-busy", "true");
    }
  }

  hideLoadingState() {
    const addButton = document.querySelector(
      `#product-form-${this.dataset.section} [name="add"]`,
    );
    if (addButton) {
      addButton.classList.remove("loading");
      addButton.removeAttribute("aria-busy");
    }
  }
  updateVariantClass() {
    const swatchesItems = Array.from(
      this.querySelectorAll(".product-swatch-item"),
    );
    swatchesItems.forEach(function (swatchesItem) {
      swatchesItem.classList.remove("active");

      const currentInput = swatchesItem.querySelector(
        '.swatch-option[data-current-checked="true"]',
      );
      if (currentInput) {
        swatchesItem.classList.add("active");
      }

      const input = swatchesItem.querySelector(".swatch-option");
      if (input) {
        const isDisabled =
          input.getAttribute("aria-disabled") === "true" ||
          input.classList.contains("disabled");
        swatchesItem.classList.toggle("unavailable", isDisabled);
        swatchesItem.classList.toggle("available", !isDisabled);
      }
    });
  }
}

customElements.define("variant-selects", VariantSelector);

class VariantRadios extends VariantSelector {
  constructor() {
    super();
  }

  syncVisualStates(optionInputs) {
    optionInputs.forEach((input) => {
      const isDisabled = input.getAttribute("aria-disabled") === "true";
      const parentItem = input.closest(".product-swatch-item");

      input.classList.toggle("disabled", isDisabled);
      if (parentItem) {
        parentItem.classList.toggle("unavailable", isDisabled);
        parentItem.classList.toggle("available", !isDisabled);
      }
    });
  }

  removeErrorMessage() {
    const section = this.closest("section");
    if (!section) return;
    const productForm = section.querySelector("product-form");
    if (productForm) productForm.handleErrorMessage();
  }

  updateOptions() {
    this.options = [];

    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    fieldsets.forEach((fieldset) => {
      const checkedRadio = fieldset.querySelector(
        "input[type='radio']:checked",
      );
      if (checkedRadio && checkedRadio.value) {
        this.options.push(checkedRadio.value);
      }
    });

    this.options = this.options.filter(
      (option) => option && option.trim() !== "",
    );
  }

  showLoadingState() {
    super.showLoadingState();
  }

  hideLoadingState() {
    super.hideLoadingState();
  }

  updateVariantClass() {
    const swatchesItems = Array.from(
      this.querySelectorAll(".product-swatch-item"),
    );
    swatchesItems.forEach((swatchesItem) => {
      swatchesItem.classList.remove("active");

      const currentInput = swatchesItem.querySelector(
        '.swatch-option[data-current-checked="true"]',
      );
      if (currentInput) {
        swatchesItem.classList.add("active");
      }

      const input = swatchesItem.querySelector(".swatch-option");
      if (input) {
        const isDisabled =
          input.getAttribute("aria-disabled") === "true" ||
          input.classList.contains("disabled");
        swatchesItem.classList.toggle("unavailable", isDisabled);
        swatchesItem.classList.toggle("available", !isDisabled);
      }
    });
  }
}
customElements.define("variant-radios", VariantRadios);

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  init() {
    if (this._initialized) return;
    this._initialized = true;
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });

    this.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", this.onButtonClick.bind(this));
      button.addEventListener("keyup", this.onButtonClick.bind(this));
    });

    this.input.addEventListener("focus", this.onInputFocus.bind(this));
    this.input.addEventListener("change", (e) => this.onInputChange(e));
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    const item = event.target.closest(".product_cart-item");
    event.target.name === "plus" ? this.input.stepUp() : this.input.stepDown();
    this._clampToAdjustedMax();
    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent);
  }

  _clampToAdjustedMax() {
    const maxAttr = this.input.getAttribute("max");
    if (maxAttr === null || maxAttr === "") return;
    const max = parseInt(maxAttr, 10);
    const val = parseInt(this.input.value, 10);
    if (!isNaN(max) && !isNaN(val) && val > max) {
      this.input.value = max;
    }
  }

  onInputFocus() {
    this.input.select();
  }

  onInputChange(event) {
    // Skip error clearing when triggered by cart sync (not user interaction)
    if (event && event.detail && event.detail.syncOnly) return;

    const formId = this.input.getAttribute("form");
    const form = formId ? document.getElementById(formId) : null;
    const productForm = form ? form.closest("product-form") : null;
    if (!productForm) return;

    const errorWrapper = productForm.querySelector(
      ".product-form__error-message-wrapper",
    );
    const hasVisibleError =
      errorWrapper && !errorWrapper.hasAttribute("hidden");
    const submitButton = productForm.querySelector('[type="submit"]');
    const isButtonDisabledByError =
      submitButton && submitButton.getAttribute("aria-disabled") === "true";

    if (!productForm.error && !hasVisibleError && !isButtonDisabledByError)
      return;

    productForm.error = false;
    if (typeof productForm.handleErrorMessage === "function") {
      productForm.handleErrorMessage();
    }
    if (submitButton) {
      submitButton.removeAttribute("aria-disabled");
      submitButton.classList.remove("loading");
    }
  }
}

customElements.define("quantity-input", QuantityInput);

class ProductRecommendations extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      fetch(this.dataset.url)
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;
          const recommendations = html.querySelector("product-recommendations");
          if (recommendations && recommendations.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML;
            colorMediaInit();
          }
          if (this.querySelector("[data-flickity-slider]")) {
            let slider = Flickity.data(
              this.querySelector("[data-flickity-slider]"),
            );
            themeSlidersInit(
              $(
                "#" +
                  this.querySelector("[data-flickity-slider]").getAttribute(
                    "id",
                  ),
              ),
            );
            if (animationCheck) {
              if (AOS) {
                AOS.refreshHard();
              }
            }
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    new IntersectionObserver(handleIntersection.bind(this), {
      rootMargin: "0px 0px 400px 0px",
    }).observe(this);
  }
}

customElements.define("product-recommendations", ProductRecommendations);

class SideDrawer extends HTMLElement {
  constructor() {
    super();
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll("[data-sideDrawer-open]").forEach((openMenu) =>
      openMenu.addEventListener("click", this.openDrawer.bind(this)),
    );
    this.querySelectorAll("[data-sideDrawer-close]").forEach((button) =>
      button.addEventListener("click", this.closeDrawer.bind(this)),
    );
  }
  openDrawer(event) {
    event.preventDefault();
    const openElement = event.currentTarget;
    let openElementId = openElement.getAttribute("href");
    if (document.querySelector(openElementId).classList.contains("active"))
      return false;
    let elementSelector = document.querySelector(openElementId);

    elementSelector.classList.add("active");
    if (openElementId == "#languange-currency-drawer") {
      document.querySelector("body").classList.add("side-drawer-body-open");
    }
    if (openElementId == "#size-chart-drawer") {
      document
        .querySelector("body")
        .classList.add("side-drawer-sizechart-open");
      setTimeout(function () {
        focusElement == "" && (focusElement = openElement);
        findInsiders($(elementSelector));
      }, 500);
    } else {
      setTimeout(function () {
        focusElement == "" && (focusElement = openElement);
        trapFocusElements(
          elementSelector.querySelector(".side-drawer-modal-inner"),
        );
      }, 500);
    }
    document.querySelector("body").classList.add("no-scroll");
  }

  closeDrawer(event) {
    event.preventDefault();
    const closeElement = event.currentTarget;
    console.log(closeElement);
    if (closeElement.closest("side-drawer").classList.contains("active")) {
      closeElement.closest("side-drawer").classList.remove("active");
      if (
        document
          .querySelector("body")
          .classList.contains("side-drawer-body-open")
      ) {
        document
          .querySelector("body")
          .classList.remove("side-drawer-body-open");
      }
      if (
        document
          .querySelector("body")
          .classList.contains("side-drawer-sizechart-open")
      ) {
        document
          .querySelector("body")
          .classList.remove("side-drawer-sizechart-open");
      }
      document.querySelector("body").classList.remove("no-scroll");
    }
  }
}
customElements.define("side-drawer", SideDrawer);

var findInsiders = function (elem) {
  var tabbable = elem
    .find("select, input, textarea, button, a")
    .filter(":visible");
  var firstTabbable = tabbable.first();
  var lastTabbable = tabbable.last();
  firstTabbable.focus();
  lastTabbable.on("keydown", function (e) {
    if (e.which === 9 && !e.shiftKey) {
      e.preventDefault();
      firstTabbable.focus();
    }
  });

  firstTabbable.on("keydown", function (e) {
    if (e.which === 9 && e.shiftKey) {
      e.preventDefault();
      lastTabbable.focus();
    }
  });

  elem.on("keyup", function (e) {
    if (e.keyCode === 27) {
      elem.hide();
    }
  });
};
class ProductRecentlyViewed extends HTMLElement {
  constructor() {
    super();
    const productId = parseInt(this.dataset.productId);
    const cookieName = "paris-recently-viewed";
    const items = JSON.parse(window.localStorage.getItem(cookieName) || "[]");
    if (!items.includes(productId)) {
      items.unshift(productId);
    }

    window.localStorage.setItem(cookieName, JSON.stringify(items.slice(0, 6)));
  }
}
customElements.define("product-recently-viewed", ProductRecentlyViewed);
class RecentlyViewProducts extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    fetch(this.dataset.url + this.getQueryStringData())
      .then((response) => response.text())
      .then((text) => {
        const html = document.createElement("div");
        html.innerHTML = text;
        const recommendations = html.querySelector("recently-view-products");
        if (recommendations && recommendations.innerHTML.trim().length) {
          this.innerHTML = recommendations.innerHTML;
          let totalitem = recommendations.querySelectorAll(
            ".product-media-cards",
          ).length;
          if (
            recommendations
              .querySelector(".recently-viewed-wrapper")
              .innerHTML.trim().length != 0
          ) {
            this.closest(".shopify-section").classList.remove("hidden");
          }
          colorMediaInit();
          if (this.querySelector("[data-flickity-slider]") && totalitem > 4) {
            let slider = Flickity.data(
              this.querySelector("[data-flickity-slider]"),
            );
            themeSlidersInit(
              $(
                "#" +
                  this.querySelector("[data-flickity-slider]").getAttribute(
                    "id",
                  ),
              ),
            );
          }
          if (animationCheck) {
            if (AOS) {
              AOS.refreshHard();
            }
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  getQueryStringData() {
    const cookieName = "paris-recently-viewed";
    const items = JSON.parse(window.localStorage.getItem(cookieName) || "[]");
    if (
      this.dataset.productId &&
      items.includes(parseInt(this.dataset.productId))
    ) {
      items.splice(items.indexOf(parseInt(this.dataset.productId)), 1);
    }
    return items
      .map((item) => "id:" + item)
      .slice(0, 6)
      .join(" OR ");
  }
}
customElements.define("recently-view-products", RecentlyViewProducts);
class MovingCursor extends HTMLElement {
  constructor() {
    super();
    //if (theme.config.isTouch) return;
    this.config = {
      posX: 0,
      posY: 0,
    };
    if (
      this.closest(".side-drawer-panel") ||
      this.closest(".modal-drawer-panel")
    ) {
      let drawerValue =
        this.closest(".side-drawer-panel") ||
        this.closest(".modal-drawer-panel");
      // if(this.closest(".side-drawer-panel")){
      //    drawerValue= this.closest(".side-drawer-panel")
      // }else{
      //   drawerValue=  this.closest(".modal-drawer-panel")
      // }

      if (window.innerWidth > 1021) {
        drawerValue.addEventListener("mousemove", (event) => {
          this.config.posX += (event.clientX - this.config.posX) / 4;
          this.config.posY += (event.clientY - this.config.posY) / 4;

          this.style.setProperty("--mouse-left", `${this.config.posX}px`);
          this.style.setProperty("--mouse-top", `${this.config.posY}px`);
        });
      }
    }
  }
}
customElements.define("moving-cursor", MovingCursor);

document.addEventListener("keydown", function (event) {
  if (event.keyCode == 27) {
    let drawerElementsActives = document.querySelectorAll(
      ".side-drawer-panel.active,[data-model-main-body].active",
    );
    Array.from(drawerElementsActives).forEach(function (drawerElement) {
      document.querySelector("body").classList.remove("no-scroll");
      document
        .querySelector("body")
        .classList.remove(
          "side-drawer-body-open,search-open,predictive-search--focus",
        );
      drawerElement.classList.remove("active");
      (removeTrapFocus(),
        focusElement && (focusElement.focus(), (focusElement = "")));
    });

    let sortingFilter = document.querySelector(".facet-filters-sort[open]");
    if (sortingFilter) {
      sortingFilter.removeAttribute("open");
    }
  }
});

var ytplayerList;
function onPlayerReady(e) {
  var video_data = e.target.getVideoData(),
    label = video_data.video_id + ":" + video_data.title;
  e.target.ulabel = label;
}

function onPlayerError(e) {
  console.log("[onPlayerError]");
}
function onPlayerStateChange(e) {
  var label = e.target.ulabel;
  if (e["data"] == YT.PlayerState.PLAYING) {
    pauseOthersYoutubes(e.target);
  }

  if (e["data"] == YT.PlayerState.PAUSED) {
  }

  if (e["data"] == YT.PlayerState.ENDED) {
  }

  if (e["data"] == YT.PlayerState.BUFFERING) {
    e.target.uBufferingCount
      ? ++e.target.uBufferingCount
      : (e.target.uBufferingCount = 1);
    console.log({
      event: "youtube",
      action:
        "buffering[" +
        e.target.uBufferingCount +
        "]:" +
        e.target.getPlaybackQuality(),
      label: label,
    });

    if (YT.PlayerState.UNSTARTED == e.target.uLastPlayerState) {
      pauseOthersYoutubes(e.target);
    }
  }
  if (e.data != e.target.uLastPlayerState) {
    e.target.uLastPlayerState = e.data;
  }
}

function initYoutubePlayers() {
  ytplayerList = null;
  ytplayerList = [];
  for (var e = document.getElementsByTagName("iframe"), x = e.length; x--; ) {
    if (/youtube.com\/embed/.test(e[x].src)) {
      ytplayerList.push(initYoutubePlayer(e[x]));
    }
  }
}

function pauseOthersYoutubes(currentPlayer) {
  if (!currentPlayer) return;
  for (var i = ytplayerList.length; i--; ) {
    if (ytplayerList[i] && ytplayerList[i] != currentPlayer) {
      ytplayerList[i].pauseVideo();
    }
  }
  document
    .querySelectorAll("iframe[src*='player.vimeo.com']")
    .forEach((video) => {
      if (
        video.getAttribute("data-autoplay") == "true" ||
        video.hasAttribute("autoplay")
      )
        return false;
      video.contentWindow.postMessage('{"method":"pause"}', "*");
    });
  document.querySelectorAll("video").forEach((video) => {
    if (
      video.getAttribute("data-autoplay") == "true" ||
      video.hasAttribute("autoplay")
    )
      return false;
    video.pause();
  });
}

function initYoutubePlayer(ytiframe) {
  var ytp = new YT.Player(ytiframe, {
    events: {
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
      onReady: onPlayerReady,
    },
  });
  ytiframe.ytp = ytp;
  return ytp;
}

function onYouTubeIframeAPIReady() {
  initYoutubePlayers();
}

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
function videoTagPause(section = document) {
  document.querySelectorAll("video").forEach((video) => {
    video.onplay = function (event) {
      let checkCurrent = event.target;
      document
        .querySelectorAll("iframe[src*='player.vimeo.com']")
        .forEach((video) => {
          if (
            video.getAttribute("data-autoplay") == "true" ||
            video.hasAttribute("autoplay")
          )
            return false;
          video.contentWindow.postMessage('{"method":"pause"}', "*");
        });
      document
        .querySelectorAll(
          ".product-media-youtube,.youtube-video,iframe[src*='www.youtube.com']",
        )
        .forEach((video) => {
          if (
            video.getAttribute("data-autoplay") == "true" ||
            video.hasAttribute("autoplay")
          )
            return false;
          video.contentWindow.postMessage(
            '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
            "*",
          );
        });
      document.querySelectorAll("video").forEach((video) => {
        if (
          video.getAttribute("data-autoplay") == "true" ||
          video.hasAttribute("autoplay")
        )
          return false;
        if (checkCurrent != video) {
          video.pause();
        }
      });
    };
  });
  document
    .querySelectorAll("iframe[src*='player.vimeo.com']")
    .forEach((video) => {
      var player = new Vimeo.Player(video);
      player.on("play", function (event) {
        let checkCurrent = event.target;

        document
          .querySelectorAll(
            ".product-media-youtube,.youtube-video,iframe[src*='www.youtube.com']",
          )
          .forEach((video) => {
            if (
              video.getAttribute("data-autoplay") == "true" ||
              video.hasAttribute("autoplay")
            )
              return false;
            video.contentWindow.postMessage(
              '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
              "*",
            );
          });
        document.querySelectorAll("video").forEach((video) => {
          if (
            video.getAttribute("data-autoplay") == "true" ||
            video.hasAttribute("autoplay")
          )
            return false;
          video.pause();
        });
        if (window.ProductModel) window.ProductModel.loadShopifyXR();
      });
    });
}
