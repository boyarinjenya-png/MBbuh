(() => {
  "use strict";

  /* ========== Shared UI ========== */
  const navToggle = document.getElementById("navToggle");
  const header = document.querySelector(".header");
  if (navToggle && header) {
    navToggle.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".header__nav a").forEach((a) => {
      a.addEventListener("click", () => {
        header.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
    const onHeaderScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
    onHeaderScroll();
  }

  const toTop = document.getElementById("toTop");
  if (toTop) {
    const onScroll = () => {
      if (window.scrollY > 500) toTop.classList.add("is-visible");
      else toTop.classList.remove("is-visible");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    onScroll();
  }

  const leadForm = document.getElementById("leadForm");
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(leadForm);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const type = String(data.get("type") || "").trim();
      const comment = String(data.get("comment") || "").trim();
      const text = [
        "Здравствуйте! Заявка с сайта MBbuh.",
        "",
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Форма бизнеса: ${type}`,
        comment ? `Комментарий: ${comment}` : "",
        "",
        "Прошу сделать бесплатный разбор и назвать стоимость сопровождения.",
      ]
        .filter(Boolean)
        .join("\n");
      window.open("https://wa.me/77760053437?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
    });
  }

  /* Reveal on scroll */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      reveals.forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i % 8, 7) * 0.07}s`;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          el.classList.add("is-visible");
        } else {
          io.observe(el);
        }
      });
    } else {
      reveals.forEach((el) => el.classList.add("is-visible"));
    }
  }

  /* Counters */
  const counters = document.querySelectorAll(".js-counter");
  if (counters.length && "IntersectionObserver" in window) {
    const animateCounter = (el) => {
      const target = Number(el.getAttribute("data-target")) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCounter(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* Trust card modals */
  const trustModal = document.getElementById("trustModal");
  if (trustModal) {
    const WA = "https://wa.me/77760053437?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D0%BA%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8E";
    const icon = (d) =>
      `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${d}</svg>`;
    const icons = {
      companies: icon('<path d="M4 20V8.5L12 4l8 4.5V20" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 20v-6h6v6" stroke="currentColor" stroke-width="1.7"/><path d="M8 11h.01M12 11h.01M16 11h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'),
      experience: icon('<circle cx="12" cy="12" r="8.2" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.8V12l3.2 1.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'),
      law: icon('<path d="M12 3l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z" stroke="currentColor" stroke-width="1.7"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'),
      business: icon('<rect x="4" y="7" width="16" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M9 7V5.8A2.8 2.8 0 0111.8 3h.4A2.8 2.8 0 0115 5.8V7" stroke="currentColor" stroke-width="1.7"/>'),
      complex: icon('<rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'),
      online: icon('<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7"/><path d="M12 4c2.5 2.8 2.5 13.2 0 16M4.5 10h15M4.5 14h15" stroke="currentColor" stroke-width="1.6"/>'),
      protect: icon('<rect x="6" y="11" width="12" height="9" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M9 11V8a3 3 0 016 0v3" stroke="currentColor" stroke-width="1.7"/>'),
      personal: icon('<circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M5 19c1.2-3.2 3.7-5 7-5s5.8 1.8 7 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'),
    };
    const copy = {
      companies: {
        title: "25+ компаний доверили бухгалтерию MBuh",
        text: "Мы сопровождаем предпринимателей из разных сфер бизнеса Казахстана: торговля, услуги, строительство, IT, производство и другие направления. Для каждого клиента подбираем удобный формат сопровождения.",
      },
      experience: {
        title: "Более 10 лет практического опыта",
        text: "Опыт команды MBuh позволяет сопровождать ИП и ТОО на разных налоговых режимах, готовить отчётность, консультировать по налоговым вопросам и помогать бизнесу работать без штрафов.",
      },
      law: {
        title: "Работаем строго в рамках законодательства Республики Казахстан",
        text: "Ведение бухгалтерии, налоговая и статистическая отчётность, ЭСФ, СНТ и ВЭД выполняются в соответствии с действующими требованиями законодательства Республики Казахстан.",
      },
      business: {
        title: "Полное сопровождение ИП и ТОО",
        text: "Берём на себя бухгалтерский учёт, подготовку документов, отчётность, консультации, взаимодействие с государственными органами и сопровождение бизнеса.",
      },
      complex: {
        title: "Комплексное сопровождение бизнеса",
        text: "Работаем с компаниями, которые ведут импорт и экспорт, являются плательщиками НДС и используют электронные счета-фактуры, СНТ и форму 328.",
      },
      online: {
        title: "Работаем по всему Казахстану",
        text: "Большинство документов передаются онлайн. Мы сопровождаем клиентов независимо от города и всегда остаёмся на связи.",
      },
      protect: {
        title: "Конфиденциальность финансовых документов",
        text: "Все документы клиентов обрабатываются конфиденциально. Соблюдаем безопасную работу с бухгалтерскими и финансовыми данными компании.",
      },
      personal: {
        title: "За вашей компанией закреплён личный бухгалтер",
        text: "Вы работаете с одним специалистом, который знает особенности вашего бизнеса, контролирует сроки отчётности и отвечает на вопросы без долгих ожиданий.",
      },
    };

    const dialog = trustModal.querySelector(".trust-modal__dialog");
    const titleEl = document.getElementById("trustModalTitle");
    const textEl = document.getElementById("trustModalText");
    const iconEl = document.getElementById("trustModalIcon");
    const markEl = document.getElementById("trustModalMark");
    const consultEl = document.getElementById("trustModalConsult");
    const waEl = document.getElementById("trustModalWa");
    let lastFocus = null;
    let closing = false;

    const fill = (key, origin) => {
      const item = copy[key];
      if (!item) return false;
      titleEl.textContent = item.title;
      textEl.textContent = item.text;
      const cardSvg = origin && origin.querySelector(".ico svg");
      const svgHtml = cardSvg ? cardSvg.outerHTML : icons[key] || icons.companies;
      iconEl.innerHTML = svgHtml;
      markEl.innerHTML = svgHtml;
      consultEl.href = WA;
      waEl.href = WA;
      return true;
    };

    const openModal = (key, origin) => {
      if (!fill(key, origin) || closing) return;
      lastFocus = origin || document.activeElement;
      trustModal.classList.remove("is-closing");
      trustModal.classList.add("is-open");
      trustModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      (dialog || trustModal.querySelector("[aria-label='Закрыть']")).focus();
    };

    const closeModal = () => {
      if (!trustModal.classList.contains("is-open") || closing) return;
      closing = true;
      trustModal.classList.add("is-closing");
      trustModal.classList.remove("is-open");
      const done = () => {
        trustModal.classList.remove("is-closing");
        trustModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        closing = false;
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      };
      window.setTimeout(done, 200);
    };

    document.querySelectorAll(".trust-card[data-trust]").forEach((card) => {
      const open = () => openModal(card.getAttribute("data-trust"), card);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });

    trustModal.querySelectorAll("[data-trust-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
    const xBtn = document.getElementById("trustModalX");
    const closeBtn = document.getElementById("trustModalClose");
    if (xBtn) xBtn.addEventListener("click", closeModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  /* Service card modals */
  const serviceModal = document.getElementById("serviceModal");
  if (serviceModal) {
    const WA_CONSULT = "https://wa.me/77760053437?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D0%BA%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8E";
    const WA_PLAIN = "https://wa.me/77760053437";
    const catalog = {
      ip: {
        title: "Бухгалтерское сопровождение ИП",
        text: "Полное ведение бухгалтерии индивидуального предпринимателя: документы, налоговая и статистическая отчётность, консультации и контроль сроков",
        items: ["бухгалтерский учёт", "налоговые формы", "статистическая отчётность", "консультации", "контроль сроков", "ответы на уведомления КГД", "сопровождение проверок"],
      },
      too: {
        title: "Бухгалтерское сопровождение ТОО",
        text: "Комплексное ведение бухгалтерии компании: документы, заработная плата, налоги, отчётность, консультации и сопровождение бизнеса",
        items: ["первичные документы и учёт", "заработная плата", "налоги", "отчётность", "консультации", "сопровождение бизнеса"],
      },
      "too-nds": {
        title: "Ведение ТОО с НДС",
        text: "Полное сопровождение компаний — плательщиков НДС: формы 300, книга покупок и продаж, ЭСФ, налоговый контроль и сопровождение операций",
        items: ["форма 300", "книга покупок и продаж", "ЭСФ", "налоговый контроль", "сопровождение операций"],
      },
      tax: {
        title: "Налоговая отчётность",
        text: "Подготовка и сдача налоговых деклараций в соответствии с законодательством Республики Казахстан",
        items: ["формы 100, 200, 220, 240, 300, 910, 913 и другие", "проверка исходных данных", "сдача отчётности в срок", "сопровождение уточнёнок"],
      },
      stat: {
        title: "Статистическая отчётность",
        text: "Подготовка обязательных статистических форм для бизнеса и сдача в установленные сроки",
        items: ["подбор обязательных статистических форм", "подготовка данных по деятельности компании", "сдача отчётности в срок", "контроль календарных сроков"],
      },
      esf: {
        title: "Электронные счета-фактуры (ЭСФ)",
        text: "Работа в системе ИС ЭСФ: выпуск, исправление, отзыв и сопровождение электронных счетов-фактур",
        items: ["выпуск ЭСФ", "исправление ЭСФ", "отзыв ЭСФ", "сопровождение в ИС ЭСФ"],
      },
      import: {
        title: "Импорт",
        text: "Подготовка документов при ввозе товаров и сопровождение импортных операций в учёте.",
        items: ["пакет документов на ввоз", "учёт импортных поставок", "проверка таможенных и налоговых данных", "сопровождение расчётов", "консультации по импорту"],
      },
      export: {
        title: "Экспорт",
        text: "Подготовка документов при экспорте и сопровождение экспортных операций.",
        items: ["пакет документов на вывоз", "подтверждение экспортных операций", "учёт экспортных поставок", "подготовка связанных форм", "консультации по экспорту"],
      },
      f328: {
        title: "Форма 328",
        text: "Подготовка формы 328 при импорте товаров и сдача отчётности в установленный срок.",
        items: ["подготовка формы 328", "проверка данных импорта", "сверка с документами поставки", "сдача в срок", "консультации"],
      },
      snt: {
        title: "СНТ",
        text: "Оформление сопроводительных накладных на товары и контроль документов в информационной системе.",
        items: ["оформление СНТ", "проверка реквизитов и номенклатуры", "контроль статусов документов", "сверка с поставками и ЭСФ", "консультации по СНТ"],
      },
      "reg-ip": {
        title: "Регистрация ИП",
        text: "Помогаем открыть индивидуальное предпринимательство и сразу выстроить понятный учёт.",
        items: ["подготовка документов на регистрацию", "подача заявления", "выбор налогового режима", "рекомендации по старту учёта", "консультация после открытия"],
      },
      "reg-too": {
        title: "Регистрация ТОО",
        text: "Сопровождаем регистрацию товарищества и запуск бухгалтерии с первых дней работы.",
        items: ["пакет учредительных документов", "сопровождение регистрации", "постановка на учёт", "запуск бухгалтерии", "консультации по старту компании"],
      },
      "nds-reg": {
        title: "Постановка на НДС",
        text: "Оформляем постановку на учёт по НДС и запускаем нужный контур отчётности.",
        items: ["оценка необходимости постановки", "подготовка заявления", "постановка на учёт по НДС", "запуск контура ЭСФ и формы 300", "консультации"],
      },
      restore: {
        title: "Восстановление бухгалтерии",
        text: "Наводим порядок в учёте, восстанавливаем прошлые периоды и закрываем долги по отчётности.",
        items: ["разбор документов и остатков", "восстановление прошлых периодов", "сверка с налоговыми органами", "сдача недостающей отчётности", "консультации по дальнейшему учёту"],
      },
      consult: {
        title: "Консультации бухгалтера",
        text: "Разбираем налоговые и учётные вопросы без лишней теории — с понятным планом действий.",
        items: ["налоговые вопросы", "выбор и смена режима", "разбор учётных ситуаций", "рекомендации по документам", "ответ по срокам и рискам"],
      },
      liquid: {
        title: "Ликвидация ИП и ТОО",
        text: "Сопровождаем закрытие компании, финальную отчётность и снятие с учёта.",
        items: ["подготовка документов на ликвидацию", "финальная отчётность", "закрытие обязательств", "снятие с учёта", "консультации на каждом этапе"],
      },
    };

    const dialog = serviceModal.querySelector(".trust-modal__dialog");
    const titleEl = document.getElementById("serviceModalTitle");
    const textEl = document.getElementById("serviceModalText");
    const iconEl = document.getElementById("serviceModalIcon");
    const markEl = document.getElementById("serviceModalMark");
    const listEl = document.getElementById("serviceModalList");
    const consultEl = document.getElementById("serviceModalConsult");
    const waEl = document.getElementById("serviceModalWa");
    let lastFocus = null;
    let closing = false;

    const fill = (key, origin) => {
      const item = catalog[key];
      if (!item) return false;
      titleEl.textContent = item.title;
      textEl.textContent = item.text;
      listEl.innerHTML = item.items.map((line) => `<li>${line}</li>`).join("");
      const cardSvg = origin && origin.querySelector(".ico svg");
      const svgHtml = cardSvg ? cardSvg.outerHTML : "";
      iconEl.innerHTML = svgHtml;
      markEl.innerHTML = svgHtml;
      consultEl.href = WA_CONSULT;
      waEl.href = WA_PLAIN;
      return true;
    };

    const openModal = (key, origin) => {
      if (!fill(key, origin) || closing) return;
      lastFocus = origin || document.activeElement;
      serviceModal.classList.remove("is-closing");
      serviceModal.classList.add("is-open");
      serviceModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      (dialog || document.getElementById("serviceModalX")).focus();
    };

    const closeModal = () => {
      if (!serviceModal.classList.contains("is-open") || closing) return;
      closing = true;
      serviceModal.classList.add("is-closing");
      serviceModal.classList.remove("is-open");
      window.setTimeout(() => {
        serviceModal.classList.remove("is-closing");
        serviceModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        closing = false;
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      }, 200);
    };

    document.querySelectorAll(".svc-card[data-service]").forEach((card) => {
      const open = () => openModal(card.getAttribute("data-service"), card);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });

    serviceModal.querySelectorAll("[data-service-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
    const xBtn = document.getElementById("serviceModalX");
    if (xBtn) xBtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ========== Calculator ========== */
  const root = document.getElementById("calculator");
  if (!root) return;

  const els = {
    opsRange: document.getElementById("opsRange"),
    opsValue: document.getElementById("opsValue"),
    staffRange: document.getElementById("staffRange"),
    staffValue: document.getElementById("staffValue"),
    staffLabel: document.getElementById("staffLabel"),
    taxHint: document.getElementById("taxHint"),
    calcTotal: document.getElementById("calcTotal"),
    calcTotalBig: document.getElementById("calcTotalBig"),
    calcLines: document.getElementById("calcLines"),
    onceNote: document.getElementById("onceNote"),
    waBtn: document.getElementById("calcWhatsApp"),
  };

  if (!els.opsRange || !els.calcTotal) return;

  const LABELS = {
    type: { ip: "ИП", too: "ТОО" },
    tax: {
      snr: "Упрощённый режим",
      our: "Общеустановленный режим",
      unknown: "Не знаю (нужна помощь)",
    },
    extras: {
      esf: "ЭСФ",
      eavr: "ЭАВР",
      snt: "СНТ",
      hr: "Кадровый учёт",
      payroll: "Расчёт заработной платы",
      consult: "Консультации бухгалтера",
      currency: "Валютный контроль",
    },
    once: {
      regIp: "Регистрация ИП",
      regToo: "Регистрация ТОО",
      closeIp: "Закрытие ИП",
      ndsOn: "Постановка на НДС",
      ndsOff: "Снятие с НДС",
      taxNotice: "Ответ на уведомление налоговой",
      restore: "Восстановление бухгалтерского учёта",
      onceConsult: "Разовая консультация",
    },
  };

  const EXTRA_PRICES = {
    esf: 2000,
    eavr: 2000,
    snt: 2000,
    hr: 10000,
    payroll: 8000,
    consult: 5000,
    currency: 10000,
  };

  const ONCE_PRICES = {
    regIp: 15000,
    regToo: 35000,
    closeIp: 20000,
    ndsOn: 25000,
    ndsOff: 20000,
    taxNotice: 25000,
    restore: 50000,
    onceConsult: 15000,
  };

  const state = {
    type: "ip",
    tax: "snr",
    ops: 0,
    staff: 0,
    nds: false,
    ved: false,
    extras: {
      esf: false,
      eavr: false,
      snt: false,
      hr: false,
      payroll: false,
      consult: false,
      currency: false,
    },
    once: {
      regIp: false,
      regToo: false,
      closeIp: false,
      ndsOn: false,
      ndsOff: false,
      taxNotice: false,
      restore: false,
      onceConsult: false,
    },
  };

  let displayed = 0;
  let raf = null;

  const money = (n) => new Intl.NumberFormat("ru-RU").format(Math.round(n));

  const staffWord = (n) => {
    const a = Math.abs(n) % 100;
    const d = a % 10;
    if (a > 10 && a < 20) return "сотрудников";
    if (d === 1) return "сотрудник";
    if (d >= 2 && d <= 4) return "сотрудника";
    return "сотрудников";
  };

  const getBase = () => {
    const regime = state.tax === "our" ? "our" : "snr";
    if (state.type === "too") return regime === "our" ? 60000 : 40000;
    return regime === "our" ? 40000 : 25000;
  };

  const getOpsAdd = (ops) => {
    if (ops <= 20) return 0;
    if (ops <= 50) return 10000;
    if (ops <= 100) return 20000;
    if (ops <= 200) return 35000;
    if (ops <= 300) return 55000;
    if (ops < 500) return 80000;
    return 100000;
  };

  const getStaffAdd = (n) => {
    if (n <= 0) return 0;
    if (n <= 3) return 8000;
    if (n <= 10) return 15000;
    if (n <= 20) return 25000;
    if (n <= 50) return 45000;
    return 70000;
  };

  const calculate = () => {
    const base = getBase();
    const opsAdd = getOpsAdd(state.ops);
    const staffAdd = getStaffAdd(state.staff);
    const ndsAdd = state.nds ? 20000 : 0;
    const vedAdd = state.ved ? 15000 : 0;

    const extrasList = [];
    let extrasTotal = 0;
    Object.keys(EXTRA_PRICES).forEach((k) => {
      if (state.extras[k]) {
        extrasList.push({ label: LABELS.extras[k], price: EXTRA_PRICES[k] });
        extrasTotal += EXTRA_PRICES[k];
      }
    });

    const onceList = [];
    let onceTotal = 0;
    Object.keys(ONCE_PRICES).forEach((k) => {
      if (state.once[k]) {
        onceList.push({ label: LABELS.once[k], price: ONCE_PRICES[k] });
        onceTotal += ONCE_PRICES[k];
      }
    });

    const monthly = base + opsAdd + staffAdd + ndsAdd + vedAdd + extrasTotal;
    return {
      base,
      opsAdd,
      staffAdd,
      ndsAdd,
      vedAdd,
      extrasList,
      onceList,
      onceTotal,
      monthly,
      total: monthly + onceTotal,
    };
  };

  const animate = (to) => {
    const from = displayed;
    if (from === to) {
      els.calcTotal.textContent = money(to);
      if (els.calcTotalBig) els.calcTotalBig.textContent = money(to);
      return;
    }
    if (raf) cancelAnimationFrame(raf);
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 400);
      const eased = 1 - Math.pow(1 - t, 3);
      displayed = Math.round(from + (to - from) * eased);
      els.calcTotal.textContent = money(displayed);
      if (els.calcTotalBig) els.calcTotalBig.textContent = money(displayed);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  const updateWhatsApp = (r) => {
    if (!els.waBtn) return;
    const yn = (v) => (v ? "Да" : "Нет");
    const extras = r.extrasList.length ? r.extrasList.map((e) => e.label).join(", ") : "Нет";
    const once = r.onceList.length ? r.onceList.map((e) => e.label).join(", ") : "Нет";
    const text = [
      "Здравствуйте!",
      "",
      "Я воспользовался калькулятором на сайте MBbuh.",
      "",
      "Предварительный расчёт:",
      `• Тип бизнеса: ${LABELS.type[state.type]}`,
      `• Налоговый режим: ${LABELS.tax[state.tax]}`,
      `• Количество операций: ${state.ops >= 500 ? "500+" : state.ops}`,
      `• Количество сотрудников: ${state.staff}`,
      `• НДС: ${yn(state.nds)}`,
      `• ВЭД: ${yn(state.ved)}`,
      `• Дополнительные услуги: ${extras}`,
      `• Разовые услуги: ${once}`,
      "",
      "Предварительная стоимость обслуживания:",
      `${money(r.total)} ₸`,
      r.onceTotal > 0
        ? `(ежемесячно ≈ ${money(r.monthly)} ₸ + разовые ${money(r.onceTotal)} ₸)`
        : `(${money(r.monthly)} ₸ / месяц)`,
      "",
      "Прошу подготовить точный расчёт стоимости для моей компании.",
    ].join("\n");
    els.waBtn.href = "https://wa.me/77760053437?text=" + encodeURIComponent(text);
  };

  const render = () => {
    const r = calculate();
    const opsLabel = state.ops >= 500 ? "500+" : String(state.ops);
    els.opsValue.textContent = opsLabel;
    els.staffValue.textContent = String(state.staff);
    if (els.staffLabel) els.staffLabel.textContent = `${state.staff} ${staffWord(state.staff)}`;
    if (els.taxHint) els.taxHint.hidden = state.tax !== "unknown";
    if (els.onceNote) els.onceNote.hidden = r.onceTotal === 0;

    const rows = [
      { label: "Базовое сопровождение", amount: r.base, show: true, plus: false },
      { label: "Количество операций", amount: r.opsAdd, show: r.opsAdd > 0, plus: true },
      { label: "Количество сотрудников", amount: r.staffAdd, show: r.staffAdd > 0, plus: true },
      { label: "НДС", amount: r.ndsAdd, show: r.ndsAdd > 0, plus: true },
      { label: "ВЭД", amount: r.vedAdd, show: r.vedAdd > 0, plus: true },
      ...r.extrasList.map((e) => ({ label: e.label, amount: e.price, show: true, plus: true })),
      ...r.onceList.map((e) => ({
        label: e.label + " (разово)",
        amount: e.price,
        show: true,
        plus: true,
      })),
    ];

    if (els.calcLines) {
      els.calcLines.innerHTML = rows
        .filter((x) => x.show)
        .map((x) => {
          const prefix = x.plus ? "+" : "";
          return `<li><span>${x.label}</span><strong>${prefix}${money(x.amount)} ₸</strong></li>`;
        })
        .join("");
    }

    animate(r.total);
    updateWhatsApp(r);
  };

  root.querySelectorAll(".calc-cards[data-group]").forEach((group) => {
    const key = group.getAttribute("data-group");
    group.querySelectorAll(".calc-pick").forEach((btn) => {
      btn.addEventListener("click", () => {
        group.querySelectorAll(".calc-pick").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state[key] = btn.getAttribute("data-value");
        render();
      });
    });
  });

  root.querySelectorAll(".calc-yn[data-group]").forEach((group) => {
    const key = group.getAttribute("data-group");
    group.querySelectorAll(".calc-yn__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        group.querySelectorAll(".calc-yn__btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state[key] = btn.getAttribute("data-value") === "yes";
        render();
      });
    });
  });

  els.opsRange.addEventListener("input", () => {
    state.ops = Number(els.opsRange.value) || 0;
    render();
  });
  els.staffRange.addEventListener("input", () => {
    state.staff = Number(els.staffRange.value) || 0;
    render();
  });

  root.querySelectorAll("[data-extra]").forEach((input) => {
    input.addEventListener("change", () => {
      state.extras[input.getAttribute("data-extra")] = input.checked;
      render();
    });
  });
  root.querySelectorAll("[data-once]").forEach((input) => {
    input.addEventListener("change", () => {
      state.once[input.getAttribute("data-once")] = input.checked;
      render();
    });
  });

  displayed = calculate().total;
  render();
})();
