(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};

  function isPlaceholder(value) {
    return !value || value.indexOf("YOUR_") !== -1;
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Earliest pickable day is today
  document.querySelectorAll('input[type="date"]').forEach(function (el) {
    var d = new Date();
    var local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    el.min = local.toISOString().slice(0, 10);
  });

  // Buttons that preselect FIX or POUR, plus ?service=POUR in the URL
  function selectService(name) {
    var input = document.querySelector('input[name="service"][value="' + name + '"]');
    if (input) input.checked = true;
  }
  document.querySelectorAll("[data-pick]").forEach(function (el) {
    el.addEventListener("click", function () { selectService(el.getAttribute("data-pick")); });
  });
  var params = new URLSearchParams(window.location.search);
  if (params.get("service")) selectService(params.get("service").toUpperCase());

  // Payment buttons
  var payMap = { paypal: cfg.PAYPAL, cashapp: cfg.CASHAPP, venmo: cfg.VENMO };
  Object.keys(payMap).forEach(function (key) {
    var el = document.querySelector('[data-pay="' + key + '"]');
    if (!el) return;
    var url = payMap[key];
    if (isPlaceholder(url)) {
      el.setAttribute("aria-disabled", "true");
      el.removeAttribute("href");
      el.addEventListener("click", function (e) {
        e.preventDefault();
        alert("This payment option is being set up. Please use another option or ask me after booking.");
      });
    } else {
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener";
    }
  });

  var zBtn = document.querySelector('[data-pay="zelle"]');
  var zMsg = document.getElementById("zelle-msg");
  if (zBtn && zMsg) {
    zMsg.textContent = cfg.ZELLE
      ? "Send $50 with Zelle to: " + cfg.ZELLE + ". Put your name in the memo."
      : "Zelle does not have a pay link. I will send you my Zelle details when I confirm your booking.";
    zBtn.addEventListener("click", function () {
      zMsg.classList.toggle("show");
      zBtn.setAttribute("aria-expanded", zMsg.classList.contains("show") ? "true" : "false");
    });
  }

  // Forms: send to Formspree without leaving the page
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');
    var buttonText = button ? button.textContent : "";

    function show(kind, msg) {
      status.className = "form-status show " + kind;
      status.textContent = msg;
      status.setAttribute("tabindex", "-1");
      status.focus({ preventScroll: false });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (isPlaceholder(cfg.FORM_ENDPOINT)) {
        show("err", "The booking form is not connected yet. Please check back soon.");
        return;
      }

      if (button) { button.disabled = true; button.textContent = "Sending..."; }

      fetch(cfg.FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            show("ok", form.getAttribute("data-success") || "Got it. I will reply soon to confirm.");
            return;
          }
          return res.json().then(function (data) {
            var msg = data && data.errors ? data.errors.map(function (x) { return x.message; }).join(", ") : "";
            show("err", "That did not go through" + (msg ? ": " + msg : "") + ". Please try again.");
          });
        })
        .catch(function () {
          show("err", "Network problem. Check your connection and try again.");
        })
        .then(function () {
          if (button) { button.disabled = false; button.textContent = buttonText; }
        });
    });
  });
})();
