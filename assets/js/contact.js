var t=document.querySelector("#contact-form"),n=document.querySelector("#form-feedback"),o=document.querySelector("#email-draft-link");t&&n&&o&&t.addEventListener("submit",a=>{if(a.preventDefault(),!t.reportValidity())return;let e=new FormData(t),m=String(e.get("name")||"").trim(),i=String(e.get("email")||"").trim(),c=String(e.get("subject")||"").trim(),l=String(e.get("message")||"").trim(),d=`Name: ${m}
Email: ${i}

${l}`,r=`mailto:earthlikemwbb@gmail.com?subject=${encodeURIComponent(c)}&body=${encodeURIComponent(d)}`;o.href=r,o.hidden=!1,n.hidden=!1,n.textContent="Your draft is ready. Review and send it in your email app. If no app opens, email earthlikemwbb@gmail.com directly.",location.href=r});
