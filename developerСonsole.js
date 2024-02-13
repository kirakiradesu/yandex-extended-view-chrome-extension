(async () => {
  await sleep(1000);

const overlayPreview = document.createElement("div");
overlayPreview.className = "overlay-preview";

document.body.appendChild(overlayPreview);

document.body.addEventListener("click", (e) => {
  if (e.target.className !== "form-attach__image") return;

  overlayPreview.innerHTML = `<img src="${e.target.src}" style="max-width: 100vw; max-height: 100vh;">`;
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
