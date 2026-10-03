// NAME: Garage Menu
// AUTHOR: Kyle
// DESCRIPTION: Menú para personalizar el tema Garage (Supra, Mercedes, BMW) con colores, adornos y ajustes.

(function GarageMenu() {
  "use strict";

  const STORE_KEY = "garage:settings:v1";

  /* ------------------------------------------------------------------ */
  /*  Temas                                                              */
  /* ------------------------------------------------------------------ */
  const THEMES = {
    "supra-purple": {
      name: "Supra Neón",
      sub: "Morado fluorescente",
      colors: {
        accent: "#b026ff", hot: "#d77bff", dark: "#3b0a63", secondary: "#ff4df0",
        silver: "#cfc8e6", bg: "#0a0712", bg2: "#150e24", text: "#f4f0ff", onAccent: "#ffffff",
      },
      badge: "2JZ-GTE  ·  3.0 TWIN TURBO",
      ghost: "スープラ  SUPRA",
    },
    "supra-red": {
      name: "Supra Rojo",
      sub: "Renaissance Red del A80",
      colors: {
        accent: "#d1202f", hot: "#ff2a3d", dark: "#4a1218", secondary: "#ff9a1f",
        silver: "#b9bdc6", bg: "#0c0c0f", bg2: "#14141a", text: "#f2f2f4", onAccent: "#ffffff",
      },
      badge: "2JZ-GTE  ·  3.0 TWIN TURBO",
      ghost: "スープラ  SUPRA",
    },
    mercedes: {
      name: "Mercedes",
      sub: "Gris plata y blanco",
      colors: {
        accent: "#d5d9df", hot: "#ffffff", dark: "#4b5058", secondary: "#8e949e",
        silver: "#b8bdc6", bg: "#0e0f11", bg2: "#17181c", text: "#f5f6f8", onAccent: "#0b0c0e",
      },
      badge: "AMG  ·  4.0 V8 BITURBO",
      ghost: "MERCEDES-BENZ",
    },
    bmw: {
      name: "BMW",
      sub: "Azul y blanco",
      colors: {
        accent: "#1c69d4", hot: "#5ba9ff", dark: "#0b2a52", secondary: "#ffffff",
        silver: "#c4d4ea", bg: "#070b12", bg2: "#0e1624", text: "#f4f8ff", onAccent: "#ffffff",
      },
      badge: "M  ·  3.0 TWIN POWER TURBO",
      ghost: "BMW  M",
    },
  };

  const COLOR_FIELDS = [
    ["accent", "Color principal"],
    ["hot", "Color brillante (barra, brillos)"],
    ["secondary", "Color secundario"],
    ["silver", "Texto secundario / plata"],
    ["bg", "Fondo"],
  ];

  const TOGGLES = [
    ["taillight", "Luz trasera animada en el reproductor"],
    ["badge", "Placa del motor"],
    ["ghost", "Marca de agua gigante"],
    ["grid", "Rejilla neón de fondo"],
    ["carbon", "Fibra de carbono"],
    ["sparkles", "Destellos de fondo"],
    ["hud", "Esquinas HUD en las tarjetas"],
    ["checker", "Bandera de cuadros arriba"],
    ["ticks", "Marcas de cuentarrevoluciones"],
    ["stripes", "Rayas de carreras en el menú lateral"],
    ["anim", "Animaciones"],
    ["font", "Fuente racing"],
  ];

  const DEFAULTS = {
    theme: "supra-purple",
    custom: {},
    glow: 100,
    radius: 6,
    skew: 12,
    on: Object.fromEntries(TOGGLES.map(([k]) => [k, true])),
    badge: "",
    ghost: "",
  };

  /* ------------------------------------------------------------------ */
  /*  Utilidades                                                         */
  /* ------------------------------------------------------------------ */
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const num = (v, lo, hi, d) => (v !== null && v !== "" && Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : d);
  const isHex = (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);

  const hexToRgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const rgbToHex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const mix = (a, b, t) => {
    const A = hexToRgb(a);
    const B = hexToRgb(b);
    return rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
  };
  const rgbStr = (hex) => hexToRgb(hex).join(", ");

  const notify = (msg) => {
    try {
      Spicetify.showNotification(msg);
    } catch (e) {
      /* sin notificación */
    }
  };

  function merge(src) {
    const out = clone(DEFAULTS);
    if (!src || typeof src !== "object") return out;
    if (THEMES[src.theme]) out.theme = src.theme;
    if (src.custom && typeof src.custom === "object") {
      for (const [k] of COLOR_FIELDS) if (isHex(src.custom[k])) out.custom[k] = src.custom[k];
    }
    out.glow = num(src.glow, 0, 150, DEFAULTS.glow);
    out.radius = num(src.radius, 0, 20, DEFAULTS.radius);
    out.skew = num(src.skew, 0, 14, DEFAULTS.skew);
    if (src.on && typeof src.on === "object") {
      for (const [k] of TOGGLES) if (typeof src.on[k] === "boolean") out.on[k] = src.on[k];
    }
    out.badge = typeof src.badge === "string" ? src.badge.slice(0, 40) : "";
    out.ghost = typeof src.ghost === "string" ? src.ghost.slice(0, 40) : "";
    return out;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? merge(JSON.parse(raw)) : clone(DEFAULTS);
    } catch (e) {
      return clone(DEFAULTS);
    }
  }

  let s = load();
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(s));
      } catch (e) {
        /* sin almacenamiento */
      }
    }, 250);
  }

  function currentPalette() {
    const t = THEMES[s.theme];
    const c = { ...t.colors, ...s.custom };
    if (s.custom.accent && !s.custom.dark) c.dark = mix(c.accent, "#000000", 0.72);
    if (s.custom.bg && !s.custom.bg2) c.bg2 = mix(c.bg, "#ffffff", 0.06);
    return c;
  }

  /* ------------------------------------------------------------------ */
  /*  Aplicar ajustes al tema                                            */
  /* ------------------------------------------------------------------ */
  function apply() {
    const root = document.documentElement;
    const t = THEMES[s.theme];
    const c = currentPalette();
    const set = (k, v) => root.style.setProperty(k, v);
    const sidebar = mix(c.bg, "#000000", 0.4);

    root.dataset.garage = s.theme;

    set("--g-accent", c.accent);
    set("--g-hot", c.hot);
    set("--g-dark", c.dark);
    set("--g-secondary", c.secondary);
    set("--g-silver", c.silver);
    set("--g-bg", c.bg);
    set("--g-bg2", c.bg2);
    set("--g-sidebar", sidebar);
    set("--g-text", c.text);
    set("--g-on-accent", c.onAccent);

    set("--g-accent-rgb", rgbStr(c.accent));
    set("--g-hot-rgb", rgbStr(c.hot));
    set("--g-bg-rgb", rgbStr(c.bg));
    set("--g-secondary-rgb", rgbStr(c.secondary));

    set("--g-glow-k", String(s.glow / 100));
    set("--g-radius", s.radius + "px");
    set("--g-skew", "-" + s.skew + "deg");
    set("--g-badge", JSON.stringify(s.badge || t.badge));
    set("--g-ghost", JSON.stringify(s.ghost || t.ghost));

    // Variables de Spicetify para que Spotify entero cambie de color
    const spice = {
      text: c.text,
      subtext: c.silver,
      main: c.bg,
      "main-elevated": mix(c.bg, "#ffffff", 0.05),
      highlight: mix(c.bg, "#ffffff", 0.1),
      "highlight-elevated": mix(c.bg, "#ffffff", 0.14),
      sidebar: sidebar,
      player: mix(c.bg, "#000000", 0.25),
      card: c.bg2,
      shadow: "#000000",
      "selected-row": "#ffffff",
      button: c.accent,
      "button-active": c.hot,
      "button-disabled": c.dark,
      "tab-active": mix(c.bg, "#ffffff", 0.1),
      notification: c.accent,
      "notification-error": c.secondary,
      equalizer: c.hot,
      misc: mix(c.bg, "#ffffff", 0.16),
    };
    for (const [k, v] of Object.entries(spice)) {
      set("--spice-" + k, v);
      set("--spice-rgb-" + k, rgbStr(v));
    }

    for (const [k] of TOGGLES) root.classList.toggle("g-no-" + k, !s.on[k]);
  }

  /* ------------------------------------------------------------------ */
  /*  Pequeño constructor de DOM                                         */
  /* ------------------------------------------------------------------ */
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (k === "class") el.className = v;
      else if (k === "value") el.value = v;
      else if (k === "checked") el.checked = !!v;
      else if (k === "style") el.style.cssText = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2).toLowerCase(), v);
      else el.setAttribute(k, v);
    }
    kids.flat().forEach((kid) => {
      if (kid === null || kid === undefined || kid === false) return;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    });
    return el;
  }

  /* ------------------------------------------------------------------ */
  /*  Estilos del menú                                                   */
  /* ------------------------------------------------------------------ */
  const MENU_CSS = `
.gm-overlay{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.68);backdrop-filter:blur(4px);font-family:var(--g-font-body,'Rajdhani','Segoe UI',sans-serif)}
.gm-panel{width:min(800px,94vw);max-height:88vh;display:flex;flex-direction:column;background:linear-gradient(160deg,var(--g-bg2,#150e24),var(--g-bg,#0a0712));color:var(--g-text,#f4f0ff);border:1px solid var(--g-hot,#d77bff);border-radius:var(--g-radius,6px);box-shadow:0 24px 70px rgba(0,0,0,.75),var(--g-glow,0 0 24px rgba(176,38,255,.5));overflow:hidden}
.gm-head{display:flex;align-items:center;gap:12px;padding:16px 22px;border-bottom:1px solid rgba(var(--g-hot-rgb,215,123,255),.35);background:linear-gradient(90deg,rgba(var(--g-accent-rgb,176,38,255),.38),transparent)}
.gm-title{flex:1;margin:0;font:italic 700 22px/1 var(--g-font-display,'Chakra Petch',sans-serif);letter-spacing:.14em;text-transform:uppercase;text-shadow:2px 2px 0 rgba(var(--g-accent-rgb,176,38,255),.6)}
.gm-hint{font-size:12px;color:var(--g-silver,#cfc8e6);opacity:.8}
.gm-x{width:32px;height:32px;border:1px solid rgba(var(--g-hot-rgb,215,123,255),.5);border-radius:var(--g-radius,6px);background:transparent;color:var(--g-text,#fff);font-size:16px;cursor:pointer}
.gm-x:hover{background:rgba(var(--g-accent-rgb,176,38,255),.4)}
.gm-body{overflow:auto;padding:4px 22px 24px}
.gm-sec{margin-top:20px}
.gm-sec>h3{margin:0 0 10px;padding-left:10px;border-left:4px solid var(--g-hot,#d77bff);font:italic 700 14px/1.2 var(--g-font-display,'Chakra Petch',sans-serif);letter-spacing:.14em;text-transform:uppercase}
.gm-themes{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}
.gm-theme{display:flex;flex-direction:column;gap:6px;padding:12px;text-align:left;cursor:pointer;color:inherit;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:var(--g-radius,6px);transition:transform .15s,border-color .15s,box-shadow .15s}
.gm-theme:hover{transform:translateY(-3px);border-color:var(--g-hot,#d77bff)}
.gm-theme.is-on{border-color:var(--g-hot,#d77bff);box-shadow:var(--g-glow);background:rgba(var(--g-accent-rgb,176,38,255),.18)}
.gm-sw{display:flex;height:22px;border-radius:3px;overflow:hidden}
.gm-sw span{flex:1}
.gm-tn{font:italic 700 15px/1 var(--g-font-display,'Chakra Petch',sans-serif);letter-spacing:.06em;text-transform:uppercase}
.gm-ts{font-size:12px;opacity:.75}
.gm-colors{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px 18px}
.gm-row{display:flex;align-items:center;gap:12px;min-height:34px;font-size:14px}
.gm-lab{flex:1}
.gm-val{width:48px;text-align:right;font-variant-numeric:tabular-nums;color:var(--g-hot,#d77bff)}
.gm-row input[type=range]{flex:1.4;accent-color:var(--g-hot,#d77bff)}
.gm-row input[type=color]{width:46px;height:28px;padding:0;border:1px solid rgba(255,255,255,.3);border-radius:4px;background:transparent;cursor:pointer}
.gm-toggles{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:2px 22px}
.gm-switch{cursor:pointer}
.gm-switch input{position:absolute;opacity:0;pointer-events:none}
.gm-track{position:relative;width:38px;height:20px;border-radius:20px;background:rgba(255,255,255,.18);transition:background .15s}
.gm-track::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .15s}
.gm-switch input:checked+.gm-track{background:var(--g-accent,#b026ff);box-shadow:0 0 8px rgba(var(--g-hot-rgb,215,123,255),.6)}
.gm-switch input:checked+.gm-track::after{transform:translateX(18px)}
.gm-text{flex:1.4;padding:6px 10px;color:var(--g-text,#fff);background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.2);border-radius:4px;font:inherit}
.gm-text:focus{outline:none;border-color:var(--g-hot,#d77bff)}
.gm-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}
.gm-btn{padding:8px 16px;cursor:pointer;color:var(--g-on-accent,#fff);background:linear-gradient(90deg,var(--g-dark,#3b0a63),var(--g-accent,#b026ff));border:1px solid var(--g-hot,#d77bff);border-radius:var(--g-radius,6px);font:italic 700 12px/1 var(--g-font-display,'Chakra Petch',sans-serif);letter-spacing:.1em;text-transform:uppercase}
.gm-btn:hover{box-shadow:var(--g-glow)}
.gm-btn.is-ghost{background:transparent;color:var(--g-text,#fff)}
.gm-json{width:100%;min-height:78px;margin-top:8px;padding:8px 10px;resize:vertical;color:var(--g-silver,#cfc8e6);background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.18);border-radius:4px;font:12px/1.4 monospace}
.gm-fab{position:fixed;right:16px;bottom:112px;z-index:99999;width:40px;height:40px;border-radius:50%;cursor:pointer;color:var(--g-on-accent,#fff);background:radial-gradient(circle at 35% 30%,var(--g-hot,#d77bff),var(--g-accent,#b026ff) 62%,var(--g-dark,#3b0a63));border:none;box-shadow:var(--g-glow);font-size:18px}
`;

  function injectStyle() {
    if (document.getElementById("garage-menu-style")) return;
    const st = h("style", { id: "garage-menu-style" });
    st.textContent = MENU_CSS;
    document.head.append(st);
  }

  /* ------------------------------------------------------------------ */
  /*  Piezas del menú                                                    */
  /* ------------------------------------------------------------------ */
  let overlay = null;
  let body = null;

  const section = (title, ...kids) => h("div", { class: "gm-sec" }, h("h3", {}, title), ...kids);

  function themeCard(id, th) {
    const c = th.colors;
    return h(
      "button",
      {
        class: "gm-theme" + (id === s.theme ? " is-on" : ""),
        type: "button",
        onClick: () => {
          s.theme = id;
          s.custom = {};
          s.badge = "";
          s.ghost = "";
          apply();
          save();
          render();
          notify("Garage: " + th.name);
        },
      },
      h("div", { class: "gm-sw" }, [c.accent, c.hot, c.secondary, c.bg].map((col) => h("span", { style: "background:" + col }))),
      h("div", { class: "gm-tn" }, th.name),
      h("div", { class: "gm-ts" }, th.sub)
    );
  }

  function colorRow(key, label) {
    const c = currentPalette();
    return h(
      "label",
      { class: "gm-row" },
      h("span", { class: "gm-lab" }, label),
      h("input", {
        type: "color",
        value: c[key],
        onInput: (e) => {
          s.custom[key] = e.target.value;
          apply();
          save();
        },
      })
    );
  }

  function sliderRow(label, key, min, max, suffix) {
    const out = h("span", { class: "gm-val" }, s[key] + suffix);
    const input = h("input", {
      type: "range",
      min: String(min),
      max: String(max),
      step: "1",
      value: String(s[key]),
      onInput: (e) => {
        s[key] = Number(e.target.value);
        out.textContent = s[key] + suffix;
        apply();
        save();
      },
    });
    return h("label", { class: "gm-row" }, h("span", { class: "gm-lab" }, label), input, out);
  }

  function toggleRow(key, label) {
    return h(
      "label",
      { class: "gm-row gm-switch" },
      h("span", { class: "gm-lab" }, label),
      h("input", {
        type: "checkbox",
        checked: s.on[key],
        onChange: (e) => {
          s.on[key] = e.target.checked;
          apply();
          save();
        },
      }),
      h("span", { class: "gm-track" })
    );
  }

  function textRow(label, key, placeholder) {
    return h(
      "label",
      { class: "gm-row" },
      h("span", { class: "gm-lab" }, label),
      h("input", {
        class: "gm-text",
        type: "text",
        maxlength: "40",
        placeholder,
        value: s[key],
        onInput: (e) => {
          s[key] = e.target.value;
          apply();
          save();
        },
      })
    );
  }

  function exportBlock() {
    const ta = h("textarea", { class: "gm-json", spellcheck: "false" });
    ta.value = JSON.stringify(s);

    const copy = async () => {
      ta.value = JSON.stringify(s);
      try {
        await navigator.clipboard.writeText(ta.value);
      } catch (e) {
        ta.select();
        document.execCommand("copy");
      }
      notify("Garage: ajustes copiados");
    };

    const importJson = () => {
      try {
        s = merge(JSON.parse(ta.value));
        apply();
        save();
        render();
        notify("Garage: ajustes aplicados");
      } catch (e) {
        notify("Garage: ese JSON no es válido");
      }
    };

    return h(
      "div",
      {},
      ta,
      h(
        "div",
        { class: "gm-btns" },
        h("button", { class: "gm-btn", type: "button", onClick: copy }, "Copiar ajustes"),
        h("button", { class: "gm-btn", type: "button", onClick: importJson }, "Aplicar JSON pegado"),
        h(
          "button",
          {
            class: "gm-btn is-ghost",
            type: "button",
            onClick: () => {
              s = clone(DEFAULTS);
              apply();
              save();
              render();
              notify("Garage: todo restablecido");
            },
          },
          "Restablecer todo"
        )
      )
    );
  }

  function buildBody() {
    const t = THEMES[s.theme];
    return [
      section("Elige el coche", h("div", { class: "gm-themes" }, Object.entries(THEMES).map(([id, th]) => themeCard(id, th)))),
      section(
        "Colores",
        h("div", { class: "gm-colors" }, COLOR_FIELDS.map(([k, l]) => colorRow(k, l))),
        h(
          "div",
          { class: "gm-btns" },
          h(
            "button",
            {
              class: "gm-btn is-ghost",
              type: "button",
              onClick: () => {
                s.custom = {};
                apply();
                save();
                render();
              },
            },
            "Volver a los colores del tema"
          )
        )
      ),
      section(
        "Ajustes finos",
        sliderRow("Brillo neón", "glow", 0, 150, "%"),
        sliderRow("Bordes redondeados", "radius", 0, 20, "px"),
        sliderRow("Inclinación racing (placa, aguja)", "skew", 0, 14, "°")
      ),
      section("Adornos", h("div", { class: "gm-toggles" }, TOGGLES.map(([k, l]) => toggleRow(k, l)))),
      section(
        "Textos de adorno",
        textRow("Placa del reproductor", "badge", t.badge),
        textRow("Marca de agua gigante", "ghost", t.ghost)
      ),
      section("Guardar, compartir o restablecer", exportBlock()),
    ];
  }

  function render() {
    if (!body) return;
    const top = body.scrollTop;
    body.replaceChildren(...buildBody());
    body.scrollTop = top;
  }

  /* ------------------------------------------------------------------ */
  /*  Abrir / cerrar                                                     */
  /* ------------------------------------------------------------------ */
  function onKey(e) {
    if (e.key === "Escape") closeMenu();
  }

  function closeMenu() {
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    body = null;
    document.removeEventListener("keydown", onKey, true);
  }

  function openMenu() {
    if (overlay) return closeMenu();
    injectStyle();

    body = h("div", { class: "gm-body" });
    overlay = h(
      "div",
      {
        class: "gm-overlay",
        onClick: (e) => {
          if (e.target === overlay) closeMenu();
        },
      },
      h(
        "div",
        { class: "gm-panel" },
        h(
          "div",
          { class: "gm-head" },
          h("h2", { class: "gm-title" }, "Garage · Personalizar"),
          h("span", { class: "gm-hint" }, "Ctrl + Alt + G"),
          h("button", { class: "gm-x", type: "button", title: "Cerrar", onClick: closeMenu }, "✕")
        ),
        body
      )
    );
    document.body.append(overlay);
    document.addEventListener("keydown", onKey, true);
    render();
  }

  /* ------------------------------------------------------------------ */
  /*  Puntos de entrada                                                  */
  /* ------------------------------------------------------------------ */
  const ICON =
    '<svg viewBox="0 0 16 16" fill="currentColor" width="16" height="16"><rect x="2" y="1" width="1.5" height="14" rx=".75"/><rect x="7.25" y="1" width="1.5" height="14" rx=".75"/><rect x="12.5" y="1" width="1.5" height="14" rx=".75"/><circle cx="2.75" cy="10" r="2.25"/><circle cx="8" cy="5" r="2.25"/><circle cx="13.25" cy="11" r="2.25"/></svg>';

  function addEntryPoints() {
    let ok = false;

    try {
      if (Spicetify && Spicetify.Topbar && Spicetify.Topbar.Button) {
        new Spicetify.Topbar.Button("Garage", ICON, openMenu);
        ok = true;
      }
    } catch (e) {
      /* sigue con el resto */
    }

    try {
      if (Spicetify && Spicetify.Menu && Spicetify.Menu.Item) {
        const item = new Spicetify.Menu.Item("Garage · personalizar", false, openMenu);
        if (item.register) item.register();
        ok = true;
      }
    } catch (e) {
      /* sigue con el resto */
    }

    // Si no hay botón en la barra, ponemos uno flotante
    if (!ok) {
      injectStyle();
      document.body.append(h("button", { class: "gm-fab", type: "button", title: "Garage", onClick: openMenu }, "⚙"));
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.altKey && String(e.key).toLowerCase() === "g") {
      e.preventDefault();
      openMenu();
    }
  });

  // Aplicar los ajustes guardados cuanto antes para que no parpadee
  apply();

  let tries = 0;
  (function waitForSpicetify() {
    if ((window.Spicetify && Spicetify.Topbar && Spicetify.Topbar.Button && document.body) || tries++ > 30) {
      addEntryPoints();
      return;
    }
    setTimeout(waitForSpicetify, 250);
  })();
})();
