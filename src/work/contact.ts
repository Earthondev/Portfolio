export {};
type Service = "website" | "ai-training" | "other";
const services: Record<
  Service,
  { label: string; subject: string; guidance: string }
> = {
  website: {
    label: "ออกแบบและพัฒนาเว็บไซต์",
    subject: "ปรึกษางานออกแบบเว็บไซต์",
    guidance:
      "เล่าประเภทธุรกิจ เป้าหมายเว็บไซต์ ฟังก์ชันที่อยากได้ และช่วงเวลาที่ต้องการใช้งาน ถ้ามีเว็บอ้างอิงสามารถแนบลิงก์ได้",
  },
  "ai-training": {
    label: "สอนใช้ AI และ Automation",
    subject: "สนใจเรียน AI และ Automation",
    guidance:
      "เล่างานที่อยากใช้ AI ช่วย พื้นฐานปัจจุบัน เครื่องมือที่เคยใช้ และต้องการเรียนคนเดียวหรือเป็นทีม",
  },
  other: {
    label: "งานอื่น ๆ / โอกาสร่วมงาน",
    subject: "สอบถามงานหรือโอกาสร่วมงาน",
    guidance:
      "เล่ารายละเอียดงานหรือโอกาสร่วมงาน พร้อมช่องทางและช่วงเวลาที่สะดวกติดต่อกลับ",
  },
};
const form = document.querySelector<HTMLFormElement>("#contact-form");
const feedback = document.querySelector<HTMLElement>("#form-feedback");
const draftLink =
  document.querySelector<HTMLAnchorElement>("#email-draft-link");
const serviceInput = document.querySelector<HTMLSelectElement>("#service");
const subjectInput = document.querySelector<HTMLInputElement>("#subject");
const guidance = document.querySelector<HTMLElement>("#service-guidance");
function serviceKey(value: string): Service {
  return value === "website" || value === "ai-training" ? value : "other";
}
if (serviceInput && subjectInput && guidance) {
  const requested = new URLSearchParams(location.search).get("service");
  serviceInput.value =
    requested === "website" || requested === "ai-training"
      ? requested
      : "other";
  let lastDefault = "";
  const sync = (): void => {
    const chosen = services[serviceKey(serviceInput.value)];
    guidance.textContent = chosen.guidance;
    if (!subjectInput.value || subjectInput.value === lastDefault)
      subjectInput.value = chosen.subject;
    lastDefault = chosen.subject;
  };
  serviceInput.addEventListener("change", sync);
  sync();
}
if (form && feedback && draftLink) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const chosen = services[serviceKey(String(data.get("service") || "other"))];
    const name = String(data.get("name") || "").trim(),
      email = String(data.get("email") || "").trim(),
      subject = String(data.get("subject") || "").trim(),
      message = String(data.get("message") || "").trim();
    const body = `บริการที่สนใจ: ${chosen.label}\nชื่อ: ${name}\nอีเมล: ${email}\n\n${message}`;
    const url = `mailto:earthlikemwbb@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    draftLink.href = url;
    draftLink.hidden = false;
    feedback.hidden = false;
    feedback.textContent =
      "ร่างอีเมลพร้อมแล้ว โปรดตรวจและกดส่งในแอปอีเมลของคุณ หากแอปไม่เปิด สามารถส่งตรงถึง earthlikemwbb@gmail.com ได้";
    location.href = url;
  });
}
