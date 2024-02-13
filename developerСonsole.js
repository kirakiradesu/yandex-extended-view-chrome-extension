(async () => {
  await sleep(1000);

const overlayPreview = document.createElement("div");
overlayPreview.className = "overlay-preview";

document.body.appendChild(overlayPreview);

const thumbnailsContainer = document.querySelector(".tabs__tab_mobile");
const tabsContentParent = thumbnailsContainer.closest(".tabs__content");

tabsContentParent.addEventListener("click", (e) => {
const currentImageSrc = e.target.src;
  if (!currentImageSrc) return;

  overlayPreview.innerHTML = `<img src="${currentImageSrc}" style="max-width: 100vw; max-height: 100vh;">`;
  overlayPreview.style.display = "flex";
});

overlayPreview.addEventListener("click", () => {
  overlayPreview.style.display = "none";
});

})();

function sleep(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
