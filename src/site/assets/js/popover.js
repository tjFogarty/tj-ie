(() => {
  function supportsPopover() {
    return HTMLElement.prototype.hasOwnProperty("popover");
  }

  if (!supportsPopover()) {
    const msg = document.querySelector(".popover-not-supported");
    msg.style.display = "block";

    const demo = document.querySelector(".popover-html");
    demo.style.display = "none";
  }
})();
