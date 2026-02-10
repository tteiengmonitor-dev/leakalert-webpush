// ===== Firebase config =====
const firebaseConfig = {
  apiKey: "AIzaSyDJh-QdJ00-1s-puzkumt_XWWhi1mwA61Q",
  authDomain: "leakalert-d4bfa.firebaseapp.com",
  projectId: "leakalert-d4bfa",
  storageBucket: "leakalert-d4bfa.firebasestorage.app",
  messagingSenderId: "397827695381",
  appId: "1:397827695381:web:253e42a474b8abeb89ff1c"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);

// Messaging
const messaging = firebase.messaging();

// เก็บ service worker registration ไว้ใช้ตอน getToken
let swRegistration = null;

// Register service worker (สำคัญมาก)
navigator.serviceWorker
  .register("./firebase-messaging-sw.js")
  .then((registration) => {
    console.log("✅ Service Worker registered");
    swRegistration = registration;
  })
  .catch((err) => {
    console.error("❌ Service Worker register error", err);
  });

// Button click
document.getElementById("subscribeBtn").addEventListener("click", async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("❌ ยังไม่ได้อนุญาตแจ้งเตือน");
      return;
    }

    if (!swRegistration) {
      alert("❌ Service Worker ยังไม่พร้อม ลอง refresh หน้าเว็บ");
      return;
    }

    const token = await messaging.getToken({
      vapidKey: "BNh9e0Zvd4lxWptKQX_BgYq3IyhSOCfNnW63tDD597sKnSFd2qtcFI2uGMdCJ-SMy7H6szRHtqC7ZU72wNPYLmo",
      serviceWorkerRegistration: swRegistration
    });

    console.log("🔥 FCM TOKEN:", token);
    alert("✅ สมัครรับแจ้งเตือนแล้ว (ดู token ใน console)");

  } catch (err) {
    console.error("❌ ERROR:", err);
    alert("❌ Error ดูที่ console");
  }
});
