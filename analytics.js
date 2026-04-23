(() => {
  // Replace this with the Google Analytics 4 Measurement ID, for example: G-ABC123DEF4.
  const GA_MEASUREMENT_ID = "G-REPLACE_ME";
  const hasValidMeasurementId =
    /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID) && !GA_MEASUREMENT_ID.includes("REPLACE");

  window.trackAnalyticsEvent = (eventName, params = {}) => {
    if (typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", eventName, params);
  };

  if (!hasValidMeasurementId) {
    return;
  }

  const analyticsScript = document.createElement("script");
  analyticsScript.async = true;
  analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    GA_MEASUREMENT_ID
  )}`;
  document.head.append(analyticsScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);

  document.addEventListener("click", (event) => {
    const downloadButton = event.target.closest("[data-open-download]");
    if (downloadButton) {
      window.trackAnalyticsEvent("download_modal_open", {
        event_category: "engagement",
      });
      return;
    }

    const bundleButton = event.target.closest("[data-download-bundle]");
    if (bundleButton) {
      window.trackAnalyticsEvent("download_bundle_click", {
        event_category: "downloads",
        bundle: bundleButton.dataset.downloadBundle || "unknown",
      });
      return;
    }

    const link = event.target.closest("a[href]");
    if (!link) {
      return;
    }

    const url = new URL(link.href, window.location.href);

    if (url.href.includes("/releases/download/")) {
      window.trackAnalyticsEvent("file_download", {
        event_category: "downloads",
        file_name: url.pathname.split("/").pop() || url.href,
        link_url: url.href,
      });
      return;
    }

    if (url.hostname === "github.com") {
      window.trackAnalyticsEvent("github_link_click", {
        event_category: "outbound",
        link_url: url.href,
      });
    }
  });
})();
