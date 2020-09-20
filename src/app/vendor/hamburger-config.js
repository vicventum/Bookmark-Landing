// Look for .hamburger
const hamburger = document.getElementById("iconHamburger"),
  header = document.getElementById('header'),
  // body = document.getElementById('body'),
  links = document.querySelectorAll('.nav__link')

// On click
hamburger.addEventListener("click", () => {
  // Toggle class "is-active"
  hamburger.classList.toggle("is-active");
  body.classList.toggle("no-scroll")
  // header.classList.toggle("open");
});

links.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove("is-active");
    body.classList.remove("no-scroll")
    // header.classList.remove("open");
  })
})
