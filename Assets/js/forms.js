/**
 * EagleNest Academy — forms.js
 * ─────────────────────────────
 * Handles the admissions inquiry form:
 *   1. Real-time inline field validation
 *   2. On submit:
 *      a. POST to [FORM_ENDPOINT] via fetch()
 *      b. Fallback: opens a pre-filled WhatsApp message if fetch fails
 *         or endpoint is not yet configured
 *   3. Shows success / error state banners
 *
 * Dependencies: none (vanilla JS ES2017+)
 * Called automatically on DOMContentLoaded.
 */

/* ─────────────────────────────────────────────────────────────
   CONFIGURATION  — replace these before going live
   ───────────────────────────────────────────────────────────── */
const FORM_CONFIG = {
  /** Replace with your real form endpoint (Formspree, Netlify, etc.)
   *  Set to "" or null to skip fetch and use WhatsApp only.           */
  endpoint: "[FORM_ENDPOINT]",

  /** WhatsApp number — digits only, no +, no spaces                   */
  whatsappNumber: "254XXXXXXXXX",   // replace with real number

  /** Whether to ALSO open WhatsApp after a successful POST            */
  whatsappAfterSuccess: true,
};

/* ─────────────────────────────────────────────────────────────
   VALIDATION RULES
   ───────────────────────────────────────────────────────────── */
const RULES = {
  parentName: {
    required: true,
    minLength: 2,
    pattern: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]{2,80}$/,
    messages: {
      required:  "Please enter the parent or guardian's full name.",
      minLength: "Name must be at least 2 characters.",
      pattern:   "Name may only contain letters, spaces, hyphens, and apostrophes.",
    },
  },
  phone: {
    required: true,
    pattern: /^(\+?254|0)[17]\d{8}$/,
    messages: {
      required: "Please enter a contact phone number.",
      pattern:  "Enter a valid Kenyan number — e.g. 0712 345678 or +254712345678.",
    },
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    messages: {
      required: "Please enter an email address.",
      pattern:  "Please enter a valid email address.",
    },
  },
  childName: {
    required: true,
    minLength: 2,
    pattern: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]{2,80}$/,
    messages: {
      required:  "Please enter the child's full name.",
      minLength: "Name must be at least 2 characters.",
      pattern:   "Name may only contain letters, spaces, hyphens, and apostrophes.",
    },
  },
  childAge: {
    required: true,
    pattern: /^([3-9]|1[0-8])$/,           // 3 – 18 years
    messages: {
      required: "Please enter the child's age.",
      pattern:  "Please enter an age between 3 and 18.",
    },
  },
  classApplying: {
    required: true,
    messages: {
      required: "Please select the class the child is applying for.",
    },
  },
  message: {
    required: false,
    maxLength: 1000,
    messages: {
      maxLength: "Message must not exceed 1,000 characters.",
    },
  },
};

/* ─────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────── */

/** Return the error string for a field value, or "" if valid */
function validateField(name, value) {
  const rule = RULES[name];
  if (!rule) return "";

  const trimmed = value.trim();

  if (rule.required && !trimmed) return rule.messages.required;
  if (!rule.required && !trimmed) return ""; // optional & empty → OK

  if (rule.minLength && trimmed.length < rule.minLength)
    return rule.messages.minLength;
  if (rule.maxLength && trimmed.length > rule.maxLength)
    return rule.messages.maxLength;
  if (rule.pattern && !rule.pattern.test(trimmed))
    return rule.messages.pattern;

  return "";
}

/** Show or clear inline error for a field */
function setFieldError(field, errorMsg) {
  const wrapper  = field.closest(".form-field") || field.parentElement;
  const errorEl  = wrapper.querySelector(".field-error");
  const isError  = Boolean(errorMsg);

  field.setAttribute("aria-invalid", String(isError));

  if (errorEl) {
    errorEl.textContent = errorMsg;
    errorEl.hidden = !isError;
  }

  field.classList.toggle("border-red-400",   isError);
  field.classList.toggle("ring-red-200",     isError);
  field.classList.toggle("border-sky-300",  !isError && field.value.trim() !== "");
  field.classList.toggle("ring-sky-100",    !isError && field.value.trim() !== "");
}

/** Collect form data into a plain object */
function collectFormData(form) {
  const d = new FormData(form);
  return {
    parentName:    (d.get("parentName")    || "").trim(),
    phone:         (d.get("phone")         || "").trim(),
    email:         (d.get("email")         || "").trim(),
    childName:     (d.get("childName")     || "").trim(),
    childAge:      (d.get("childAge")      || "").trim(),
    classApplying: (d.get("classApplying") || "").trim(),
    message:       (d.get("message")       || "").trim(),
  };
}

/** Build a WhatsApp message from form data */
function buildWhatsAppURL(data) {
  const lines = [
    "Hello EagleNest Academy! I would like to enquire about admissions.",
    "",
    `*Parent / Guardian:* ${data.parentName}`,
    `*Phone:* ${data.phone}`,
    `*Email:* ${data.email}`,
    `*Child's Name:* ${data.childName}`,
    `*Child's Age:* ${data.childAge}`,
    `*Applying For:* ${data.classApplying}`,
  ];
  if (data.message) lines.push(`*Message:* ${data.message}`);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${FORM_CONFIG.whatsappNumber}?text=${text}`;
}

/** Show the result banner (success or error) */
function showBanner(type, form) {
  const successBanner = document.getElementById("form-success");
  const errorBanner   = document.getElementById("form-error");

  if (type === "success") {
    successBanner && (successBanner.hidden = false);
    errorBanner   && (errorBanner.hidden   = true);
    form.reset();
    // Clear all visual field states
    form.querySelectorAll("[data-field]").forEach(f => setFieldError(f, ""));
    successBanner?.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    errorBanner   && (errorBanner.hidden   = false);
    successBanner && (successBanner.hidden = true);
    errorBanner?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/** Set submit button to loading / normal state */
function setSubmitState(btn, loading) {
  const textEl    = btn.querySelector(".btn-text");
  const spinnerEl = btn.querySelector(".btn-spinner");

  btn.disabled = loading;
  textEl    && (textEl.hidden    =  loading);
  spinnerEl && (spinnerEl.hidden = !loading);
}

/* ─────────────────────────────────────────────────────────────
   MAIN INIT
   ───────────────────────────────────────────────────────────── */
function initAdmissionsForm() {
  const form = document.getElementById("admissions-form");
  if (!form) return;

  const submitBtn = form.querySelector('[type="submit"]');

  /* ── Live validation on blur and input ─────────────────── */
  form.querySelectorAll("[data-field]").forEach((field) => {
    const name = field.dataset.field;

    // Validate on blur (when user leaves the field)
    field.addEventListener("blur", () => {
      setFieldError(field, validateField(name, field.value));
    });

    // Clear error as soon as the user starts correcting
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        const err = validateField(name, field.value);
        setFieldError(field, err);
      }
      // Live character count for message textarea
      if (name === "message") {
        const counter = document.getElementById("message-counter");
        if (counter) counter.textContent = field.value.length;
      }
    });
  });

  /* ── Submit handler ─────────────────────────────────────── */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Hide any previous banners
    const successBanner = document.getElementById("form-success");
    const errorBanner   = document.getElementById("form-error");
    successBanner && (successBanner.hidden = true);
    errorBanner   && (errorBanner.hidden   = true);

    // Run full validation
    let hasErrors = false;
    form.querySelectorAll("[data-field]").forEach((field) => {
      const err = validateField(field.dataset.field, field.value);
      setFieldError(field, err);
      if (err) hasErrors = true;
    });

    if (hasErrors) {
      // Focus the first invalid field
      const first = form.querySelector('[aria-invalid="true"]');
      first?.focus();
      return;
    }

    const data = collectFormData(form);
    setSubmitState(submitBtn, true);

    /* ── Attempt POST to configured endpoint ─────────────── */
    const endpointConfigured =
      FORM_CONFIG.endpoint &&
      FORM_CONFIG.endpoint !== "[FORM_ENDPOINT]" &&
      FORM_CONFIG.endpoint.startsWith("http");

    let postSucceeded = false;

    if (endpointConfigured) {
      try {
        const res = await fetch(FORM_CONFIG.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          postSucceeded = true;
        } else {
          console.warn("Form endpoint returned", res.status);
        }
      } catch (err) {
        console.warn("Form POST failed:", err.message);
      }
    }

    setSubmitState(submitBtn, false);

    /* ── Open WhatsApp (always if endpoint not configured,
           or as backup, or as bonus after success)           ── */
    const openWhatsApp =
      !endpointConfigured ||
      !postSucceeded ||
      FORM_CONFIG.whatsappAfterSuccess;

    if (openWhatsApp) {
      window.open(buildWhatsAppURL(data), "_blank", "noopener,noreferrer");
    }

    /* ── Show result banner ──────────────────────────────── */
    if (postSucceeded || !endpointConfigured) {
      showBanner("success", form);
    } else {
      showBanner("error", form);
    }
  });
}

/* Auto-initialise */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdmissionsForm);
} else {
  initAdmissionsForm();
}
