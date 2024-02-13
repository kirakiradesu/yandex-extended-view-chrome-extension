(async () => {
  await sleep(1000);

  const overlayPreview = document.createElement("div");
  overlayPreview.className = "overlay-preview";

  document.body.appendChild(overlayPreview);

  document.body.addEventListener("click", (e) => {
    // Extract hash from URL if present
    const urlHash = window.location.hash;
    // Check if the hash matches a specific value
    if (
      urlHash === "#application-info-published" ||
      urlHash === "#application-info-draft"
    ) {
      if (!document.querySelector(".overlay-preview")) {
        document.body.appendChild(overlayPreview);
      }
    }
    if (
      e.target.className !== "form-attach__image" &&
      e.target.className !== "screenshots-table__image"
    )
      return;

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
