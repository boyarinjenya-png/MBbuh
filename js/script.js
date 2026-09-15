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
      reveals.forEach((el) => io.observe(el));
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
