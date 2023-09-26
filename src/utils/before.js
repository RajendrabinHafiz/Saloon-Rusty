export const turnDropdownOff = () => {
  document
    .querySelectorAll(".drop-down")
    .forEach((dropDown) => dropDown.classList.remove("active"));

  return true;
};

window.addEventListener("load", function () {
  document.body.onclick = (event) => {
    if (
      !event.target.matches(".drop-down") &&
      !event.target.matches(".drop-down *") &&
      !event.target.matches(".drop-down-button") &&
      !event.target.matches(".search-container") &&
      !event.target.matches(".search-container *") &&
      !event.target.matches(".drop-down-button *")
    ) {
      turnDropdownOff();
    }
  };
});
