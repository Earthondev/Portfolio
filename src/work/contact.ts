export {};
const form = document.querySelector<HTMLFormElement>("#contact-form");
const feedback = document.querySelector<HTMLElement>("#form-feedback");
const draftLink =
  document.querySelector<HTMLAnchorElement>("#email-draft-link");
if (form && feedback && draftLink) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim(),
      email = String(data.get("email") || "").trim(),
      subject = String(data.get("subject") || "").trim(),
      message = String(data.get("message") || "").trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const url = `mailto:earthlikemwbb@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    draftLink.href = url;
    draftLink.hidden = false;
    feedback.hidden = false;
    feedback.textContent =
      "Your draft is ready. Review and send it in your email app. If no app opens, email earthlikemwbb@gmail.com directly.";
    location.href = url;
  });
}
