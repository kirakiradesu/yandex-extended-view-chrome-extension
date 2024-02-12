let prevUrl = window.location.pathname;
let cache = {};
let categories = [];

const numberFormater = new Intl.NumberFormat("ru-RU");
const timelife = (t) => {
  const publishedDate = new Date(t * 1000);
  const today = new Date();
  const timeDiff = today - publishedDate;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
};

onInit();

document.addEventListener("click", async function (event) {
  console.log("Произошел клик в документе", window.location.pathname);
  await sleep();
  renderBadges();
});

let lastScrollHeight = document.documentElement.scrollHeight;

function handleScroll() {
  requestAnimationFrame(() => {
    const currentScrollHeight = document.documentElement.scrollHeight;
    if (currentScrollHeight !== lastScrollHeight) {
      console.log("Высота скролла изменилась");
      // Высота скролла изменилась
      // Выполните здесь необходимые действия при изменении высоты скролла
      lastScrollHeight = currentScrollHeight;

      renderBadges();
    }
  });
}

window.addEventListener("scroll", handleScroll);

async function loadGameInfo(appID) {
  return fetch(
    "https://yandex.ru/games/api/catalogue/v2/get_game?lang=ru&draft=false",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appID: parseInt(appID, 10),
        format: "long",
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);

      cache[appID] = { ...data.game };

      return { ...data.game };
    })
    .catch((error) => {
      console.error("Error fetching game info:", error);
    });
}

function locationHashChanged(event) {
  // Обработка изменения хэша в URL
  console.log("Хэш URL изменился:", window.location.hash);
  const appIdMatch = window.location.hash.match(/#app=(\d+)/);
  const appId = appIdMatch ? appIdMatch[1] : null;
  console.log("App ID извлечен из хэша:", appId);
  fetch(
    "https://yandex.ru/games/api/catalogue/v2/get_game?lang=ru&draft=false",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appID: parseInt(appID, 10),
        format: "long",
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Handle the response data
      const qualityInfo = document.createElement("div");
      qualityInfo.textContent = `Кол-во игроков: ${Intl.NumberFormat(
        "ru-RU"
      ).format(data.game.playersCount)} `;

      const publishedDate = new Date(data.game.firstPublished * 1000);
      const today = new Date();
      const timeDiff = today - publishedDate;
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      qualityInfo.textContent += `Опубликовано: ${daysDiff} дней назад`;
      qualityInfo.className = "game-rating-description__text";
      setTimeout(() => {
        document.body
          .querySelector(".game-page__quality-info")
          .appendChild(qualityInfo);
      }, 500);
    })
    .catch((error) => {
      console.error("Error fetching game info:", error);
    });
}

async function onInit() {
  await sleep(1000);

  const initData = JSON.parse(
    document.getElementById("__appState__").innerText
  );
  console.log("initData", initData);

  if (
    initData.currentFeed.categoriesLinking &&
    initData.currentFeed.categoriesLinking.length > 0
  ) {
    categories = [...initData.currentFeed.categoriesLinking];
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const categoryElement = document.querySelector(
        `.category[data-name="${category.name}"]`
      );
      // console.log("categoryElement", categoryElement, category.name);
      if (!categoryElement) {
        continue;
      }
      categoryElement.innerHTML += `
     <span class="category__counter" data-count="${category.gamesCount}" data-nosnippet="true"></span>
    `;
    }
  }

  renderBadges();
}

function renderBadges() {
  document
    .querySelector("#feeds")
    .querySelectorAll(".game-card:not([data-view-ready])")
    .forEach(async (element) => {
      // const template = document.createElement("template");
      // console.log("element", element);
      const template = (props) => `
    
      

      ${
        props.gqRating
          ? `<div title="Рейтинг Яндекс Игр">✪ ${props.gqRating}</div>`
          : ""
      } 
       
      ${
        props.rating
          ? `<div title="Рейтинг игроков">★ ${props.rating}</div>`
          : ""
      } 

      ${
        props.playersCount
          ? `<div title="Кол-во игроков: ${numberFormater.format(
              props.playersCount
            )}">🧑 ${numberFormater.format(props.playersCount)}</div>`
          : ""
      }

      ${
        props.firstPublished
          ? `<div title="Опубликовано: ${timelife(
              props.firstPublished
            )} дней назад">📅 ${timelife(props.firstPublished)} д</div>`
          : ""
      }
    `;

      const gameCardId = element.getAttribute("data-testid").split("-")[1];
      const data = cache[gameCardId]
        ? cache[gameCardId]
        : await loadGameInfo(gameCardId);

      // console.log("render data", data);
      // console.log(
      //   `Game with ID ${gameCardId} is ${
      //     cache[gameCardId] ? "in" : "not in"
      //   } cache`
      // );

      if (element.querySelector(".game-quality-score__value")) {
        // element.removeChild(element.querySelector(".game-quality-score"));
        element.querySelector(".game-quality-score__value").innerHTML =
          template(data);
      } else {
        element.querySelector(
          ".game-card__graphic"
        ).innerHTML += `<div class="game-quality-score game-badges__game-quality-badge">
        <span class="game-quality-score__value new">
            ${template(data)}
            </span>
          </div>`;
      }

      element.setAttribute("data-view-ready", "true");
    });
}

function sleep(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
