const body = document.body;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("#site-menu");
const revealItems = document.querySelectorAll(".reveal");

const closeMenu = () => {
  if (!menu || !menuToggle) {
    return;
  }

  menu.classList.add("hidden");
  menuToggle.setAttribute("aria-expanded", "false");
  body.classList.remove("menu-open");
};

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const willOpen = menu.classList.contains("hidden");

    menu.classList.toggle("hidden", !willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    body.classList.toggle("menu-open", willOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 768) {
        closeMenu();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      menu.classList.remove("hidden");
      body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      return;
    }

    menu.classList.add("hidden");
  });

  if (window.innerWidth < 768) {
    menu.classList.add("hidden");
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const syncHeader = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

const STUDIO_WHATSAPP_NUMBER = "79891209011";
const bookingForm = document.querySelector("#booking-form");

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(bookingForm);
    const name = data.get("name")?.toString().trim() ?? "";
    const phone = data.get("phone")?.toString().trim() ?? "";
    const direction = data.get("direction")?.toString().trim() ?? "";
    const time = data.get("time")?.toString().trim() ?? "";

    const lines = [
      "Здравствуйте! Хочу записаться на пробное занятие в Move On Studio.",
      `Имя: ${name}`,
      `Телефон для связи: ${phone}`,
      `Направление: ${direction}`,
    ];

    if (time) {
      lines.push(`Удобное время: ${time}`);
    }

    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${STUDIO_WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
  });
}
