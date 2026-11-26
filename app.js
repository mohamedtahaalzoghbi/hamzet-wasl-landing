const API = window.HW_API;
async function call(path, body) {
  const r = await fetch(API + path, { method: body ? 'POST' : 'GET', headers: { 'content-type': 'application/json' }, body: body && JSON.stringify(body) });
  if (!r.ok) throw new Error(r.status);
  return r.json();
}
const forms = [['interest', '/interest', null, 'joined.html'], ['contact', '/contact', 'وصلتنا رسالتك، شكرًا لك.'], ['sub', '/subscribe', 'تم الاشتراك. شكرًا لك!']];
for (const [id, path, ok, redirect] of forms) {
  const f = document.getElementById(id);
  if (!f) continue;
  const msg = f.querySelector('.msg');
  f.addEventListener('submit', async e => {
    e.preventDefault();
    msg.className = 'msg'; msg.textContent = 'جارٍ الإرسال... (قد يستغرق الخادم دقيقة إن كان نائمًا)';
    try {
      await call(path, Object.fromEntries(new FormData(f)));
      if (redirect) { location.href = redirect; return; }
      f.reset(); msg.className = 'msg ok'; msg.textContent = ok;
    } catch (err) {
      msg.className = 'msg err';
      msg.textContent = err.message === '429' ? 'محاولات كثيرة، حاول بعد قليل.' : 'تأكد من البيانات وحاول مرة أخرى.';
    }
  });
}
(async () => {
  const a = document.getElementById('s-int'), b = document.getElementById('s-sub');
  if (!a) return;
  try { const s = (await call('/stats')).data; a.textContent = s.interests; b.textContent = s.subscribers; } catch {}
})();
