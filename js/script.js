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
      "svc-ip": {
        title: "Бухгалтерское сопровождение ИП",
        text: "Ведём учёт индивидуального предпринимателя: первичные документы, налоги, отчётность и кабинет налогоплательщика. Контролируем сроки, отвечаем на вопросы и держим учёт в порядке, чтобы вы занимались продажами и клиентами.",
      },
      "svc-too": {
        title: "Бухгалтерское сопровождение ТОО",
        text: "Берём на себя документы, налоги и отчётность компании. Закрепляем бухгалтера, следим за сроками и кабинетом налогоплательщика — вы получаете понятное сопровождение без штатного главбуха.",
      },
      "svc-vat": {
        title: "НДС для ИП и ТОО",
        text: "Сопровождаем плательщиков НДС: электронные счета-фактуры, форма 300, зачёты и сверка расхождений. Помогаем не пропускать сроки и держать налоговый контур под контролем.",
      },
      "svc-report": {
        title: "Налоговая отчётность",
        text: "Готовим и сдаём налоговые декларации по режиму компании. Проверяем данные периода, заполняем формы и подтверждаем отправку в кабинете налогоплательщика.",
      },
      "svc-stat": {
        title: "Статистическая отчётность",
        text: "Закрываем обязательные статистические формы по кабинету бюро. Смотрим, какие отчёты назначены, готовим данные и сдаём в срок, чтобы не было штрафов за пропуск.",
      },
      "svc-esf": {
        title: "ЭСФ",
        text: "Подключаем и ведём работу в ИС ЭСФ: регистрация, выписка, исправление и отзыв электронных счетов-фактур. Сверяем документы с учётом, чтобы ЭСФ не расходились с отчётностью.",
      },
      "svc-import": {
        title: "Импорт и ВЭД",
        text: "Сопровождаем ввоз товаров: комплект документов по поставке, учёт импорта и форма 328 при ввозе из ЕАЭС. Помогаем собрать данные и сдать связанные формы без аврала.",
      },
      "svc-export": {
        title: "Экспорт",
        text: "Подтверждаем вывоз, сопровождаем валютную выручку и связанные налоговые формы. Держим документы по экспорту в порядке и подсказываем, что нужно для отчётности.",
      },
      "svc-payroll": {
        title: "Зарплата и кадровый учёт",
        text: "Считаем заработную плату, налоги и взносы по сотрудникам, ведём кадровые документы. Закрываем ежемесячный контур по штату, чтобы выплаты и отчётность сходились.",
      },
      "svc-reg": {
        title: "Регистрация и ликвидация бизнеса",
        text: "Сопровождаем открытие и закрытие ИП и ТОО: пакет документов, подача, постановка или снятие с учёта. Объясняем шаги и закрываем бюрократию, чтобы вы не разбирались в кабинетах самостоятельно.",
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
      const cardSvg = origin && origin.querySelector(".ico svg, .sv-ico svg");
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

  /* Services Premium V2 popups */
  const svcPopup = document.getElementById("svcPopup");
  if (svcPopup) {
    const WA_CONSULT = "https://wa.me/77760053437?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D0%BA%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8E";
    const WA_PLAIN = "https://wa.me/77760053437";
    const catalog = {
      ip: {
        title: "Бухгалтерское сопровождение ИП",
        text: "Берём на себя учёт, сроки и кабинет налогоплательщика — вы занимаетесь продажами и клиентами",
        items: ["Ведение бухгалтерии", "Налоговая отчётность", "Статистика", "Консультации", "Контроль сроков", "Работа с кабинетом налогоплательщика"],
        price: "60 000 ₸ / месяц",
        note: "Финальная стоимость зависит от количества документов и сотрудников",
        who: [
          ["Интернет-магазины", "ИП с онлайн-продажами и маркетплейсами"],
          ["Услуги", "Специалисты и студии без штатного бухгалтера"],
          ["Самозанятые / ИП", "Предприниматели на упрощёнке"]
        ]
      },
      too: {
        title: "Бухгалтерское сопровождение ТОО",
        text: "Комплексное ведение компании без НДС: документы, налоги, отчётность и закреплённый бухгалтер",
        items: ["Первичные документы и банк", "Налоговая отчётность", "Зарплата при наличии штата", "Консультации", "Контроль сроков", "Кабинет налогоплательщика"],
        price: "60 000 ₸ / месяц",
        note: "Ориентир для упрощённого режима. Общеустановленный — 90 000 ₸ / месяц",
        who: [
          ["Услуги и агентства", "ТОО без ввоза товаров и без НДС"],
          ["Торговля без НДС", "Компании до порога постановки на НДС"],
          ["Небольшой штат", "Команды без штатного главбуха"]
        ]
      },
      vat: {
        title: "ТОО с НДС",
        text: "Сопровождаем плательщиков НДС: ЭСФ, форма 300, зачёты и контроль расхождений",
        items: ["Форма 300", "ЭСФ", "Книга покупок и продаж", "Налоговый контроль", "Первичка и банк", "Консультации по НДС"],
        price: "от 100 000 ₸ / месяц",
        note: "Базовый тариф плюс доплата НДС +40 000 ₸",
        who: [
          ["Опт и поставки", "Регулярный НДС в счетах покупателям"],
          ["Импортёры", "Ввоз товаров и зачёт НДС"],
          ["B2B-услуги", "Подрядчики, которым нужен НДС в актах"]
        ]
      },
      "reg-ip": {
        title: "Регистрация ИП",
        text: "Открываем ИП и сразу выстраиваем понятный старт учёта",
        items: ["Подготовка документов", "Подача заявления", "Выбор налогового режима", "Рекомендации по старту учёта"],
        price: "5 000 ₸",
        note: "Госпошлины оплачиваются отдельно",
        who: [
          ["Новый бизнес", "Запуск без разбора кабинетов"],
          ["Фриланс и услуги", "Нужен легальный статус ИП"],
          ["Онлайн-продажи", "Старт на маркетплейсах"]
        ]
      },
      "reg-too": {
        title: "Регистрация ТОО",
        text: "Сопровождаем регистрацию товарищества и постановку на учёт",
        items: ["Пакет учредительных документов", "Сопровождение регистрации", "Постановка на учёт", "Запуск бухгалтерии"],
        price: "30 000 ₸",
        note: "Нотариат и госпошлины оплачиваются отдельно",
        who: [
          ["Новая компания", "Нужно ТОО под партнёров"],
          ["ИП → ТОО", "Выросли из индивидуального предпринимателя"],
          ["Иностранные учредители", "Понятный маршрут регистрации"]
        ]
      },
      "liquid-ip": {
        title: "Ликвидация ИП",
        text: "Сопровождаем закрытие ИП, финальную отчётность и снятие с учёта",
        items: ["Подготовка документов", "Финальная отчётность", "Закрытие обязательств", "Снятие с учёта"],
        price: "20 000 ₸",
        note: "Срок зависит от состояния учёта и долгов",
        who: [
          ["Остановка деятельности", "ИП больше не ведёт бизнес"],
          ["Смена формы", "Переход в ТОО или закрытие"],
          ["Наведение порядка", "Нужно корректно сняться с учёта"]
        ]
      },
      "liquid-too": {
        title: "Ликвидация ТОО",
        text: "Сопровождаем ликвидацию товарищества и снятие с учёта",
        items: ["Пакет документов на ликвидацию", "Финальная отчётность", "Закрытие обязательств", "Снятие с учёта"],
        price: "80 000 ₸",
        note: "Срок зависит от проверок и состояния документов",
        who: [
          ["Закрытие компании", "ТОО больше не работает"],
          ["Реорганизация", "Нужно корректно завершить юрлицо"],
          ["Долгая «нулёвка»", "Проще закрыть, чем держать компанию"]
        ]
      },
      f910: {
        title: "Форма 910",
        text: "Готовим и сдаём упрощённую декларацию по данным периода",
        items: ["Сбор данных", "Заполнение формы 910", "Сдача в кабинете", "Подтверждение отправки"],
        price: "7 000 ₸",
        note: "Нулевая форма — 5 000 ₸",
        who: [
          ["ИП на упрощёнке", "Разовая сдача без полного аутсорса"],
          ["ТОО на СНР", "Нужна декларация за период"],
          ["Нулевой период", "Деятельности не было, форму сдать нужно"]
        ]
      },
      f200: {
        title: "Форма 200",
        text: "Готовим декларацию по ИПН и социальному налогу",
        items: ["Проверка начислений", "Заполнение формы 200", "Сдача в срок", "Пояснения при запросе"],
        price: "7 000 ₸",
        note: "Доплата за сотрудников — по прайсу",
        who: [
          ["Компании со штатом", "Нужна декларация по сотрудникам"],
          ["Разовая сдача", "Без ежемесячного сопровождения"],
          ["Уточнёнка", "Корректировка ранее сданной формы"]
        ]
      },
      f300: {
        title: "Форма 300",
        text: "Готовим декларацию по НДС по данным ИС ЭСФ",
        items: ["Сверка ЭСФ", "Заполнение формы 300", "Контроль зачёта", "Сдача в кабинете"],
        price: "30 000 ₸",
        note: "Считаем по данным информационной системы ЭСФ",
        who: [
          ["Плательщики НДС", "Нужна декларация за квартал"],
          ["Разовая сдача", "Без полного ведения компании"],
          ["Проверка данных", "Сверка перед отправкой"]
        ]
      },
      f328: {
        title: "Форма 328",
        text: "Готовим декларацию по косвенным налогам при импорте из ЕАЭС",
        items: ["Проверка комплекта поставки", "Расчёт строк", "Заполнение 328.00", "Сдача в срок"],
        price: "20 000 ₸",
        note: "Цена до 10 строк. Дополнительная строка — 1 000 ₸",
        who: [
          ["Импорт из ЕАЭС", "Ввоз из России, Беларуси, Кыргызстана, Армении"],
          ["Разовая поставка", "Нужно сдать 328 без полного аутсорса"],
          ["Регулярный ввоз", "Форма нужна каждый месяц"]
        ]
      },
      esf: {
        title: "ЭСФ",
        text: "Регистрация в ИС ЭСФ, выпуск и исправление электронных счетов-фактур",
        items: ["Регистрация в ИС ЭСФ", "Выписка ЭСФ", "Исправление и отзыв", "Сверка с учётом"],
        price: "от 5 000 ₸",
        note: "Регистрация — 5 000 ₸. Выписка 1–10 позиций — 5 000 ₸",
        who: [
          ["Плательщики НДС", "ЭСФ нужны регулярно"],
          ["Поставщики B2B", "Клиенты требуют электронные документы"],
          ["Новые компании", "Ещё не подключили ИС ЭСФ"]
        ]
      },
      kgd: {
        title: "Ответ на уведомление КГД",
        text: "Разбираем текст уведомления и готовим ответ в кабинете налогоплательщика",
        items: ["Разбор уведомления", "Сбор пояснений и документов", "Подготовка ответа", "Подача в кабинете"],
        price: "25 000 ₸",
        note: "Сложные проверки оцениваем отдельно",
        who: [
          ["ИП и ТОО", "Пришло уведомление из КГД"],
          ["Камеральный контроль", "Нужны пояснения по расхождениям"],
          ["Срок горит", "Ответ нужно подать быстро"]
        ]
      }
    };

    const dialog = svcPopup.querySelector(".svc-popup__dialog");
    const titleEl = document.getElementById("svcPopupTitle");
    const textEl = document.getElementById("svcPopupText");
    const listEl = document.getElementById("svcPopupList");
    const priceEl = document.getElementById("svcPopupPrice");
    const noteEl = document.getElementById("svcPopupNote");
    const whoEl = document.getElementById("svcPopupWho");
    const consultEl = document.getElementById("svcPopupConsult");
    const waEl = document.getElementById("svcPopupWa");
    let lastFocus = null;
    let closing = false;

    const fill = (key) => {
      const item = catalog[key];
      if (!item) return false;
      titleEl.textContent = item.title;
      textEl.textContent = item.text;
      listEl.innerHTML = item.items.map((line) => `<li>${line}</li>`).join("");
      priceEl.textContent = item.price;
      noteEl.textContent = item.note || "";
      whoEl.innerHTML = (item.who || []).map(([t, p]) => `<article class="svc-popup__chip"><strong>${t}</strong><span>${p}</span></article>`).join("");
      consultEl.href = WA_CONSULT;
      waEl.href = WA_PLAIN;
      return true;
    };

    const openModal = (key, origin) => {
      if (!fill(key)) return;
      closing = false;
      lastFocus = origin || document.activeElement;
      svcPopup.classList.remove("is-closing");
      svcPopup.classList.add("is-open");
      svcPopup.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      dialog.focus();
    };

    const closeModal = () => {
      if (!svcPopup.classList.contains("is-open") || closing) return;
      closing = true;
      svcPopup.classList.add("is-closing");
      svcPopup.classList.remove("is-open");
      window.setTimeout(() => {
        svcPopup.classList.remove("is-closing");
        svcPopup.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        closing = false;
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      }, 200);
    };

    document.querySelectorAll("[data-svc]").forEach((card) => {
      const open = () => openModal(card.getAttribute("data-svc"), card);
      card.addEventListener("click", (e) => {
        e.preventDefault();
        open();
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });

    svcPopup.querySelectorAll("[data-svc-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
    const xBtn = document.getElementById("svcPopupX");
    const closeBtn = document.getElementById("svcPopupClose");
    if (xBtn) xBtn.addEventListener("click", closeModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
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
