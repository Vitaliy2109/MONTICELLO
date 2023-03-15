"use strict";

// const API_KEY = "b3bf8fc023ca4366870bffb39cc1edb6";
var API_KEY = "e88130e05cfa87840442d20d29baa8f3";
$(function () {
  var myLazyLoad = new LazyLoad();
  myLazyLoad.update();
  $(".link").on("click", function (event) {
    event.preventDefault();
    var id = $(this).attr("href"),
        top = $(id).offset().top;
    $("body,html").animate({
      scrollTop: top - 80
    }, 1500);
  });
  $("#feedback-form input").on("focus", function () {
    $(this).next().addClass("active");
  });
  $("#feedback-form input").on("blur", function () {
    if ($(this).val().trim() === "") {
      $(this).next().removeClass("active");
      $(this).css("border-color", "#262a3f1a");
    }
  });
  $(document).on("scroll", function (e) {
    if (window.scrollY >= 30) {
      $("#header").addClass("fixed");
    } else {
      $("#header").removeClass("fixed");
    }
  });
  $("#burger").on("click", function (e) {
    $(this).toggleClass("is-active");
    $("#main-nav").toggleClass("is-open");
  });
  $("#main-nav").on("click", function (e) {
    $(this).toggleClass("is-open");
    $("#burger").toggleClass("is-active");
  });
  getNews();
  lightGallery(document.getElementById("animated-thumbnails-gallery"), {
    thumbnail: true
  });
  $("#feedback-form").on("submit", function (e) {
    e.preventDefault();
    var name = $("#user-name").val();
    var email = $("#user-email").val();
    submitFeedback(name, email);
    myToast();
    $("#user-name").val("");
    $("#user-email").val("");
    return false;
  });
  $(".background-slider").slick({
    arrows: false,
    vertical: true,
    verticalSwiping: true,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000
  });
  checkEmail("#user-email");
  $("#submit-btn").click(function (e) {
    e.preventDefault();

    if ($("#user-name").val().trim() !== "" && isEmailValid($("#user-email").val())) {
      $("#feedback-form").submit();
    }
  });
});

function checkEmail(el) {
  $(el).on("input", function () {
    if (isEmailValid($(el).val())) {
      $(el).css("border-color", "green");
    } else {
      $(el).css("border-color", "red");
    }
  });
}

function isEmailValid(value) {
  var EMAIL_REGEXP = /^(((?:[\0-\x08\x0E-\x1F!#-'\*\+\x2D\/-9=\?A-Z\\\^-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(\.(?:[\0-\x08\x0E-\x1F!#-'\*\+\x2D\/-9=\?A-Z\\\^-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*)|("(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+"))@(((?:[\0-\x08\x0E-\x1F!#-'\*\+\x2D\/-9=\?A-Z\\\^-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+\.)+(?:[\0-\x08\x0E-\x1F!#-'\*\+\x2D\/-9=\?A-Z\\\^-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})$/i;
  return EMAIL_REGEXP.test(value);
}

function newsHTML(news) {
  return "\n<div class=\"wrap\">\n  <div class=\"news-item\">\n  <a href=\"".concat(news.url, "\" target=\"_blank\" class=\"link\"></a>\n    <div class=\"img-wrap\"><img data-lazy=\"").concat(news.image, "\" alt=\"img\" /></div>\n    <div class=\"info\">\n      <div class=\"text-wrap\">\n        <h4 class=\"title\">").concat(news.title, "</h4>\n        <p class=\"text\">").concat(news.content, "</p>\n      </div>\n      <div class=\"author\">\n        <div class=\"avatar\" >\n          <img data-lazy=\"assets/images/section-3/avatar.svg\"  alt=\"img\" class=\"lazy\"/>\n        </div>\n        <div class=\"author-name\">\n          <p class=\"name\">").concat(news.source.name, "</p>\n          <p class=\"date\">").concat(news.publishedAt, "</p>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>");
}

function getNews() {
  axios.get("https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=" + API_KEY).then(function (resp) {
    var list = "";
    resp.data.articles.forEach(function (news) {
      list += newsHTML(news);
    });
    $("#news-slider").html(list);
    $("#news-slider").slick({
      arrows: true,
      dots: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 4000,
      lazyLoad: "ondemand",
      responsive: [{
        breakpoint: 1408,
        settings: {
          centerMode: true,
          arrows: false
        }
      }, {
        breakpoint: 1227,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          centerMode: true,
          dots: false,
          arrows: false
        }
      }, {
        breakpoint: 952,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          dots: true,
          arrows: false
        }
      }]
    });
  });
}

$("#map-img").on("click", function () {
  $("#map-img").css("display", "none");
  showMap();
});

function showMap() {
  var map = L.map("map", {
    scrollWheelZoom: false,
    gestureHandling: true
  }).setView([40.6687, -73.8896], 13);
  var myMarker = L.icon({
    iconUrl: "assets/images/section-5/Marker.svg",
    iconSize: [106, 106],
    className: "blinking"
  });
  L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.marker([40.68058, -73.89976], {
    icon: myMarker
  }).addTo(map);
}

function submitFeedback(name, email) {
  var BOT_TOKEN = "6241383538:AAGsGDi_N86cjc1FsOnB9tWmEg96FdP2p-c";
  var CHAT_ID = "-1001801264330";
  var text = " Name:  ".concat(name, "\nEmail:  ").concat(email, "\n  ");
  console.log(text);
  axios.post("https://api.telegram.org/bot".concat(BOT_TOKEN, "/sendMessage"), {
    chat_id: CHAT_ID,
    text: text
  });
}

function myToast() {
  var html = "<div id=\"toast\">\n  Data sent successfully!\n  </div>";
  document.body.insertAdjacentHTML("afterbegin", html);
  setTimeout(function () {
    $("#toast").addClass("active");
  }, 0);
  setTimeout(function () {
    $("#toast").removeClass("active");
  }, 2000);
  setTimeout(function () {
    $("#toast").remove();
  }, 3000);
}