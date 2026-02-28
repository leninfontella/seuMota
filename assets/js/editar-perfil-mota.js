/**
 * seuMota — editar-perfil-mota.js
 */

/* ─── TOAST ───────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

/* ─── BIO COUNTER ─────────────────────────────────── */
const bioInput = document.getElementById("bioInput");
const bioCount = document.getElementById("bioCount");

function updateBioCount() {
  const len = bioInput?.value.length || 0;
  if (bioCount) {
    bioCount.textContent = len;
    bioCount.style.color = len > 180 ? "var(--orange)" : "var(--ink-light)";
  }
  updatePreviewBio();
}

bioInput?.addEventListener("input", updateBioCount);
updateBioCount();

/* ─── CATEGORY TOGGLES ────────────────────────────── */
const activeCats = new Set(
  [...document.querySelectorAll(".cat-toggle.on")].map((b) => b.dataset.cat),
);

document.querySelectorAll(".cat-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.cat;
    if (activeCats.has(cat)) {
      activeCats.delete(cat);
      btn.classList.remove("on");
    } else {
      activeCats.add(cat);
      btn.classList.add("on");
    }
    updatePreviewCats();
  });
});

/* ─── AVAILABILITY GRID ───────────────────────────── */
const DAYS = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];
const SLOTS = ["Manhã", "Tarde", "Noite"];
const DEFAULT_ON = {
  Segunda: ["Manhã", "Tarde", "Noite"],
  Terça: ["Manhã", "Tarde", "Noite"],
  Quarta: ["Manhã", "Tarde"],
  Quinta: ["Manhã", "Tarde", "Noite"],
  Sexta: ["Manhã", "Tarde", "Noite"],
  Sábado: ["Manhã"],
  Domingo: [],
};

const grid = document.getElementById("availGrid");
if (grid) {
  grid.innerHTML = "";
  DAYS.forEach((day) => {
    const label = document.createElement("div");
    label.className = "avail-day-label";
    label.textContent = day;

    const slotsWrap = document.createElement("div");
    slotsWrap.className = "avail-slots";

    SLOTS.forEach((slot) => {
      const btn = document.createElement("button");
      btn.className =
        "slot-btn" + (DEFAULT_ON[day]?.includes(slot) ? " on" : "");
      btn.textContent = slot;
      btn.addEventListener("click", () => btn.classList.toggle("on"));
      slotsWrap.appendChild(btn);
    });

    grid.appendChild(label);
    grid.appendChild(slotsWrap);
  });
}

/* ─── LIVE PREVIEW ────────────────────────────────── */
const CAT_LABELS = {
  mercado: "🛒 Mercado",
  banco: "🏦 Banco",
  farmacia: "💊 Farmácia",
  lixo: "🗑️ Lixo",
  encomenda: "📦 Encomenda",
  lavanderia: "👕 Lavanderia",
  pet: "🐾 Pet",
  limpeza: "🧹 Limpeza",
  mudanca: "📦 Mudança",
  manutencao: "🔧 Reparos",
  outros: "🔖 Outros",
};

function updatePreviewCats() {
  const el = document.getElementById("previewCats");
  if (!el) return;
  el.innerHTML = [...activeCats]
    .map((c) => `<div class="preview-cat">${CAT_LABELS[c] || c}</div>`)
    .join("");
}

function updatePreviewBio() {
  const el = document.getElementById("previewBio");
  if (el)
    el.textContent =
      (bioInput?.value || "").slice(0, 80) +
      (bioInput?.value?.length > 80 ? "..." : "");
}

function updatePreviewName() {
  const el = document.getElementById("previewName");
  const n = document.getElementById("fieldNome")?.value || "";
  const s = document.getElementById("fieldSobrenome")?.value || "";
  if (el) el.textContent = `${n} ${s}`.trim();
}

["fieldNome", "fieldSobrenome"].forEach((id) => {
  document.getElementById(id)?.addEventListener("input", updatePreviewName);
});

// Initial render
updatePreviewCats();
updatePreviewBio();
updatePreviewName();

/* ─── PROFILE PIC HOVER ───────────────────────────── */
const pic = document.getElementById("profilePic");
const picOverlayEl = document.getElementById("picOverlay");
pic?.addEventListener("mouseover", () => {
  if (picOverlayEl) picOverlayEl.style.opacity = "1";
});
pic?.addEventListener("mouseout", () => {
  if (picOverlayEl) picOverlayEl.style.opacity = "0";
});
pic?.addEventListener("click", () =>
  showToast("📷 Upload de foto disponível no app móvel"),
);

/* ─── EDIT PIX ────────────────────────────────────── */
document.getElementById("editPixBtn")?.addEventListener("click", () => {
  showToast("🔑 Edição de dados bancários requer verificação por SMS");
});

/* ─── SAVE ────────────────────────────────────────── */
document.getElementById("savePerfil")?.addEventListener("click", () => {
  const btn = document.getElementById("savePerfil");
  btn.textContent = "Salvando...";
  btn.disabled = true;

  // Simulate PATCH /providers/:id
  setTimeout(() => {
    btn.textContent = "💾 Salvar perfil";
    btn.disabled = false;
    showToast("✅ Perfil atualizado com sucesso!");
  }, 1200);
});
