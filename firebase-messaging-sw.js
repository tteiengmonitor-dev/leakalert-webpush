// Firebase SDK (compat)
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// Firebase config (ต้องตรงกับ main.js)
firebase.initializeApp({
  apiKey: "AIzaSyDJh-QdJ0O-1s-puzkumt_XWWHi1mwA61Q",
  authDomain: "leakalert-d4bfa.firebaseapp.com",
  projectId: "leakalert-d4bfa",
  storageBucket: "leakalert-d4bfa.firebasestorage.app",
  messagingSenderId: "397827695381",
  appId: "1:397827695381:web:253e42a474b8abeb89ff1c"
});

const messaging = firebase.messaging();

// รับ push ตอนเว็บไม่ได้เปิดอยู่
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "LeakAlert";
  const options = {
    body: payload.notification?.body || "มีการแจ้งเตือนใหม่",
    icon: "/icon.png" // มีหรือไม่มีก็ได้
  };

  self.registration.showNotification(title, options);
});
