export {};
const copyButton = document.querySelector<HTMLButtonElement>(
  "#copy-lesson-prompt",
);
const prompt = document.querySelector<HTMLElement>("#lesson-prompt");
const status = document.querySelector<HTMLElement>("#copy-prompt-status");
if (copyButton && prompt && status) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(prompt.textContent || "");
      status.textContent =
        "คัดลอกแล้ว นำไปลองกับข้อมูลตัวอย่างในเครื่องมือ AI ที่คุณใช้ได้เลย";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(prompt);
      selection?.removeAllRanges();
      selection?.addRange(range);
      status.textContent =
        "เลือกข้อความให้แล้ว กดคัดลอกจากเมนูของอุปกรณ์ หรือ Ctrl/Cmd + C";
    }
  });
}
