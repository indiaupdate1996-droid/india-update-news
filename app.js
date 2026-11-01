import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, getDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

// Firebase web config
const firebaseConfig = {
  apiKey: 'AIzaSyA0qi7pbf4Z34nUMlfF0wurxBilmYKkEkU',
  authDomain: 'india-update-news.firebaseapp.com',
  projectId: 'india-update-news',
  storageBucket: 'india-update-news.firebasestorage.app',
  messagingSenderId: '282383453929',
  appId: '1:282383453929:web:893f52e64c512110776a78',
  measurementId: 'G-TDTN6LRH6M'
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const articles = [
 {id:'demo-1',category:'राजस्थान',emoji:'🌦️',date:'डेमो खबर',title:'राजस्थान मौसम अपडेट: अपने जिले का ताज़ा पूर्वानुमान देखें',summary:'मौसम से जुड़ी खबर प्रकाशित करने से पहले IMD और स्थानीय प्रशासन की आधिकारिक जानकारी की पुष्टि करें।',body:'यह नमूना लेख है, वास्तविक मौसम बुलेटिन नहीं। अपनी खबर प्रकाशित करते समय तारीख, प्रभावित जिले, चेतावनी का स्तर और मौसम विभाग का आधिकारिक स्रोत अवश्य जोड़ें।',color:'weather',demo:true},
 {id:'demo-2',category:'देश',emoji:'🇮🇳',date:'डेमो खबर',title:'देश की बड़ी खबरें: आज के प्रमुख राष्ट्रीय अपडेट',summary:'देशभर की प्रमुख घटनाओं को आसान हिंदी में एक जगह पढ़ें।',body:'यह शुरुआती ऐप में दिखाने के लिए डेमो सामग्री है। इसे प्रकाशित करने से पहले सत्यापित खबर, सही तारीख और विश्वसनीय स्रोत के साथ बदलें।',color:'india',demo:true},
 {id:'demo-3',category:'राजनीति',emoji:'🏛️',date:'डेमो खबर',title:'राजनीति की हलचल: संसद और राज्यों से जुड़ी खबरें',summary:'नीतियों, घोषणाओं और सार्वजनिक फैसलों का आसान सार।',body:'राजनीतिक समाचारों में बयान और तथ्य को अलग रखें। मूल बयान या आधिकारिक दस्तावेज़ की पुष्टि करके ही खबर अपडेट करें।',color:'politics',demo:true},
 {id:'demo-4',category:'व्यापार',emoji:'📈',date:'डेमो खबर',title:'बाज़ार और कारोबार: आर्थिक खबरों पर एक नज़र',summary:'व्यापार, महँगाई, बैंकिंग और रोज़गार से जुड़ी खबरें।',body:'यह एक डेमो लेख है। बाज़ार भाव या वित्तीय जानकारी प्रकाशित करने से पहले तारीख, इकाई और विश्वसनीय स्रोत ज़रूर दें।',color:'business',demo:true},
 {id:'demo-5',category:'खेल',emoji:'🏏',date:'डेमो खबर',title:'खेल जगत: भारतीय खिलाड़ियों और मुकाबलों की खबरें',summary:'क्रिकेट सहित दूसरे खेलों के नतीजे और अहम अपडेट।',body:'यह नमूना लेख है। खेल समाचार में टूर्नामेंट, टीम, खिलाड़ी और मैच की तारीख की पुष्टि करें।',color:'sports',demo:true},
 {id:'demo-6',category:'दुनिया',emoji:'🌍',date:'डेमो खबर',title:'दुनिया की खबरें: अंतरराष्ट्रीय घटनाक्रम का सार',summary:'दुनिया में क्या हो रहा है, सरल हिंदी में जानें।',body:'अंतरराष्ट्रीय खबर प्रकाशित करने से पहले कम-से-कम एक भरोसेमंद समाचार स्रोत और जहाँ संभव हो, आधिकारिक बयान से पुष्टि करें।',color:'world',demo:true},
 {id:'demo-7',category:'मनोरंजन',emoji:'🎬',date:'डेमो खबर',title:'मनोरंजन जगत: फ़िल्मों और कलाकारों की ताज़ा चर्चा',summary:'सिनेमा, टीवी और मनोरंजन की दुनिया से अपडेट।',body:'यह डेमो लेख है। अफवाहों को तथ्य की तरह प्रकाशित न करें और कलाकारों से जुड़ी खबरों की पुष्टि करें।',color:'entertainment',demo:true},
 {id:'demo-8',category:'राजस्थान',emoji:'🏙️',date:'डेमो खबर',title:'आपके शहर की खबर: स्थानीय मुद्दे और जनहित की जानकारी',summary:'स्थानीय विकास, सड़क, पानी, बिजली और जनसमस्याओं पर फोकस।',body:'स्थानीय खबर में स्थान, घटना का समय और संबंधित विभाग का पक्ष शामिल करें। निजी जानकारी साझा करने से बचें और आरोपों की पुष्टि करें।',color:'city',demo:true},
 {id:'demo-9',category:'देश',emoji:'📱',date:'डेमो खबर',title:'टेक अपडेट: मोबाइल और डिजिटल दुनिया की अहम बातें',summary:'टेक्नोलॉजी, ऐप और इंटरनेट से जुड़ी उपयोगी जानकारी।',body:'टेक खबरों में डिवाइस, ऐप संस्करण और आधिकारिक घोषणा का संदर्भ देना उपयोगी है। यह लेख केवल डेमो के लिए है।',color:'tech',demo:true}
];

let selectedCategory = 'सभी';
let savedOnly = false;
let saved = JSON.parse(localStorage.getItem('iu_saved') || '[]');
let cloudArticles = [];
let isAdmin = false;
let unsubscribeNews = null;

const grid = document.getElementById('newsGrid');
const empty = document.getElementById('emptyState');
const search = document.getElementById('searchInput');
const adminDialog = document.getElementById('adminDialog');

const categoryEmoji = {
  'राजस्थान':'🌦️',
  'देश':'🇮🇳',
  'दुनिया':'🌍',
  'राजनीति':'🏛️',
  'व्यापार':'📈',
  'खेल':'🏏',
  'मनोरंजन':'🎬'
};

function allArticles() {
  return [...cloudArticles, ...articles.filter(a => a.demo)];
}

function safeText(v = '') {
  return String(v).replace(/[&<>"']/g, c => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[c]));
}

function render() {
  const q = search.value.trim().toLocaleLowerCase('hi');

  const list = allArticles().filter(a =>
    (selectedCategory === 'सभी' || a.category === selectedCategory) &&
    (!savedOnly || saved.includes(a.id)) &&
    (!q || (a.title + ' ' + a.summary + ' ' + a.category).toLocaleLowerCase('hi').includes(q))
  );

  grid.innerHTML = list.map(a => `
    <article class="news-card">
      <div class="thumb ${safeText(a.color || 'custom')}">
        <span class="tag">${safeText(a.category)}</span>
        <span class="emoji">${safeText(a.emoji || '📰')}</span>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span>${safeText(a.category)}</span>
          <span>•</span>
          <span>${safeText(a.date || '')}</span>
        </div>
        <h3>${safeText(a.title)}</h3>
        <p>${safeText(a.summary)}</p>
        <div class="card-actions">
          <button class="read-btn" data-read="${safeText(a.id)}">पूरी खबर पढ़ें →</button>
          <div class="action-group">
            <button class="mini-btn ${saved.includes(a.id) ? 'saved' : ''}" data-save="${safeText(a.id)}" aria-label="खबर सेव करें">${saved.includes(a.id) ? '♥️' : '♡'}</button>
            <button class="mini-btn" data-share="${safeText(a.id)}" aria-label="खबर शेयर करें">↗️</button>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  empty.classList.toggle('hidden', list.length > 0);
  renderAdminList();
}

function renderAdminList() {
  const el = document.getElementById('adminNewsList');
  if (!el) return;

  if (!isAdmin) {
    el.innerHTML = '';
    return;
  }

  el.innerHTML = cloudArticles.length
    ? cloudArticles.map(a => `
        <div style="padding:10px 0;border-bottom:1px solid var(--line)">
          <b>${safeText(a.title)}</b><br>
          <small>${safeText(a.category)} · ${safeText(a.date || '')}</small><br>
          <button class="read-btn" data-delete-news="${safeText(a.id)}">यह खबर हटाएँ</button>
        </div>
      `).join('')
    : 'अभी कोई ऑनलाइन खबर प्रकाशित नहीं है।';
}

document.getElementById('categories').addEventListener('click', e => {
  const b = e.target.closest('[data-category]');
  if (!b) return;

  selectedCategory = b.dataset.category;
  savedOnly = false;

  document.getElementById('savedBtn').classList.remove('saved');
  document.querySelectorAll('.cat').forEach(c => c.classList.toggle('active', c === b));
  render();
});

search.addEventListener('input', render);

document.getElementById('savedBtn').addEventListener('click', () => {
  savedOnly = !savedOnly;
  document.getElementById('savedBtn').classList.toggle('saved', savedOnly);
  document.getElementById('savedBtn').textContent = savedOnly ? '♥️' : '♡';
  render();
  document.getElementById('latest').scrollIntoView({behavior:'smooth', block:'start'});
});

function findArticle(id) {
  return allArticles().find(a => String(a.id) === String(id));
}

grid.addEventListener('click', async e => {
  const read = e.target.closest('[data-read]');
  const save = e.target.closest('[data-save]');
  const share = e.target.closest('[data-share]');

  if (save) {
    const id = save.dataset.save;
    saved = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
    localStorage.setItem('iu_saved', JSON.stringify(saved));
    render();
  }

  if (read) {
    const a = findArticle(read.dataset.read);
    if (!a) return;

    document.getElementById('articleContent').innerHTML = `
      <span class="eyebrow red">${safeText(a.category)} · ${safeText(a.date || '')}</span>
      <div class="article-hero">${safeText(a.emoji || '📰')}</div>
      <h2 class="article-title">${safeText(a.title)}</h2>
      <p class="article-text">${safeText(a.summary)}</p>
      <p class="article-text" style="white-space:pre-wrap">${safeText(a.body)}</p>
      ${a.externalUrl ? `<p><a class="read-btn" href="${safeText(a.externalUrl)}" target="_blank" rel="noopener">मूल स्रोत पर पढ़ें ↗️</a></p>` : ''}
      ${a.demo ? '<div class="notice">यह डेमो सामग्री है। इसे वास्तविक समाचार समझकर साझा न करें।</div>' : ''}
      <div class="dialog-actions">
        <button id="shareArticle">खबर शेयर करें ↗️</button>
        <button class="secondary" id="saveArticle">${saved.includes(a.id) ? 'सेव हटाएँ' : 'खबर सेव करें'} ♡</button>
      </div>
    `;

    document.getElementById('articleDialog').showModal();
    document.getElementById('shareArticle').onclick = () => shareArticle(a);

    document.getElementById('saveArticle').onclick = () => {
      saved = saved.includes(a.id) ? saved.filter(x => x !== a.id) : [...saved, a.id];
      localStorage.setItem('iu_saved', JSON.stringify(saved));
      document.getElementById('saveArticle').textContent = saved.includes(a.id) ? 'सेव हटाएँ' : 'खबर सेव करें';
      render();
    };
  }

  if (share) {
    const a = findArticle(share.dataset.share);
    if (a) shareArticle(a);
  }
});

async function shareArticle(a) {
  const data = {title:a.title, text:a.summary + ' — India Update'};

  if (navigator.share) {
    try {
      await navigator.share(data);
    } catch (e) {}
  } else if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(data.title + '\n' + data.text);
      alert('खबर का टेक्स्ट कॉपी हो गया।');
    } catch (e) {
      alert(data.title + '\n' + data.text);
    }
  } else {
    alert(data.title + '\n' + data.text);
  }
}

document.getElementById('closeDialog').onclick = () => document.getElementById('articleDialog').close();

document.getElementById('articleDialog').addEventListener('click', e => {
  if (e.target.id === 'articleDialog') e.target.close();
});

document.getElementById('themeBtn').onclick = () => {
  document.body.classList.toggle('dark');
  document.getElementById('themeBtn').textContent = document.body.classList.contains('dark') ? '☀️' : '☾';
  localStorage.setItem('iu_dark', document.body.classList.contains('dark') ? '1' : '0');
};

if (localStorage.getItem('iu_dark') === '1') {
  document.body.classList.add('dark');
  document.getElementById('themeBtn').textContent = '☀️';
}

document.getElementById('aboutBtn').onclick = () => document.getElementById('aboutDialog').showModal();
document.getElementById('closeAbout').onclick = () => document.getElementById('aboutDialog').close();
document.getElementById('year').textContent = new Date().getFullYear();

// Admin entry uses Firebase Authentication and an admins/{uid} document.
document.getElementById('adminOpen').onclick = () => adminDialog.showModal();
document.getElementById('adminClose').onclick = () => adminDialog.close();

// Admin login with clear Firebase error messages document.getElementById('adminLogin').onclick = async () => {   const email = document.getElementById('adminEmail').value.trim();   const password = document.getElementById('adminPassword').value;    if (!email || !password) {     alert('कृपया ईमेल और पासवर्ड भरें।');     return;   }    try {     await signInWithEmailAndPassword(auth, email, password);   } catch (err) {     console.error('Admin login error:', err);      const messages = {       'auth/invalid-email': 'ईमेल का फॉर्मेट सही नहीं है।',       'auth/user-not-found': 'इस ईमेल से कोई अकाउंट नहीं मिला।',       'auth/wrong-password': 'पासवर्ड गलत है।',       'auth/invalid-credential': 'ईमेल या पासवर्ड गलत है।',       'auth/too-many-requests': 'बहुत बार कोशिश हुई है। थोड़ी देर बाद प्रयास करें।',       'auth/network-request-failed': 'इंटरनेट कनेक्शन जाँचें।',       'auth/operation-not-allowed': 'Firebase में Email/Password लॉगिन चालू नहीं है।'     };      alert(messages[err.code] || 'लॉगिन नहीं हुआ। Firebase Authentication सेटिंग जाँचें।');   } };  // Forgot password button (automatically added to login form) const loginForm = document.getElementById('loginForm'); const forgotBtn = document.createElement('button');  forgotBtn.type = 'button'; forgotBtn.id = 'adminForgotPassword'; forgotBtn.textContent = 'पासवर्ड भूल गए?'; forgotBtn.className = 'read-btn'; forgotBtn.style.marginTop = '10px';  loginForm.appendChild(forgotBtn);  forgotBtn.onclick = async () => {   const email = document.getElementById('adminEmail').value.trim();    if (!email) {     alert('पहले अपना एडमिन ईमेल भरें।');     document.getElementById('adminEmail').focus();     return;   }    try {     await sendPasswordResetEmail(auth, email);     alert('पासवर्ड रीसेट करने का लिंक आपके ईमेल पर भेज दिया गया है।');   } catch (err) {     console.error('Password reset error:', err);      const messages = {       'auth/invalid-email': 'ईमेल का फॉर्मेट सही नहीं है।',       'auth/user-not-found': 'इस ईमेल से कोई अकाउंट नहीं मिला।',       'auth/too-many-requests': 'बहुत बार कोशिश हुई है। थोड़ी देर बाद प्रयास करें।',       'auth/network-request-failed': 'इंटरनेट कनेक्शन जाँचें।'     };      alert(messages[err.code] || 'पासवर्ड रीसेट ईमेल नहीं भेजा जा सका। Firebase सेटिंग जाँचें।');   } };
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert('लॉगिन नहीं हुआ। ईमेल/पासवर्ड और Firebase Authentication सेटिंग जाँचें।');
    console.error(err);
  }
};
document.getElementById('adminLogout').onclick = () => signOut(auth);
document.getElementById('adminLogout').onclick = () => signOut(auth);

onAuthStateChanged(auth, async user => {
  isAdmin = false;
  document.getElementById('adminForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');

  if (user) {
    try {
      const adminSnap = await getDoc(doc(db, 'admins', user.uid));

      if (adminSnap.exists() && adminSnap.data().role === 'admin') {
        isAdmin = true;
        document.getElementById('adminForm').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('adminStatus').textContent = 'लॉगिन सफल। प्रकाशित खबरें सभी पाठकों को दिखेंगी।';
      } else {
        document.getElementById('adminStatus').textContent =
          'यह अकाउंट एडमिन सूची में नहीं है। Firebase Console में admins/' + user.uid + ' दस्तावेज़ जोड़ें, role = admin रखें।';
        document.getElementById('adminForm').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
      }
    } catch (err) {
      console.error(err);
      alert('एडमिन अनुमति जाँच नहीं सकी। Firestore Rules और सेटअप जाँचें।');
    }
  }

  if (unsubscribeNews) unsubscribeNews();

  unsubscribeNews = onSnapshot(
    query(collection(db, 'news'), orderBy('createdAt', 'desc')),
    snap => {
      cloudArticles = snap.docs.map(d => {
        const x = d.data();
        return {
          id:d.id,
          category:x.category || 'देश',
          emoji:categoryEmoji[x.category] || '📰',
          date:x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString('hi-IN') : (x.date || 'नई खबर'),
          title:x.title || '',
          summary:x.summary || '',
          body:x.body || '',
          color:x.color || 'custom',
          externalUrl:x.externalUrl || '',
          source:x.source || ''
        };
      });

      render();
    },
    err => {
      console.error('Firestore read failed', err);
      document.getElementById('newsNotice').innerHTML =
        '<span>!</span> ऑनलाइन खबरें लोड नहीं हो सकीं। Firebase Firestore Rules और इंटरनेट कनेक्शन जाँचें।';
    }
  );

  render();
});

document.getElementById('publishNews').onclick = async () => {
  if (!isAdmin) {
    alert('आपके अकाउंट को एडमिन अनुमति नहीं है।');
    return;
  }

  const title = document.getElementById('newsTitle').value.trim();
  const category = document.getElementById('newsCategory').value;
  const summary = document.getElementById('newsSummary').value.trim();
  const body = document.getElementById('newsBody').value.trim();

  if (!title || !summary || !body) {
    alert('शीर्षक, विवरण और पूरी खबर भरें।');
    return;
  }

  try {
    await addDoc(collection(db, 'news'), {
      title,
      category,
      summary,
      body,
      emoji:categoryEmoji[category] || '📰',
      color:'custom',
      source:'admin',
      createdAt:serverTimestamp(),
      externalUrl:''
    });

    document.getElementById('newsTitle').value = '';
    document.getElementById('newsSummary').value = '';
    document.getElementById('newsBody').value = '';
    document.getElementById('adminStatus').textContent = 'खबर ऑनलाइन प्रकाशित हो गई। सभी पाठकों के पेज पर अपडेट आएगा।';
  } catch (err) {
    console.error(err);
    alert('खबर प्रकाशित नहीं हुई। Firestore Rules और एडमिन UID जाँचें।');
  }
};

// FIXED: admin news delete handler syntax
document.getElementById('adminNewsList').addEventListener('click', async e => {
  const b = e.target.closest('[data-delete-news]');
  if (!b || !isAdmin) return;

  if (!confirm('क्या आप इस खबर को सभी पाठकों के लिए हटाना चाहते हैं?')) return;

  try {
    await deleteDoc(doc(db, 'news', b.dataset.deleteNews));
  } catch (err) {
    console.error(err);
    alert('खबर नहीं हट सकी। Firebase Rules जाँचें।');
  }
});

document.getElementById('exportNews').onclick = () => {
  const blob = new Blob([JSON.stringify(cloudArticles, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'india-update-news-backup.json';
  a.click();
  URL.revokeObjectURL(a.href);
};

document.getElementById('autoNewsBtn').onclick = async () => {
  const btn = document.getElementById('autoNewsBtn');
  const notice = document.getElementById('newsNotice');

  btn.disabled = true;
  notice.innerHTML = '<span>↻</span> RSS से सुर्खियाँ लाने की कोशिश हो रही है…';

  try {
    const feed = 'https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi';
    const url = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed);
    const res = await fetch(url);

    if (!res.ok) throw new Error('service');

    const data = await res.json();
    if (!data.items || !data.items.length) throw new Error('empty');

    let added = 0;

    for (const it of data.items.slice(0, 12)) {
      const title = (it.title || '').replace(/\s-\s[^-]+$/, '').trim();

      if (!title || allArticles().some(a => a.title === title)) continue;

      const item = {
        title,
        category:'देश',
        summary:'यह शीर्षक Google News RSS से प्राप्त हुआ है। पूरी खबर पढ़ने और पुष्टि के लिए मूल स्रोत खोलें।',
        body:'स्वचालित RSS सुर्खी। इस ऐप में पूरी खबर का लेख नहीं आया है। स्रोत लिंक: ' + (it.link || ''),
        externalUrl:it.link || '',
        source:'rss',
        createdAt:serverTimestamp()
      };

      if (isAdmin) {
        await addDoc(collection(db, 'news'), item);
        added++;
      }
    }

    render();

    notice.innerHTML = isAdmin
      ? '<span>✓</span> ' + added + ' RSS सुर्खियाँ ऑनलाइन जोड़ी गईं। ये केवल शीर्षक हैं; स्रोत खोलकर पुष्टि करें.'
      : '<span>!</span> RSS से सुर्खियाँ मिलीं, लेकिन ऑनलाइन प्रकाशित करने के लिए एडमिन लॉगिन करें।';
  } catch (e) {
    console.error(e);
    notice.innerHTML = '<span>!</span> स्वचालित RSS अभी नहीं चला। इंटरनेट या RSS सेवा में समस्या हो सकती है।';
  } finally {
    btn.disabled = false;
  }
};

render();
