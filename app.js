const CONTACT_FORM_URL = "https://forms.gle/GrBwDH6KkMoAjNst7";

const FAVORITE_STORAGE_KEY = "white-company-navi-favorites";

const fallbackCompanies = [
  {
    id: 1,
    name: "岡崎精密サンプル株式会社",
    prefecture: "愛知県",
    city: "岡崎市",
    industry: "製造業",
    jobs: ["生産技術", "品質保証", "機械設計"],
    companySize: "300〜999人",
    overtime: "月平均12時間",
    paidLeave: "有休取得率78%",
    certifications: ["ユースエール"],
    whiteScore: 88,
    hiddenScore: 91,
    summary:
      "知名度は高くないものの、残業時間や有休取得率のサンプル指標が良好なBtoB製造業です。安定性と働きやすさを重視する人向けの候補です。",
    sourceText: "サンプルデータ",
    sourceUrl: "https://example.com"
  },
  {
    id: 2,
    name: "豊田部品システムサンプル株式会社",
    prefecture: "愛知県",
    city: "豊田市",
    industry: "自動車部品",
    jobs: ["製造技術", "電気設計", "営業"],
    companySize: "100〜299人",
    overtime: "月平均18時間",
    paidLeave: "有休取得率72%",
    certifications: ["くるみん"],
    whiteScore: 83,
    hiddenScore: 89,
    summary:
      "大手ほど知名度は高くない一方、地域密着型の安定した部品メーカーという想定のサンプル企業です。転勤を抑えて働きたい人に向きます。",
    sourceText: "サンプルデータ",
    sourceUrl: "https://example.com"
  },
  {
    id: 3,
    name: "刈谷ITソリューションサンプル株式会社",
    prefecture: "愛知県",
    city: "刈谷市",
    industry: "IT・ソフトウェア",
    jobs: ["ソフト設計", "社内SE", "システム営業"],
    companySize: "100〜299人",
    overtime: "月平均10時間",
    paidLeave: "有休取得率80%",
    certifications: ["えるぼし"],
    whiteScore: 90,
    hiddenScore: 84,
    summary:
      "働き方の柔軟性が高い想定のIT系サンプル企業です。残業の少なさや休みやすさを重視する転職者にとって候補になりやすい設定です。",
    sourceText: "サンプルデータ",
    sourceUrl: "https://example.com"
  },
  {
    id: 4,
    name: "安城FAテックサンプル株式会社",
    prefecture: "愛知県",
    city: "安城市",
    industry: "FA・設備",
    jobs: ["機械設計", "電気設計", "生産技術"],
    companySize: "300〜999人",
    overtime: "月平均20時間",
    paidLeave: "有休取得率70%",
    certifications: ["健康経営優良法人"],
    whiteScore: 81,
    hiddenScore: 93,
    summary:
      "BtoB領域で知名度は控えめながら、技術職のキャリアを積みやすい想定のサンプル企業です。穴場度を高めに設定しています。",
    sourceText: "サンプルデータ",
    sourceUrl: "https://example.com"
  },
  {
    id: 5,
    name: "名古屋ライフケアサンプル株式会社",
    prefecture: "愛知県",
    city: "名古屋市",
    industry: "医療・福祉",
    jobs: ["人事", "経理", "営業", "企画"],
    companySize: "1000人以上",
    overtime: "月平均14時間",
    paidLeave: "有休取得率76%",
    certifications: ["くるみん", "えるぼし"],
    whiteScore: 87,
    hiddenScore: 78,
    summary:
      "制度面の整備が進んでいる想定のサンプル企業です。子育てや長期就業との両立を重視する人に向きやすい設定です。",
    sourceText: "サンプルデータ",
    sourceUrl: "https://example.com"
  }
];

let companies = [];
let filteredCompanies = [];
let favorites = loadFavorites();
let favoriteOnly = false;

const elements = {
  totalCount: document.getElementById("totalCount"),
  avgWhiteScore: document.getElementById("avgWhiteScore"),
  avgHiddenScore: document.getElementById("avgHiddenScore"),
  searchInput: document.getElementById("searchInput"),
  cityFilter: document.getElementById("cityFilter"),
  industryFilter: document.getElementById("industryFilter"),
  jobFilter: document.getElementById("jobFilter"),
  sortSelect: document.getElementById("sortSelect"),
  favoriteOnlyButton: document.getElementById("favoriteOnlyButton"),
  resetButton: document.getElementById("resetButton"),
  companyList: document.getElementById("companyList"),
  emptyState: document.getElementById("emptyState"),
  modalOverlay: document.getElementById("modalOverlay"),
  modalCloseButton: document.getElementById("modalCloseButton"),
  modalContent: document.getElementById("modalContent"),
  contactButton: document.getElementById("contactButton"),
  contactTopButton: document.getElementById("contactTopButton")
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  companies = await loadCompanies();

  setupFilters();
  setupEvents();

  applyFilters();
}

async function loadCompanies() {
  try {
    const response = await fetch("companies.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("companies.json を読み込めませんでした。");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("companies.json の形式が配列ではありません。");
    }

    return data;
  } catch (error) {
    console.warn(error);
    return fallbackCompanies;
  }
}

function setupFilters() {
  const cities = unique(companies.map((company) => company.city));
  const industries = unique(companies.map((company) => company.industry));
  const jobs = unique(companies.flatMap((company) => company.jobs));

  fillSelect(elements.cityFilter, cities, "地域すべて");
  fillSelect(elements.industryFilter, industries, "業界すべて");
  fillSelect(elements.jobFilter, jobs, "職種すべて");
}

function fillSelect(selectElement, values, firstLabel) {
  selectElement.innerHTML = "";

  const firstOption = document.createElement("option");
  firstOption.value = "";
  firstOption.textContent = firstLabel;
  selectElement.appendChild(firstOption);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  });
}

function setupEvents() {
  elements.searchInput.addEventListener("input", applyFilters);
  elements.cityFilter.addEventListener("change", applyFilters);
  elements.industryFilter.addEventListener("change", applyFilters);
  elements.jobFilter.addEventListener("change", applyFilters);
  elements.sortSelect.addEventListener("change", applyFilters);

  elements.favoriteOnlyButton.addEventListener("click", () => {
    favoriteOnly = !favoriteOnly;
    elements.favoriteOnlyButton.classList.toggle("active", favoriteOnly);
    applyFilters();
  });

  elements.resetButton.addEventListener("click", () => {
    elements.searchInput.value = "";
    elements.cityFilter.value = "";
    elements.industryFilter.value = "";
    elements.jobFilter.value = "";
    elements.sortSelect.value = "hiddenScore";
    favoriteOnly = false;
    elements.favoriteOnlyButton.classList.remove("active");
    applyFilters();
  });

  elements.modalCloseButton.addEventListener("click", closeModal);

  elements.modalOverlay.addEventListener("click", (event) => {
    if (event.target === elements.modalOverlay) {
      closeModal();
    }
  });

  elements.contactButton.addEventListener("click", openContactForm);
  elements.contactTopButton.addEventListener("click", openContactForm);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}

function applyFilters() {
  const keyword = elements.searchInput.value.trim().toLowerCase();
  const city = elements.cityFilter.value;
  const industry = elements.industryFilter.value;
  const job = elements.jobFilter.value;
  const sort = elements.sortSelect.value;

  filteredCompanies = companies.filter((company) => {
    const searchTarget = [
      company.name,
      company.prefecture,
      company.city,
      company.industry,
      company.companySize,
      company.overtime,
      company.paidLeave,
      company.summary,
      company.sourceText,
      ...(company.jobs || []),
      ...(company.certifications || [])
    ]
      .join(" ")
      .toLowerCase();

    const keywordMatch = !keyword || searchTarget.includes(keyword);
    const cityMatch = !city || company.city === city;
    const industryMatch = !industry || company.industry === industry;
    const jobMatch = !job || company.jobs.includes(job);
    const favoriteMatch = !favoriteOnly || favorites.includes(company.id);

    return keywordMatch && cityMatch && industryMatch && jobMatch && favoriteMatch;
  });

  sortCompanies(filteredCompanies, sort);

  renderStats();
  renderCompanies();
}

function sortCompanies(list, sort) {
  if (sort === "whiteScore") {
    list.sort((a, b) => b.whiteScore - a.whiteScore);
    return;
  }

  if (sort === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name, "ja"));
    return;
  }

  list.sort((a, b) => b.hiddenScore - a.hiddenScore);
}

function renderStats() {
  elements.totalCount.textContent = filteredCompanies.length;

  const avgWhite = average(filteredCompanies.map((company) => company.whiteScore));
  const avgHidden = average(filteredCompanies.map((company) => company.hiddenScore));

  elements.avgWhiteScore.textContent = avgWhite;
  elements.avgHiddenScore.textContent = avgHidden;
}

function renderCompanies() {
  elements.companyList.innerHTML = "";

  if (filteredCompanies.length === 0) {
    elements.emptyState.style.display = "block";
    return;
  }

  elements.emptyState.style.display = "none";

  filteredCompanies.forEach((company, index) => {
    const card = document.createElement("article");
    card.className = "company-card";

    const isFavorite = favorites.includes(company.id);

    card.innerHTML = `
      <div class="company-card-main">
        <div class="company-top">
          <div class="rank">#${index + 1}</div>

          <button
            class="favorite-button ${isFavorite ? "active" : ""}"
            aria-label="お気に入り"
            data-favorite-id="${company.id}"
          >
            ★
          </button>
        </div>

        <h3 class="company-name">${escapeHtml(company.name)}</h3>

        <p class="meta">
          ${escapeHtml(company.city)} / ${escapeHtml(company.industry)} / ${escapeHtml(company.companySize)}
        </p>

        <div class="score-row">
          <div class="score-box">
            <span>ホワイト度</span>
            <strong>${company.whiteScore}</strong>
          </div>

          <div class="score-box">
            <span>穴場度</span>
            <strong>${company.hiddenScore}</strong>
          </div>
        </div>

        <div class="tag-list">
          ${company.jobs.map((job) => `<span class="tag">${escapeHtml(job)}</span>`).join("")}
          ${company.certifications
            .map((certification) => `<span class="tag green">${escapeHtml(certification)}</span>`)
            .join("")}
        </div>

        <p class="summary">${escapeHtml(company.summary)}</p>
      </div>

      <div class="company-card-footer">
        <button class="detail-button" data-detail-id="${company.id}">
          詳細を見る
        </button>
      </div>
    `;

    elements.companyList.appendChild(card);
  });

  document.querySelectorAll("[data-favorite-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.favoriteId);
      toggleFavorite(id);
    });
  });

  document.querySelectorAll("[data-detail-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.detailId);
      openModal(id);
    });
  });
}

function openModal(id) {
  const company = companies.find((item) => item.id === id);

  if (!company) {
    return;
  }

  elements.modalContent.innerHTML = `
    <p class="eyebrow">Company Detail</p>

    <h2>${escapeHtml(company.name)}</h2>

    <p class="meta">
      ${escapeHtml(company.prefecture)}${escapeHtml(company.city)} / ${escapeHtml(company.industry)}
    </p>

    <p>${escapeHtml(company.summary)}</p>

    <div class="detail-grid">
      <div class="detail-item">
        <span>ホワイト度</span>
        <strong>${company.whiteScore}点</strong>
      </div>

      <div class="detail-item">
        <span>穴場度</span>
        <strong>${company.hiddenScore}点</strong>
      </div>

      <div class="detail-item">
        <span>企業規模</span>
        <strong>${escapeHtml(company.companySize)}</strong>
      </div>

      <div class="detail-item">
        <span>平均残業</span>
        <strong>${escapeHtml(company.overtime)}</strong>
      </div>

      <div class="detail-item">
        <span>有休</span>
        <strong>${escapeHtml(company.paidLeave)}</strong>
      </div>

      <div class="detail-item">
        <span>認定・特徴</span>
        <strong>${escapeHtml(company.certifications.join("、"))}</strong>
      </div>

      <div class="detail-item">
        <span>想定職種</span>
        <strong>${escapeHtml(company.jobs.join("、"))}</strong>
      </div>

      <div class="detail-item">
        <span>出典</span>
        <strong>${escapeHtml(company.sourceText)}</strong>
      </div>
    </div>

    <p>
      <a class="source-link" href="${escapeAttribute(company.sourceUrl)}" target="_blank" rel="noopener noreferrer">
        出典・公式情報を見る
      </a>
    </p>

    <p class="meta">
      ※ 本情報は企業研究の参考情報です。応募・転職判断の前には、必ず公式情報・求人票・面接等で最新情報を確認してください。
    </p>
  `;

  elements.modalOverlay.classList.add("active");
}

function closeModal() {
  elements.modalOverlay.classList.remove("active");
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((favoriteId) => favoriteId !== id);
  } else {
    favorites.push(id);
  }

  saveFavorites();
  applyFilters();
}

function loadFavorites() {
  try {
    const saved = localStorage.getItem(FAVORITE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(favorites));
}

function openContactForm() {
  if (CONTACT_FORM_URL.includes("ここをGoogleフォームURLに置き換え")) {
    alert(
      "まだGoogleフォームURLが設定されていません。\napp.js の CONTACT_FORM_URL を置き換えてください。"
    );
    return;
  }

  window.open(CONTACT_FORM_URL, "_blank", "noopener,noreferrer");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "ja")
  );
}

function average(values) {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + Number(value || 0), 0);
  return Math.round(total / values.length);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value || "#");
}