// const API_KEY = "b3bf8fc023ca4366870bffb39cc1edb6";
const API_KEY = "e88130e05cfa87840442d20d29baa8f3";
$(function () {
  var myLazyLoad = new LazyLoad();

  myLazyLoad.update();
  $(".link").on("click", function (event) {
    event.preventDefault();
    const id = $(this).attr("href"),
      top = $(id).offset().top;

    $("body,html").animate({ scrollTop: top - 80 }, 1500);
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
    thumbnail: true,
  });

  $("#feedback-form").on("submit", function (e) {
    e.preventDefault();
    const name = $("#user-name").val();
    const email = $("#user-email").val();
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
    autoplaySpeed: 3000,
  });

  checkEmail("#user-email");

  $("#submit-btn").click(function (e) {
    e.preventDefault();
    if (
      $("#user-name").val().trim() !== "" &&
      isEmailValid($("#user-email").val())
    ) {
      $("#feedback-form").submit();
    }
  });
});

function checkEmail(el) {
  $(el).on("input", () => {
    if (isEmailValid($(el).val())) {
      $(el).css("border-color", "green");
    } else {
      $(el).css("border-color", "red");
    }
  });
}

function isEmailValid(value) {
  const EMAIL_REGEXP =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
  return EMAIL_REGEXP.test(value);
}

function newsHTML(news) {
  return `
<div class="wrap">
  <div class="news-item">
  <a href="${news.url}" target="_blank" class="link"></a>
    <div class="img-wrap"><img data-lazy="${news.image}" alt="img" /></div>
    <div class="info">
      <div class="text-wrap">
        <h4 class="title">${news.title}</h4>
        <p class="text">${news.content}</p>
      </div>
      <div class="author">
        <div class="avatar" >
          <img data-lazy="assets/images/section-3/avatar.svg"  alt="img" class="lazy"/>
        </div>
        <div class="author-name">
          <p class="name">${news.source.name}</p>
          <p class="date">${news.publishedAt}</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

function getNews() {
  axios
    .get(
      "https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=" +
        API_KEY
    )
    .then((resp) => {
      let list = "";
      resp.data.articles.forEach((news) => {
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
        responsive: [
          {
            breakpoint: 1408,
            settings: {
              centerMode: true,
              arrows: false,
            },
          },

          {
            breakpoint: 1227,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              centerMode: true,
              dots: false,
              arrows: false,
            },
          },
          {
            breakpoint: 952,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              dots: true,
              arrows: false,
            },
          },
        ],
      });
    });
}
$("#map-img").on("click", () => {
  $("#map-img").css("display", "none");
  showMap();
});
function showMap() {
  const map = L.map("map", {
    scrollWheelZoom: false,
    gestureHandling: true,
  }).setView([40.6687, -73.8896], 13);
  const myMarker = L.icon({
    iconUrl: "assets/images/section-5/Marker.svg",
    iconSize: [106, 106],
    className: "blinking",
  });
  L.tileLayer(
    "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }
  ).addTo(map);

  L.marker([40.68058, -73.89976], { icon: myMarker }).addTo(map);
}

function submitFeedback(name, email) {
  const BOT_TOKEN = "6241383538:AAGsGDi_N86cjc1FsOnB9tWmEg96FdP2p-c";
  const CHAT_ID = "-1001801264330";
  const text = ` Name:  ${name}
Email:  ${email}
  `;
  console.log(text);
  axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: text,
  });
}

function myToast() {
  const html = `<div id="toast">
  Data sent successfully!
  </div>`;
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
