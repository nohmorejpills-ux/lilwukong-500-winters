/* lilwukong《五百个冬天》NFC 专属编号（静态方案）
 *
 * 贴片网址格式：?nfc=official&no=0136
 * 打开即展示这张实体专辑的专属编号 + 对应编号的电子签名图。
 * 纯静态、无后端；编号超出 1 ~ TOTAL_EDITIONS 视为无效入口。
 */

const CLAIM_CONFIG = {
  SIGNATURE_POOL: 6, // assets/signatures/ 里的签名图数量（sig-01.png ~ sig-06.png）
  TOTAL_EDITIONS: 500, // 总发行量
};

const CLAIM_I18N = {
  zh: {
    kicker: "官方实体 NFC 入口",
    staticTitle: "官方专属编号",
    staticMeta: "本机第 {scans} 次查看 · 全球限量 {total} 张",
    invalid: "无法验证的入口",
    invalidMeta: "该编号不在发行范围内，请认准官方渠道",
    invalidHint: "认准官方域名 {host}",
    enter: "进入专辑",
    signatureAlt: "lilwukong 电子签名",
    no: "No.",
  },
  en: {
    kicker: "Official physical NFC entry",
    staticTitle: "Official album number",
    staticMeta: "Viewed {scans} times on this device · Limited to {total} copies",
    invalid: "Entry cannot be verified",
    invalidMeta: "This number is outside the official run. Please use official channels.",
    invalidHint: "Official domain: {host}",
    enter: "Enter the album",
    signatureAlt: "lilwukong electronic signature",
    no: "No.",
  },
};

const claimOverlay = document.querySelector("#claimOverlay");
const claimCard = document.querySelector("#claimCard");
const claimKicker = document.querySelector("#claimKicker");
const claimSignature = document.querySelector("#claimSignature");
const claimTitle = document.querySelector("#claimTitle");
const claimNumber = document.querySelector("#claimNumber");
const claimTotal = document.querySelector("#claimTotal");
const claimMeta = document.querySelector("#claimMeta");
const claimHint = document.querySelector("#claimHint");
const claimEnter = document.querySelector("#claimEnter");

function claimLang() {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get("lang");
  if (["zh", "en"].includes(urlLang)) return urlLang;
  try {
    const saved = localStorage.getItem("lilwukong-language");
    if (["zh", "en"].includes(saved)) return saved;
  } catch {
    // ignore
  }
  return (navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en";
}

function ct(key, values = {}) {
  const template = CLAIM_I18N[claimLang()]?.[key] || CLAIM_I18N.zh[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}

function padNo(no) {
  return String(no).padStart(4, "0");
}

function signatureSrc(albumNo) {
  const pool = Math.max(1, CLAIM_CONFIG.SIGNATURE_POOL);
  const index = ((albumNo - 1) % pool) + 1;
  return `assets/signatures/sig-${String(index).padStart(2, "0")}.png`;
}

function bumpStaticScans(no) {
  try {
    const key = `lw-nfc-static-${no}`;
    const scans = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, String(scans));
    return scans;
  } catch {
    return 1;
  }
}

function showClaimOverlay() {
  claimOverlay.hidden = false;
  document.body.classList.add("claim-open");
}

function hideClaimOverlay() {
  claimOverlay.hidden = true;
  document.body.classList.remove("claim-open");
}

function renderInvalid() {
  claimCard.dataset.state = "invalid";
  claimKicker.textContent = ct("kicker");
  claimSignature.hidden = true;
  claimTitle.textContent = ct("invalid");
  claimNumber.textContent = "";
  claimTotal.textContent = "";
  claimMeta.textContent = ct("invalidMeta");
  claimHint.textContent = ct("invalidHint", { host: window.location.host });
  claimEnter.hidden = false;
  claimEnter.textContent = ct("enter");
}

function runStaticFlow(no) {
  const total = CLAIM_CONFIG.TOTAL_EDITIONS;
  showClaimOverlay();

  if (!Number.isInteger(no) || no < 1 || no > total) {
    renderInvalid();
    return;
  }

  const scans = bumpStaticScans(no);
  claimCard.dataset.state = "static";
  claimKicker.textContent = ct("kicker");
  claimSignature.src = signatureSrc(no);
  claimSignature.alt = ct("signatureAlt");
  claimSignature.hidden = false;
  claimTitle.textContent = ct("staticTitle");
  claimNumber.textContent = `${ct("no")} ${padNo(no)}`;
  claimTotal.textContent = `/ ${total}`;
  claimMeta.textContent = ct("staticMeta", { scans, total });
  claimHint.textContent = "";
  claimEnter.hidden = false;
  claimEnter.textContent = ct("enter");
}

claimEnter?.addEventListener("click", hideClaimOverlay);

// 语言切换时同步证书文案
new MutationObserver(() => {
  if (claimOverlay.hidden) return;
  const noParam = new URLSearchParams(window.location.search).get("no");
  if (noParam) runStaticFlow(parseInt(noParam, 10));
}).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

(function bootClaim() {
  if (!claimOverlay) return;
  const noParam = new URLSearchParams(window.location.search).get("no");
  if (noParam) {
    runStaticFlow(parseInt(noParam, 10));
  }
})();
