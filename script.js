const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const navShell = document.querySelector(".nav-shell");
const downloadModal = document.querySelector("[data-download-modal]");
const openDownloadButtons = document.querySelectorAll("[data-open-download]");
const closeDownloadButtons = document.querySelectorAll("[data-close-download]");

const FALLBACK_RELEASES = {
  app: {
    tag: "v0.1.8-experimental.11",
    name: "אוצריא AI 0.1.8 ניסיוני",
    publishedAt: "2026-04-05T19:24:18Z",
    prerelease: true,
    assets: [
      {
        name: "OtzariaAI-0.1.8-windows.zip",
        size: 106375594,
        platform: "windows",
        url: "https://github.com/arieldaniely/otzariaAI/releases/download/v0.1.8-experimental.11/OtzariaAI-0.1.8-windows.zip",
      },
      {
        name: "OtzariaAI-0.1.8-macos.zip",
        size: 80165453,
        platform: "macos",
        url: "https://github.com/arieldaniely/otzariaAI/releases/download/v0.1.8-experimental.11/OtzariaAI-0.1.8-macos.zip",
      },
      {
        name: "OtzariaAI-0.1.8-linux.tar.gz",
        size: 127570222,
        platform: "linux",
        url: "https://github.com/arieldaniely/otzariaAI/releases/download/v0.1.8-experimental.11/OtzariaAI-0.1.8-linux.tar.gz",
      },
    ],
  },
  otzariaDb: {
    tag: "db-v134",
    name: "db-v134",
    publishedAt: "2026-03-29T23:20:46Z",
    assets: [
      {
        name: "seforim.db.zst",
        size: 1080425369,
        url: "https://github.com/Otzaria/SeforimLibrary/releases/download/db-v134/seforim.db.zst",
      },
      {
        name: "133-134.DIFF.zst",
        size: 226359200,
        url: "https://github.com/Otzaria/SeforimLibrary/releases/download/db-v134/133-134.DIFF.zst",
      },
      {
        name: "seforim-manifest.json",
        size: 72,
        url: "https://github.com/Otzaria/SeforimLibrary/releases/download/db-v134/seforim-manifest.json",
      },
    ],
  },
  zayitDb: {
    tag: "20260114122617",
    name: "20260114122617",
    publishedAt: "2026-01-15T05:41:46Z",
    assets: [
      {
        name: "seforim_bundle.tar.zst.part01",
        size: 2040109465,
        url: "https://github.com/kdroidFilter/SeforimLibrary/releases/download/20260114122617/seforim_bundle.tar.zst.part01",
      },
      {
        name: "seforim_bundle.tar.zst.part02",
        size: 964051608,
        url: "https://github.com/kdroidFilter/SeforimLibrary/releases/download/20260114122617/seforim_bundle.tar.zst.part02",
      },
    ],
  },
};

const syncTopbarState = () => {
  if (!topbar) {
    return;
  }

  topbar.classList.toggle("is-scrolled", window.scrollY > 18);
};

syncTopbarState();
window.addEventListener("scroll", syncTopbarState, { passive: true });

if (menuToggle && topbar && navShell) {
  menuToggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navShell.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      topbar.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((section) => {
  revealObserver.observe(section);
});

document.querySelectorAll(".comparison").forEach((comparison) => {
  const range = comparison.querySelector(".comparison-range");

  if (!range) {
    return;
  }

  const syncSplit = () => {
    comparison.style.setProperty("--split", `${range.value}%`);
  };

  range.addEventListener("input", syncSplit);
  syncSplit();
});

const openDownloadModal = () => {
  if (!downloadModal) {
    return;
  }

  downloadModal.hidden = false;
  document.body.classList.add("download-open");

  if (location.hash !== "#download") {
    history.replaceState(null, "", "#download");
  }
};

const closeDownloadModal = () => {
  if (!downloadModal) {
    return;
  }

  downloadModal.hidden = true;
  document.body.classList.remove("download-open");

  if (location.hash === "#download") {
    history.replaceState(null, "", `${location.pathname}${location.search}`);
  }
};

openDownloadButtons.forEach((button) => {
  button.addEventListener("click", openDownloadModal);
});

closeDownloadButtons.forEach((button) => {
  button.addEventListener("click", closeDownloadModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && downloadModal && !downloadModal.hidden) {
    closeDownloadModal();
  }
});

window.addEventListener("hashchange", () => {
  if (location.hash === "#download") {
    openDownloadModal();
  } else if (downloadModal && !downloadModal.hidden) {
    closeDownloadModal();
  }
});

if (location.hash === "#download") {
  openDownloadModal();
}

const formatBytes = (value) => {
  if (!Number.isFinite(value)) {
    return "";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 100 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
};

const detectPlatform = () => {
  const platformValue =
    navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || "";
  const ua = `${platformValue} ${navigator.userAgent}`.toLowerCase();
  const archSource = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();

  let key = "windows";
  let label = "Windows";

  if (ua.includes("mac")) {
    key = "macos";
    label = "macOS";
  } else if (ua.includes("linux") || ua.includes("x11")) {
    key = "linux";
    label = "Linux";
  }

  let arch = "64-bit";
  if (archSource.includes("arm") || archSource.includes("aarch64")) {
    arch = "ARM";
  }

  return { key, label, arch };
};

const mapPlatformFromAssetName = (name) => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("windows")) {
    return "windows";
  }

  if (lowerName.includes("macos") || lowerName.includes("mac")) {
    return "macos";
  }

  if (lowerName.includes("linux")) {
    return "linux";
  }

  return "other";
};

const normalizeAppRelease = (payload) => {
  const release = (Array.isArray(payload) ? payload : [payload]).find((item) => !item.draft);

  if (!release) {
    return FALLBACK_RELEASES.app;
  }

  return {
    tag: release.tag_name,
    name: release.name || release.tag_name,
    publishedAt: release.published_at,
    prerelease: Boolean(release.prerelease),
    assets: (release.assets || []).map((asset) => ({
      name: asset.name,
      size: asset.size,
      url: asset.browser_download_url,
      platform: mapPlatformFromAssetName(asset.name),
    })),
  };
};

const normalizeDbRelease = (payload, fallback) => ({
  tag: payload.tag_name || fallback.tag,
  name: payload.name || payload.tag_name || fallback.name,
  publishedAt: payload.published_at || fallback.publishedAt,
  assets: (payload.assets || []).map((asset) => ({
    name: asset.name,
    size: asset.size,
    url: asset.browser_download_url,
  })),
});

const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.json();
};

const loadReleaseData = async () => {
  const appPromise = fetchJson("https://api.github.com/repos/arieldaniely/otzariaAI/releases?per_page=6")
    .then(normalizeAppRelease)
    .catch(() => FALLBACK_RELEASES.app);

  const otzariaDbPromise = fetchJson("https://api.github.com/repos/Otzaria/SeforimLibrary/releases/latest")
    .then((payload) => normalizeDbRelease(payload, FALLBACK_RELEASES.otzariaDb))
    .catch(() => FALLBACK_RELEASES.otzariaDb);

  const zayitDbPromise = fetchJson("https://api.github.com/repos/kdroidFilter/SeforimLibrary/releases/latest")
    .then((payload) => normalizeDbRelease(payload, FALLBACK_RELEASES.zayitDb))
    .catch(() => FALLBACK_RELEASES.zayitDb);

  const [appRelease, otzariaDbRelease, zayitDbRelease] = await Promise.all([
    appPromise,
    otzariaDbPromise,
    zayitDbPromise,
  ]);

  return { appRelease, otzariaDbRelease, zayitDbRelease };
};

const createAnchorButton = (label, url, primary = false) =>
  `<a class="button ${primary ? "button-primary" : "button-secondary"} button-compact" href="${url}" rel="noreferrer">${label}</a>`;

const createActionButton = (label, key) =>
  `<button class="button button-secondary button-compact" type="button" data-download-bundle="${key}">${label}</button>`;

const attachBundleButtons = (bundleMap) => {
  document.querySelectorAll("[data-download-bundle]").forEach((button) => {
    button.addEventListener("click", () => {
      const urls = bundleMap[button.dataset.downloadBundle] || [];

      urls.forEach((url, index) => {
        window.setTimeout(() => {
          const link = document.createElement("a");
          link.href = url;
          link.rel = "noreferrer";
          document.body.append(link);
          link.click();
          link.remove();
        }, index * 220);
      });
    });
  });
};

const renderDownloadModal = ({ appRelease, otzariaDbRelease, zayitDbRelease }) => {
  const detected = detectPlatform();
  const detectedNode = document.querySelector("[data-detected-platform]");
  const recommendedCopyNode = document.querySelector("[data-recommended-copy]");
  const primaryDownloadsNode = document.querySelector("[data-primary-downloads]");
  const bundleActionsNode = document.querySelector("[data-bundle-actions]");
  const appDownloadsNode = document.querySelector("[data-app-downloads]");
  const otzariaDbNode = document.querySelector("[data-otzaria-db]");
  const zayitDbNode = document.querySelector("[data-zayit-db]");

  if (
    !detectedNode ||
    !recommendedCopyNode ||
    !primaryDownloadsNode ||
    !bundleActionsNode ||
    !appDownloadsNode ||
    !otzariaDbNode ||
    !zayitDbNode
  ) {
    return;
  }

  const appAssets = [...appRelease.assets].sort((left, right) => {
    const order = ["windows", "macos", "linux", "other"];
    return order.indexOf(left.platform || "other") - order.indexOf(right.platform || "other");
  });

  const recommendedAsset =
    appAssets.find((asset) => asset.platform === detected.key) ||
    appAssets[0] ||
    null;
  const otzariaFullDb =
    otzariaDbRelease.assets.find((asset) => asset.name === "seforim.db.zst") ||
    otzariaDbRelease.assets[0] ||
    null;
  const otzariaDiff = otzariaDbRelease.assets.find((asset) => asset.name.includes(".DIFF"));
  const otzariaManifest = otzariaDbRelease.assets.find((asset) => asset.name.includes("manifest"));
  const zayitParts = zayitDbRelease.assets.filter((asset) => asset.name.includes(".part"));

  detectedNode.textContent = `זוהתה מערכת: ${detected.label} • ${detected.arch}`;

  if (recommendedAsset) {
    recommendedCopyNode.textContent = `הקובץ המומלץ הוא ${recommendedAsset.name}. זו ${
      appRelease.prerelease ? "גרסה ניסיונית" : "גרסה יציבה"
    } שפורסמה ב-${formatDate(appRelease.publishedAt)}.`;

    primaryDownloadsNode.innerHTML = [
      createAnchorButton(`הורידו ל-${detected.label}`, recommendedAsset.url, true),
      createAnchorButton("מאגר הקוד", "https://github.com/arieldaniely/otzariaAI", false),
    ].join("");
  } else {
    recommendedCopyNode.textContent = "לא נמצא כרגע קובץ תוכנה זמין. אפשר עדיין לעבור למאגר הקוד.";
    primaryDownloadsNode.innerHTML = createAnchorButton(
      "מאגר הקוד",
      "https://github.com/arieldaniely/otzariaAI",
      false
    );
  }

  const bundleButtons = [];
  if (recommendedAsset && otzariaFullDb) {
    bundleButtons.push(createActionButton("הורדת תוכנה + DB של אוצריא", "otzaria"));
  }
  if (recommendedAsset && zayitParts.length) {
    bundleButtons.push(createActionButton("הורדת תוכנה + DB של זית", "zayit"));
  }
  bundleActionsNode.innerHTML = bundleButtons.join("");

  appDownloadsNode.innerHTML = appAssets
    .map((asset) => {
      const platformLabel =
        {
          windows: "Windows",
          macos: "macOS",
          linux: "Linux",
          other: "קובץ נוסף",
        }[asset.platform || "other"] || "קובץ נוסף";
      const isRecommended = recommendedAsset?.name === asset.name;

      return `
        <article class="download-item-card">
          <div class="download-card-top">
            <p class="download-card-label">${platformLabel}</p>
            ${isRecommended ? '<span class="download-tag">מומלץ</span>' : ""}
          </div>
          <h3>${asset.name}</h3>
          <p class="download-card-text">גרסה ${appRelease.tag} • ${formatBytes(asset.size)} • ${formatDate(
            appRelease.publishedAt
          )}</p>
          <div class="download-card-actions">
            ${createAnchorButton(`הורדה ל-${platformLabel}`, asset.url, isRecommended)}
          </div>
        </article>
      `;
    })
    .join("");

  otzariaDbNode.innerHTML = otzariaFullDb
    ? `
      <div class="download-card-top">
        <p class="download-card-label">DB של אוצריא</p>
        <span class="download-tag">קובץ אחד</span>
      </div>
      <h3>${otzariaFullDb.name}</h3>
      <p class="download-card-text">מסד נתונים מלא מתוך ${otzariaDbRelease.tag} • ${formatBytes(
        otzariaFullDb.size
      )} • ${formatDate(otzariaDbRelease.publishedAt)}</p>
      <div class="download-card-actions">
        ${createAnchorButton("הורדת DB מלא", otzariaFullDb.url, true)}
      </div>
      <div class="download-aux-links">
        ${
          otzariaDiff
            ? `<a href="${otzariaDiff.url}" rel="noreferrer">diff (${formatBytes(otzariaDiff.size)})</a>`
            : ""
        }
        ${
          otzariaManifest
            ? `<a href="${otzariaManifest.url}" rel="noreferrer">manifest</a>`
            : ""
        }
      </div>
      <p class="download-note">קובץ אחד מלא, מתאים למי שרוצה להתחיל מהר.</p>
    `
    : '<div class="download-empty">לא נמצאו כרגע קבצי DB של אוצריא.</div>';

  zayitDbNode.innerHTML = zayitParts.length
    ? `
      <div class="download-card-top">
        <p class="download-card-label">DB של זית</p>
        <span class="download-tag">שני חלקים</span>
      </div>
      <h3>seforim_bundle.tar.zst</h3>
      <p class="download-card-text">bundle מפוצל לשני חלקים מתוך ${zayitDbRelease.tag} • ${formatDate(
        zayitDbRelease.publishedAt
      )}</p>
      <div class="download-card-actions">
        ${zayitParts
          .map((asset, index) =>
            createAnchorButton(`חלק ${index + 1} • ${formatBytes(asset.size)}`, asset.url, index === 0)
          )
          .join("")}
      </div>
      <div class="download-aux-links">
        ${createActionButton("הורד את שני החלקים", "zayit-db")}
      </div>
      <p class="download-note">כדי לעבוד עם bundle של זית צריך להוריד את שני החלקים.</p>
    `
    : '<div class="download-empty">לא נמצאו כרגע קבצי DB של זית.</div>';

  attachBundleButtons({
    otzaria: [recommendedAsset?.url, otzariaFullDb?.url].filter(Boolean),
    zayit: [recommendedAsset?.url, ...zayitParts.map((asset) => asset.url)].filter(Boolean),
    "zayit-db": zayitParts.map((asset) => asset.url),
  });
};

loadReleaseData().then(renderDownloadModal);

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
