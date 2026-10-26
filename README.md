# India Update — Firebase + Secure Admin + Hosting

यह पैकेज मौजूदा India Update डिज़ाइन और खबरों की सुविधाओं को बरकरार रखते हुए Firebase Authentication और Cloud Firestore जोड़ता है।

## क्या बदला है
- पुराने डेमो PIN `2468` को हटाकर Firebase ईमेल/पासवर्ड लॉगिन जोड़ा गया है।
- खबरें Firestore के `news` collection में सेव होती हैं और लाइव listener से सभी पाठकों को अपडेट मिलते हैं।
- केवल `admins/{UID}` दस्तावेज़ में `role: "admin"` वाले लॉगिन अकाउंट ही खबर प्रकाशित/हटा सकते हैं।
- `firestore.rules` सुरक्षा नियम शामिल हैं।
- `firebase.json` Firebase Hosting के लिए शामिल है।
- मौजूदा UI, कैटेगरी, सर्च, सेव/शेयर, डार्क मोड और RSS शीर्षक आयात की कोशिश रखी गई है।

## चरण 1 — Firebase Console में सेवाएँ चालू करें
1. https://console.firebase.google.com/ खोलें और `india-update-news` प्रोजेक्ट चुनें।
2. **Authentication → Get started → Sign-in method → Email/Password** चालू करें।
3. Authentication → Users में **Add user** से अपना निजी एडमिन ईमेल और मजबूत पासवर्ड बनाएँ। पासवर्ड किसी के साथ साझा न करें।
4. **Firestore Database** खोलें और Create database करें। शुरुआत में production mode चुन सकते हैं; आगे नियम प्रकाशित करें।
5. Project settings → Your apps में Web App की Firebase config को `app.js` में मौजूद config से मिलाएँ। अगर Firebase Console अलग config दिखाता है, तो केवल `firebaseConfig` वाला object अपडेट करें।

## चरण 2 — एडमिन की अनुमति देना
1. Firebase Console → Authentication → Users में अपने बनाए अकाउंट को खोलें और उसका **UID** कॉपी करें।
2. Firestore Database → Data → Start collection: `admins`
3. Document ID में वही UID रखें (UID के अक्षर बिल्कुल वैसे ही)।
4. Field बनाएँ: `role` — type `string` — value `admin`.
5. `admins` दस्तावेज़ केवल Firebase Console से बनाएँ। ऐप से इसे बनाना/बदलना सुरक्षा नियमों द्वारा बंद है।

## चरण 3 — Firestore नियम लगाएँ
Firebase Console → Firestore Database → Rules में `firestore.rules` की सामग्री कॉपी करके **Publish** करें। यह नियम सार्वजनिक पढ़ने की अनुमति देते हैं, लेकिन खबरें जोड़ने/बदलने/हटाने की अनुमति सिर्फ allow-list में मौजूद एडमिन को देते हैं।

## चरण 4 — Authentication authorized domains
Firebase Console → Authentication → Settings → Authorized domains में Firebase Hosting domain जोड़ें। `localhost` से परीक्षण करना हो तो वह भी जोड़ें। अपने असली hosting domain को भी यहाँ जोड़ें।

## चरण 5 — वेबसाइट deploy करना (कंप्यूटर पर)
Node.js का मौजूदा LTS संस्करण और Firebase CLI इंस्टॉल करें। फिर इस फ़ोल्डर में terminal खोलें:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
```

प्रोजेक्ट चुनें `india-update-news` और alias `default` दें। इसके बाद:

```bash
firebase deploy --only firestore:rules,hosting
```

Deploy पूरा होने पर Firebase Hosting URL मिलेगा, जैसे `https://PROJECT_ID.web.app`। वास्तविक URL terminal में जो मिलेगा, वही इस्तेमाल करें।

## मोबाइल से उपयोग
सिर्फ ZIP को फोन में खोलने से Firebase Hosting deploy नहीं होगा। Hosting deploy करने के लिए Firebase CLI वाला कंप्यूटर या कोई Git-based deployment workflow चाहिए। Deploy के बाद वेबसाइट Android Chrome में खुलेगी।

## सुरक्षा नोट
- Firebase Web API key फ्रंटएंड config का हिस्सा होती है; इसे एडमिन पासवर्ड न समझें। सुरक्षा Authentication और Firestore Rules से लागू होती है। Firebase Console में API restrictions/quotas भी जाँचें।
- `admins` collection में किसी UID को `role: admin` देना उस व्यक्ति को खबरें प्रकाशित/हटाने का अधिकार देता है।
- RSS केवल शीर्षक और स्रोत लिंक दे सकता है; अपने-आप पूर्ण लेख नहीं। हर खबर की तारीख, तथ्य, स्रोत और कॉपीराइट की जाँच करें।
- शुरुआती डेमो खबरें अभी भी दिखाई देती हैं और उन पर डेमो लेबल है; इन्हें वास्तविक खबरों के रूप में प्रकाशित न करें।
- `localStorage` में saved/bookmarked खबरें उसी ब्राउज़र तक सीमित रहती हैं।

## परीक्षण checklist
- [ ] Firebase Authentication में Email/Password चालू है
- [ ] एडमिन user बनाया गया है
- [ ] Firestore `admins/{UID}` में `role = admin` है
- [ ] Firestore Rules publish किए हैं
- [ ] Authorized domains में hosting domain है
- [ ] वेबसाइट deploy हो गई है
- [ ] एडमिन लॉगिन के बाद एक टेस्ट खबर प्रकाशित करके दूसरे ब्राउज़र/मोबाइल में जाँची है
