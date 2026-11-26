import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
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
let rssArticles = [];
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
  // Published Firebase news takes priority; public RSS is the fallback when Firebase is empty.
  const realCloud = cloudArticles.filter(a => !a.demo);
  const realRss = rssArticles.filter(a => !a.demo);
  return realCloud.length ? realCloud : realRss;
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

function extractRssImage(item) {
  const candidates = [
    item.thumbnail,
    item.enclosure?.link,
    item.enclosure?.url,
    item.enclosure,
    item.image,
    item.imageUrl,
    item.media?.content?.url,
    item.media?.thumbnail?.url,
    item.media_thumbnail,
    item.content,
    item.description,
    item.contentSnippet
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && /^https?:\/\/.+\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(candidate)) {
      return candidate.replace(/^http:\/\//i, 'https://');
    }

    if (candidate && typeof candidate === 'object') {
      const url = candidate.url || candidate.link || candidate.src;
      if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
        return url.replace(/^http:\/\//i, 'https://');
      }
    }
  }

  const html = [item.content, item.description, item.contentSnippet]
    .filter(Boolean)
    .join(' ');

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const img = doc.querySelector('img');

  if (img?.src && /^https?:\/\//i.test(img.src)) {
    return img.src.replace(/^http:\/\//i, 'https://');
  }

  const match = html.match(/https?:\/\/[^"'<> ]+\.(jpg|jpeg|png|webp)(\?[^"'<> ]*)?/i);
  if (match) return match[0].replace(/^http:\/\//i, 'https://');

  return '';
}

function render() {
  const q = search.value.trim().toLocaleLowerCase('hi');

  const list = allArticles().filter(a =>
    (selectedCategory === 'सभी' || a.category === selectedCategory) &&
    (!savedOnly || saved.includes(a.id)) &&
    (!q || (a.title + ' ' + a.summary + ' ' + a.category).toLocaleLowerCase('hi').includes(q))
  );

  grid.innerHTML = list.map(a => `
    <article class="news-card" data-card="${safeText(a.id)}">
      <div class="thumb ${safeText(a.color || 'custom')}">
        <span class="tag">${safeText(a.category)}</span>
        ${a.imageUrl ? `<img class="news-photo" src="${safeText(a.imageUrl)}" alt="${safeText(a.title)}" loading="lazy">` : `<span class="emoji">${safeText(a.emoji || '📰')}</span>`}
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
          ${a.source === 'rss' ? `<button class="read-btn" data-customize-rss="${safeText(a.id)}" style="margin:4px 4px 4px 0">🤖 AI से Customize</button>` : ''}
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
  if (!e.target.closest('[data-read], [data-save], [data-share], a, input, select, textarea')) {
    const card = e.target.closest('[data-card]');
    if (card) { card.querySelector('[data-read]')?.click(); return; }
  }
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
      ${a.imageUrl ? `<img class="article-photo" src="${safeText(a.imageUrl)}" alt="${safeText(a.title)}">` : `<div class="article-hero">${safeText(a.emoji || '📰')}</div>`}
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

document.getElementById('adminLogin').onclick = async () => {
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
          'इस अकाउंट को एडमिन अनुमति नहीं मिली है। Firebase Console में admins/' + user.uid + ' दस्तावेज़ में role = admin होना चाहिए।';
        document.getElementById('adminForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
      }
    } catch (err) {
      console.error(err);
      document.getElementById('adminStatus').textContent = 'एडमिन अनुमति जाँच नहीं सकी। Firestore Rules और इंटरनेट कनेक्शन जाँचें।';
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
          body:x.body || x.content || '',
          color:x.color || 'custom',
          externalUrl:x.externalUrl || '',
          source:x.source || '',
          imageUrl:x.imageUrl || '',
          imagePath:x.imagePath || ''
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

// AI News Writer (Direct Gemini API)
const aiNewsGenerateButton = document.getElementById('aiNewsGenerate');
const geminiKeyInput = document.getElementById('geminiApiKey');

// Saved API Key auto-fill
if (geminiKeyInput) {
  const savedKey = localStorage.getItem('indiaUpdate_geminiKey');
  if (savedKey) geminiKeyInput.value = savedKey;
}

aiNewsGenerateButton?.addEventListener('click', async () => {
  const apiKey = geminiKeyInput?.value.trim();
  const source = document.getElementById('aiNewsSource').value.trim();
  const statusEl = document.getElementById('aiNewsStatus');
  const metaEl = document.getElementById('aiNewsMeta');

  if (!isAdmin || !auth.currentUser) {
    statusEl.textContent = 'पहले एडमिन लॉगिन करें।';
    return;
  }
  if (!apiKey) {
    statusEl.textContent = '⚠️ कृपया पहले अपनी Gemini API Key डालें।';
    geminiKeyInput?.focus();
    return;
  }
  if (!source) {
    statusEl.textContent = 'पहले स्रोत की खबर या मुख्य तथ्य पेस्ट करें।';
    return;
  }

  localStorage.setItem('indiaUpdate_geminiKey', apiKey);
  aiNewsGenerateButton.disabled = true;
  statusEl.textContent = '⏳ AI खबर तैयार कर रहा है…';
  metaEl.textContent = '';

  const prompt = `आप 'India Update' हिंदी न्यूज़ पोर्टल के सीनियर एडिटर हैं। नीचे दी गई जानकारी को तथ्य सुरक्षित रखते हुए एक प्रोफेशनल, सरल और मौलिक हिंदी समाचार में बदलें।
सिर्फ नीचे दिए JSON फॉर्मेट में जवाब दें:
{
  "title": "आकर्षक हिंदी हेडलाइन (अधिकतम 15 शब्द)",
  "category": "इनमें से ठीक एक चुनें: राजस्थान, देश, दुनिया, राजनीति, व्यापार, खेल, मनोरंजन",
  "summary": "2 लाइन का सटीक और छोटा विवरण",
  "body": "पूरी खबर 3-4 छोटे और स्पष्ट पैराग्राफ में"
}

स्रोत खबर:
${source}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      }
    );

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.error?.message || `AI अनुरोध असफल (${response.status})`);
    }

    const draft = JSON.parse(data.candidates[0].content.parts[0].text);
    if (!draft.title || !draft.summary || !draft.body) {
      throw new Error('AI का जवाब अधूरा है। दोबारा प्रयास करें।');
    }

    document.getElementById('newsTitle').value = draft.title;
    document.getElementById('newsSummary').value = draft.summary;
    document.getElementById('newsBody').value = draft.body;

    if (draft.category) {
      const categorySelect = document.getElementById('newsCategory');
      if ([...categorySelect.options].some(o => o.value === draft.category.trim())) {
        categorySelect.value = draft.category.trim();
      }
    }

    metaEl.textContent = `चुनी गई श्रेणी: ${draft.category || 'देश'}`;
    statusEl.textContent = '✅ ड्राफ्ट फ़ॉर्म में भर गया है। जाँच करें और नीचे Publish बटन दबाएँ।';
  } catch (err) {
    console.error('AI News Writer error:', err);
    statusEl.textContent = '❌ ' + (err.message || 'AI खबर तैयार नहीं कर पाया।');
  } finally {
    aiNewsGenerateButton.disabled = false;
  }
});
// AI News Image Studio: generate, preview, download, or attach to the news form.
const aiImageStudio = document.createElement('section');
aiImageStudio.id = 'aiImageStudio';
aiImageStudio.style.cssText = 'margin:14px 0;padding:14px;border:1px solid var(--line);border-radius:12px;background:var(--soft);';
aiImageStudio.innerHTML = `
  <h3 style="margin:0 0 8px">🎨 AI News Image Studio</h3>
  <p style="font-size:13px;margin:0 0 10px">खबर के लिए AI फोटो बनाएँ। तैयार फोटो पहले देखें; पसंद आने पर खबर में लगाएँ।</p>
  <textarea id="aiImagePrompt" rows="4" placeholder="फोटो का दृश्य लिखें…" style="width:100%;box-sizing:border-box;margin-bottom:8px"></textarea>
  <label style="display:block;font-size:13px;margin:6px 0">फोटो आकार
    <select id="aiImageSize" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:9px;margin-top:5px">
      <option value="1536x1024">16:9 न्यूज़ (लैंडस्केप)</option><option value="1024x1536">9:16 मोबाइल</option><option value="1024x1024">1:1 वर्ग</option>
    </select>
  </label>
  <button id="aiImageGenerate" type="button" class="read-btn">✨ AI से फोटो बनाएँ</button>
  <p id="aiImageStatus" style="margin:8px 0;font-size:13px"></p>
  <img id="aiImagePreview" alt="AI से बनी खबर की फोटो" style="display:none;width:100%;max-height:360px;object-fit:contain;border-radius:12px;margin:8px 0;background:#111">
  <div id="aiImageActions" style="display:none;gap:8px;flex-wrap:wrap">
    <button id="aiImageAttach" type="button" class="read-btn">खबर में लगाएँ</button><button id="aiImageDownload" type="button" class="read-btn">फोटो डाउनलोड</button>
  </div>
`;
const adminFormForImage = document.getElementById('adminForm');
if (adminFormForImage && !document.getElementById('aiImageStudio')) adminFormForImage.insertBefore(aiImageStudio, document.getElementById('publishNews'));
let generatedNewsImageBlob = null;
let generatedNewsImageUrl = '';
const aiImageGenerateButton = document.getElementById('aiImageGenerate');
const aiImagePromptField = document.getElementById('aiImagePrompt');
const aiImagePreview = document.getElementById('aiImagePreview');
const aiImageStatus = document.getElementById('aiImageStatus');
const aiImageActions = document.getElementById('aiImageActions');
const aiImageAttachButton = document.getElementById('aiImageAttach');
const aiImageDownloadButton = document.getElementById('aiImageDownload');
// Seed the prompt from AI News Writer's image prompt or article text.
const aiNewsMetaForImage = document.getElementById('aiNewsMeta');
if (aiImagePromptField && aiNewsMetaForImage) {
  const imagePromptText = aiNewsMetaForImage.textContent.match(/इमेज प्रॉम्प्ट:\s*([^\n]+)/);
  if (imagePromptText) aiImagePromptField.value = imagePromptText[1];
}
aiImageGenerateButton?.addEventListener('click', async () => {
  const prompt = aiImagePromptField.value.trim() || [document.getElementById('newsTitle').value, document.getElementById('newsSummary').value, document.getElementById('newsBody').value].filter(Boolean).join('\n');
  if (!aiImagePromptField.value.trim() && prompt) aiImagePromptField.value = prompt;
  if (!isAdmin || !auth.currentUser) { aiImageStatus.textContent = 'पहले एडमिन लॉगिन करें।'; return; }
  if (!prompt) { aiImageStatus.textContent = 'पहले फोटो का दृश्य या प्रॉम्प्ट लिखें।'; return; }
  aiImageGenerateButton.disabled = true; aiImageStatus.textContent = 'AI फोटो बना रहा है…'; aiImageActions.style.display = 'none'; aiImagePreview.style.display = 'none';
  try {
    const idToken = await auth.currentUser.getIdToken();
    const response = await fetch('https://round-grass-939e.indiaupdate1996.workers.dev/ai-image', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
      body: JSON.stringify({ prompt, size: document.getElementById('aiImageSize').value })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `AI image request failed (${response.status})`);
    if (!result.image) throw new Error('AI ने फोटो नहीं लौटाई।');
    generatedNewsImageBlob = await (await fetch(`data:image/png;base64,${result.image}`)).blob();
    if (generatedNewsImageUrl) URL.revokeObjectURL(generatedNewsImageUrl);
    generatedNewsImageUrl = URL.createObjectURL(generatedNewsImageBlob);
    aiImagePreview.src = generatedNewsImageUrl; aiImagePreview.style.display = 'block'; aiImageActions.style.display = 'flex';
    aiImageStatus.textContent = 'फोटो तैयार है। इसे खबर में लगाएँ या डाउनलोड करें।';
  } catch (err) { aiImageStatus.textContent = err.message || 'AI फोटो बनाने में त्रुटि हुई।'; }
  finally { aiImageGenerateButton.disabled = false; }
});
aiImageAttachButton?.addEventListener('click', () => {
  if (!generatedNewsImageBlob) { aiImageStatus.textContent = 'पहले फोटो बनाएँ।'; return; }
  const file = new File([generatedNewsImageBlob], 'india-update-ai-news.png', { type: 'image/png' });
  const dt = new DataTransfer(); dt.items.add(file);
  const input = document.getElementById('newsImage'); input.files = dt.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  aiImageStatus.textContent = 'AI फोटो खबर के फोटो फ़ील्ड में लग गई है। Publish करने से पहले preview जाँचें।';
});
aiImageDownloadButton?.addEventListener('click', () => {
  if (!generatedNewsImageUrl) return;
  const a = document.createElement('a'); a.href = generatedNewsImageUrl; a.download = 'india-update-ai-news.png'; a.click();
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
  const imageFile = document.getElementById('newsImage').files[0] || null;

  if (!title || !summary || !body) {
    alert('शीर्षक, विवरण और पूरी खबर भरें।');
    return;
  }

  try {
    let imageUrl = '';
    if (imageFile) {
      if (!imageFile.type.startsWith('image/')) {
        throw new Error('कृपया JPG, PNG या WebP फोटो चुनें।');
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        throw new Error('फोटो 5 MB से छोटी होनी चाहिए।');
      }

      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', 'india_update_news');

      const uploadResponse = await fetch(
        'https://api.cloudinary.com/v1_1/rkfting/image/upload',
        { method: 'POST', body: formData }
      );
      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.secure_url) {
        throw new Error(uploadResult.error?.message || 'Cloudinary फोटो अपलोड नहीं हुई।');
      }
      imageUrl = uploadResult.secure_url;
    }
    await addDoc(collection(db, 'news'), {
      title,
      category,
      summary,
      body,
      emoji:categoryEmoji[category] || '📰',
      color:'custom',
      source:'admin',
      imageUrl,
      createdAt:serverTimestamp(),
      externalUrl:''
    });

    document.getElementById('newsTitle').value = '';
    document.getElementById('newsSummary').value = '';
    document.getElementById('newsBody').value = '';
    document.getElementById('adminStatus').textContent = 'खबर ऑनलाइन प्रकाशित हो गई। सभी पाठकों के पेज पर अपडेट आएगा।';
  } catch (err) {
    console.error(err);
    alert(err.message || 'खबर प्रकाशित नहीं हुई। Firebase Storage चालू है और Storage Rules प्रकाशित हैं, यह जाँचें।');
  }
};

// RSS news can be sent directly into the AI Customizer from the admin list.
document.getElementById('adminNewsList').addEventListener('click', e => {
  const b = e.target.closest('[data-customize-rss]');
  if (!b || !isAdmin) return;
  const article = cloudArticles.find(a => String(a.id) === String(b.dataset.customizeRss));
  if (!article) return;
  const sourceText = [
    'RSS NEWS — कृपया इस स्रोत खबर को India Update के लिए तथ्य सुरक्षित रखते हुए सरल, मौलिक हिंदी में री-राइट करें।',
    `शीर्षक: ${article.title || ''}`,
    `विवरण: ${article.summary || ''}`,
    `मूल स्रोत लिंक: ${article.externalUrl || 'उपलब्ध नहीं'}`,
    `स्रोत: ${article.source || 'RSS'}`
  ].join('\n');
  const sourceField = document.getElementById('aiNewsSource');
  sourceField.value = sourceText;
  document.getElementById('aiNewsStatus').textContent = 'RSS खबर AI में भेजी जा रही है…';
  document.getElementById('aiNewsWriterPanel').scrollIntoView({behavior:'smooth', block:'center'});
  sourceField.focus();
  // One-click workflow: selecting Customize starts AI drafting automatically.
  aiNewsGenerateButton.click();
});

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

const newsImageInput = document.getElementById('newsImage');
newsImageInput.addEventListener('change', () => {
  const file = newsImageInput.files[0];
  const preview = document.getElementById('imagePreview');
  if (!file) { preview.classList.add('hidden'); preview.removeAttribute('src'); return; }
  if (!file.type.startsWith('image/')) { alert('कृपया फोटो फ़ाइल चुनें।'); newsImageInput.value = ''; preview.classList.add('hidden'); return; }
  if (file.size > 5 * 1024 * 1024) { alert('फोटो 5 MB से छोटी होनी चाहिए।'); newsImageInput.value = ''; preview.classList.add('hidden'); return; }
  preview.src = URL.createObjectURL(file);
  preview.classList.remove('hidden');
});

document.getElementById('exportNews').onclick = () => {
  const blob = new Blob([JSON.stringify(cloudArticles, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'india-update-news-backup.json';
  a.click();
  URL.revokeObjectURL(a.href);
};

async function loadPublicRssFallback() {
  if (cloudArticles.length) return;
  try {
    const feed = 'https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi';
    const url = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed);
    const res = await fetch(url);
    if (!res.ok) throw new Error('RSS service');
    const data = await res.json();
    if (!Array.isArray(data.items) || !data.items.length) throw new Error('Empty RSS');
    rssArticles = data.items.slice(0, 15).map((it, index) => {
      const title = (it.title || '').replace(/\s-\s[^-]+$/, '').trim();
      const summary = (it.description || it.content || '').replace(/<[^>]*>/g, '').trim();
      return { id: 'rss-public-' + index, title, category: 'देश', emoji: '📰',
        date: it.pubDate ? new Date(it.pubDate).toLocaleString('hi-IN') : 'ताज़ा खबर',
        summary, body: summary, externalUrl: it.link || '', imageUrl: '', source: 'RSS', color: 'custom' };
    }).filter(a => a.title);
    render();
    document.getElementById('newsNotice').innerHTML = rssArticles.length
      ? '<span>✓</span> ताज़ा सुर्खियाँ RSS से दिखाई जा रही हैं। खबर प्रकाशित करने से पहले स्रोत की पुष्टि करें।'
      : '<span>!</span> अभी खबरें उपलब्ध नहीं हैं।';
  } catch (err) {
    console.warn('Public RSS fallback failed', err);
    document.getElementById('newsNotice').innerHTML = '<span>!</span> खबरें लोड नहीं हुईं। इंटरनेट कनेक्शन या RSS सेवा जाँचें।';
  }
}

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


  const imageUrl =
    it.thumbnail ||
    it.enclosure?.link ||
    it.enclosure?.url ||
    it.image ||
    it.images?.[0] ||
    it.media?.content?.url ||
    it.media_thumbnail?.url ||
    "";

  if (!title || allArticles().some(a => a.title === title)) continue;

  const item = {
  title: title,
  category: 'देश',
  summary: it.description || it.content || '',
  body: it.description || it.content || '',
  externalUrl: it.link || '',
  imageUrl: imageUrl,
  source: 'rss',
  createdAt: serverTimestamp()
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
loadPublicRssFallback();

