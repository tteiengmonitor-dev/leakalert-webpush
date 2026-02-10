// Firebase SDK (compat)
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDJh-QdJ0O-1s-puzkumt_XWWHi1mwA61Q",
  authDomain: "leakalert-d4bfa.firebaseapp.com",
  projectId: "leakalert-d4bfa",
  storageBucket: "leakalert-d4bfa.firebasestorage.app",
  messagingSenderId: "397827695381",
  appId: "1:397827695381:web:253e42a474b8abeb89ff1c"
});

const messaging = firebase.messaging();

// รับ data message
messaging.onBackgroundMessage((payload) => {
  const title = payload.data?.title || "LeakAlert";
  const options = {
    body: payload.data?.body || "มีการแจ้งเตือนใหม่",
    icon: "/icon.png",
    data: {
      url: payload.data?.url // 👈 เก็บ URL ไว้กับ notification
    }
  };

  self.registration.showNotification(title, options);
});

// 👉 เมื่อ user คลิก notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url;
  if (!url) return;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // ถ้ามี tab เปิดอยู่แล้ว → focus
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        // ไม่มีก็เปิดใหม่
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
