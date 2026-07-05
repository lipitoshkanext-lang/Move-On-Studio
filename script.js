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

const directionSelect = (() => {
  const wrapper = document.querySelector("[data-select]");

  if (!wrapper) {
    return null;
  }

  const trigger = wrapper.querySelector("#booking-direction-trigger");
  const list = wrapper.querySelector("#booking-direction-list");
  const hiddenInput = wrapper.querySelector("#booking-direction");
  const valueLabel = trigger.querySelector("[data-select-value]");
  const errorEl = wrapper.querySelector("#booking-direction-error");
  const options = Array.from(list.querySelectorAll("li[role='option']"));
  let activeIndex = -1;

  const isOpen = () => !list.hidden;

  const setActive = (index) => {
    activeIndex = index;
    options.forEach((option, i) => {
      option.toggleAttribute("data-active", i === index);
    });
  };

  const open = () => {
    list.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    const selectedIndex = options.findIndex((option) => option.getAttribute("aria-selected") === "true");
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
  };

  const close = () => {
    list.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    setActive(-1);
  };

  const clearError = () => {
    trigger.removeAttribute("data-error");
    errorEl.classList.add("hidden");
  };

  const selectOption = (option) => {
    options.forEach((item) => item.removeAttribute("aria-selected"));
    option.setAttribute("aria-selected", "true");
    hiddenInput.value = option.dataset.value ?? "";
    valueLabel.textContent = option.dataset.value ?? "";
    trigger.setAttribute("data-filled", "true");
    clearError();
    close();
    trigger.focus();
  };

  trigger.addEventListener("click", () => {
    if (isOpen()) {
      close();
    } else {
      open();
    }
  });

  options.forEach((option) => {
    option.addEventListener("click", () => selectOption(option));
  });

  trigger.addEventListener("keydown", (event) => {
    if (!isOpen() && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      open();
      return;
    }

    if (!isOpen()) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(Math.min(activeIndex + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (event.key === "Enter" || event.key === " ") {
      if (activeIndex >= 0) {
        event.preventDefault();
        selectOption(options[activeIndex]);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  });

  document.addEventListener("click", (event) => {
    if (!wrapper.contains(event.target)) {
      close();
    }
  });

  return {
    getValue: () => hiddenInput.value,
    showError: () => {
      trigger.setAttribute("data-error", "true");
      errorEl.classList.remove("hidden");
      trigger.focus();
    },
  };
})();

const STUDIO_WHATSAPP_NUMBER = "79891209011";
const bookingForm = document.querySelector("#booking-form");

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(bookingForm);
    const name = data.get("name")?.toString().trim() ?? "";
    const phone = data.get("phone")?.toString().trim() ?? "";
    const direction = directionSelect?.getValue() ?? "";
    const time = data.get("time")?.toString().trim() ?? "";

    if (!direction) {
      directionSelect?.showError();
      return;
    }

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
