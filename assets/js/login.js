/**
 * seuMota — login.js
 */

const $ = (id) => document.getElementById(id);

/* ─── PRE-SELECT ACCOUNT TYPE FROM URL OR SESSION ──── */
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const urlType = params.get("type");
  const sessionType = sessionStorage.getItem("loginType");
  const accountType = urlType || sessionType || "cliente";

  // Select the correct radio
  const radio = document.querySelector(
    `input[name="accountType"][value="${accountType}"]`,
  );
  if (radio) {
    radio.checked = true;
    // Trigger visual update
    const allCards = document.querySelectorAll(".account-type-card");
    allCards.forEach((card) => {
      const isSelected = card.dataset.type === accountType;
      card.style.border = isSelected
        ? "2px solid var(--orange)"
        : "2px solid var(--sand)";
      card.style.background = isSelected
        ? "var(--orange-soft)"
        : "var(--white)";
      card.style.color = isSelected ? "var(--ink)" : "var(--ink-mid)";
    });
  }
});

/* ─── ACCOUNT TYPE TOGGLE ─────────────────────────── */
document.querySelectorAll(".account-type-option").forEach((option) => {
  option.addEventListener("click", function () {
    const input = this.querySelector('input[type="radio"]');
    const allCards = document.querySelectorAll(".account-type-card");

    // Update radio selection
    input.checked = true;

    // Update visual state
    allCards.forEach((card) => {
      const isSelected = card.dataset.type === input.value;
      card.style.border = isSelected
        ? "2px solid var(--orange)"
        : "2px solid var(--sand)";
      card.style.background = isSelected
        ? "var(--orange-soft)"
        : "var(--white)";
      card.style.color = isSelected ? "var(--ink)" : "var(--ink-mid)";
    });
  });
});

/* ─── PASSWORD TOGGLE ─────────────────────────────── */
document.querySelectorAll(".toggle-pass").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = $(btn.dataset.target);
    if (!input) return;
    const isPass = input.type === "password";
    input.type = isPass ? "text" : "password";
    btn.textContent = isPass ? "🙈" : "👁️";
  });
});

/* ─── HELPERS ─────────────────────────────────────── */
function showError(fieldId, errId, show) {
  $(fieldId)?.classList.toggle("error", show);
  $(errId)?.classList.toggle("visible", show);
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/* ─── INLINE VALIDATION ───────────────────────────── */
$("email")?.addEventListener("blur", () => {
  showError("email", "emailErr", !isValidEmail($("email").value));
});

$("password")?.addEventListener("blur", () => {
  showError("password", "passwordErr", $("password").value.length === 0);
});

["email", "password"].forEach((id) => {
  $(id)?.addEventListener("input", () => $(id).classList.remove("error"));
});

/* ─── FORM SUBMIT ─────────────────────────────────── */
$("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = $("email").value;
  const password = $("password").value;
  let ok = true;

  showError("email", "emailErr", !isValidEmail(email));
  showError("password", "passwordErr", !password);

  if (!isValidEmail(email) || !password) ok = false;
  if (!ok) return;

  const btn = $("loginBtn");
  btn.textContent = "Entrando...";
  btn.disabled = true;

  // Simulate API call — replace with real fetch('/auth/login')
  setTimeout(() => {
    // Get selected account type
    const accountType = document.querySelector(
      'input[name="accountType"]:checked',
    ).value;

    // Simulate wrong password on first try for demo
    const isDemo = sessionStorage.getItem("loginTried");

    if (!isDemo) {
      sessionStorage.setItem("loginTried", "1");
      // Redirect based on account type
      const dashboard =
        accountType === "mota"
          ? "/pages/providers/dashboard-mota.html"
          : "/pages/users/dashboard-usuario.html";
      window.location.href = dashboard;
    } else {
      // Show error
      const alert = $("loginAlert");
      alert.style.display = "flex";
      btn.textContent = "Entrar →";
      btn.disabled = false;
    }
  }, 1200);
});
