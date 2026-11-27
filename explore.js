(function () {
  var root = (window.HW_API || '').replace(/\/landing$/, '');
  var DASH = 'https://mohamedtahaalzoghbi.github.io/hamzet-wasl-dashboard/#/login';
  var page = document.body.getAttribute('data-explore');
  var box = document.getElementById('ex');
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function get(p) { return fetch(root + p).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) { return j.data; }); }
  function items(d) { return Array.isArray(d) ? d : (d && d.items) || []; }
  function dt(s) { try { return new Date(s).toLocaleDateString('ar-EG', { dateStyle: 'medium' }); } catch (e) { return ''; } }
  function card(h) { return '<div class="xc">' + h + '</div>'; }
  function empty(m) { return '<div class="xe">' + m + '</div>'; }
  var T = { service: 'خدمة', program: 'برنامج', event: 'فعالية' };
  var EMP = { full_time: 'دوام كامل', part_time: 'دوام جزئي', contract: 'عقد', internship: 'تدريب', volunteer: 'تطوعي' };
  var ARR = { remote: 'عن بعد', onsite: 'من المقر', hybrid: 'هجين' };
  var cfg = {
    services: ['/directory/items?pageSize=30', function (l) { return l.map(function (x) { return card('<span class="xt">' + (T[x.itemType] || '') + '</span><h3>' + esc(x.title) + '</h3><div class="xm">' + esc(x.organizationName) + '</div><p>' + esc(x.description) + '</p>' + (x.startsAt ? '<div class="xm">📅 ' + dt(x.startsAt) + '</div>' : '') + '<a class="btn small" href="' + DASH + '">سجّل دخولك للاستفسار</a>'); }); }, 'مفيش خدمات منشورة لسه.'],
    places: ['/places?pageSize=30', function (l) { return l.map(function (p) { return card('<h3>' + esc(p.name) + '</h3><div class="xm">' + esc(p.address) + '</div><div>' + p.facilities.filter(function (f) { return f.status === 'available'; }).map(function (f) { return '<span class="xt">' + esc(f.type) + '</span>'; }).join('') + '</div><div class="xm">' + (p.averageRating ? '⭐ ' + p.averageRating.toFixed(1) + ' (' + p.reviewsCount + ' تقييم)' : 'لسه بدون تقييم') + '</div><a class="btn small ghost" target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=' + p.latitude + '&mlon=' + p.longitude + '#map=17/' + p.latitude + '/' + p.longitude + '">افتح الخريطة</a>'); }); }, 'مفيش أماكن مضافة لسه.'],
    shops: ['/shops?pageSize=30', function (l) { return l.map(function (s) { return card('<h3>' + esc(s.name) + '</h3><p>' + esc(s.description || '') + '</p><span class="xt">' + s.productsCount + ' منتج متاح</span><div style="margin-top:10px"><a class="btn small" href="' + DASH + '">شوف المنتجات</a></div>'); }); }, 'مفيش محلات معتمدة لسه.'],
    jobs: ['/jobs?pageSize=30', function (l) { return l.map(function (j) { return card('<span class="xt">' + (EMP[j.employmentType] || '') + '</span><span class="xt">' + (ARR[j.workArrangement] || '') + '</span><h3>' + esc(j.title) + '</h3><div class="xm">' + esc(j.organizationName) + ' · ' + esc(j.location) + '</div><p>' + esc(j.description).slice(0, 160) + '</p><a class="btn small" href="' + DASH + '">سجّل دخولك للتقديم</a>'); }); }, 'مفيش وظائف منشورة لسه.']
  }[page];
  if (box && cfg) {
    box.innerHTML = '<div class="xe">جارٍ التحميل... (قد يستغرق الخادم دقيقة إن كان نائمًا)</div>';
    get(cfg[0]).then(function (d) { var l = cfg[1](items(d)); box.innerHTML = l.length ? l.join('') : empty(cfg[2]); }).catch(function () { box.innerHTML = empty('تعذر التحميل، حاول مرة أخرى بعد قليل.'); });
  }
  var st = document.getElementById('pstats');
  if (st) get('/stats/public').then(function (s) {
    var m = [['verifiedVolunteers', 'متطوع موثّق'], ['disabledUsers', 'مستخدم'], ['approvedOrganizations', 'جهة معتمدة'], ['completedHelpRequests', 'طلب مساعدة اتنفذ'], ['places', 'مكان متاح']];
    st.innerHTML = m.map(function (k) { return '<div class="card"><h3>' + (s[k[0]] || 0) + '</h3><p>' + k[1] + '</p></div>'; }).join('');
  }).catch(function () { });
})();
