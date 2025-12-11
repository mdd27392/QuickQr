export function initQuickQR(options = {}) {
  const { isMini = false } = options;

  const envBadge = document.getElementById("env-badge");
  const subtitle = document.getElementById("subtitle");
  const input = document.getElementById("qr-input");
  const sizeInput = document.getElementById("qr-size");
  const sizeLabel = document.getElementById("size-label");
  const ecSelect = document.getElementById("qr-ec-level");
  const generateBtn = document.getElementById("generate-btn");
  const clearBtn = document.getElementById("clear-btn");
  const qrImage = document.getElementById("qr-image");
  const placeholder = document.getElementById("qr-placeholder");
  const downloadBtn = document.getElementById("download-btn");
  const toast = document.getElementById("toast");

  if (envBadge) {
    envBadge.textContent = isMini ? "Mini app" : "Web";
  }
  if (subtitle && isMini) {
    subtitle.textContent = "Drop a link, show the code on any screen.";
  }

  if (sizeInput && sizeLabel) {
    sizeLabel.textContent = `${sizeInput.value}×${sizeInput.value}`;
    sizeInput.addEventListener("input", () => {
      sizeLabel.textContent = `${sizeInput.value}×${sizeInput.value}`;
      if (qrImage && qrImage.classList.contains("visible")) {
        generate(); // live resize existing content
      }
    });
  }

  generateBtn?.addEventListener("click", () => {
    generate();
  });

  clearBtn?.addEventListener("click", () => {
    if (input) input.value = "";
    if (qrImage) {
      qrImage.src = "";
      qrImage.classList.remove("visible");
    }
    if (placeholder) {
      placeholder.style.display = "flex";
    }
  });

  downloadBtn?.addEventListener("click", () => {
    if (!qrImage || !qrImage.src) {
      showToast("Generate a QR first");
      return;
    }
    tryDownloadImage(qrImage.src);
  });

  function generate() {
    if (!input || !sizeInput || !ecSelect) return;
    const value = input.value.trim();
    if (!value) {
      showToast("Enter text or a URL");
      return;
    }

    const size = parseInt(sizeInput.value, 10) || 240;
    const ec = ecSelect.value || "M";
    const encoded = encodeURIComponent(value);
    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encoded}&size=${size}x${size}&margin=0&ecc=${ec}`;

    if (qrImage) {
      qrImage.onload = () => {
        qrImage.classList.add("visible");
        if (placeholder) placeholder.style.display = "none";
      };
      qrImage.onerror = () => {
        showToast("Could not render QR image");
      };
      qrImage.src = url;
    }
  }

  function tryDownloadImage(src) {
    // simple best-effort download via anchor
    const a = document.createElement("a");
    a.href = src;
    a.download = "quickqr.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("visible");
    }, 1700);
  }
}
