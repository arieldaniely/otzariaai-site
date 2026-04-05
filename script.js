const galleryButtons = document.querySelectorAll(".gallery-button");
const galleryShots = document.querySelectorAll(".gallery-shot");

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;

    galleryButtons.forEach((item) => {
      item.classList.toggle("is-active", item === button);
      item.setAttribute("aria-selected", String(item === button));
    });

    galleryShots.forEach((shot) => {
      shot.classList.toggle("is-active", shot.dataset.shot === target);
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);

document.querySelectorAll(".reveal").forEach((section) => {
  revealObserver.observe(section);
});

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
