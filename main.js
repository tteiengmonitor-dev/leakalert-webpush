// ===== Firebase config =====
const firebaseConfig = {
  apiKey: "AIzaSyDJh-QdJ0O-1s-puzkumt_XWWHi1mwA61Q",
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

let swRegistration = null;
let swReady = false;

// Register service worker
navigator.serviceWorker
  .register("./firebase-messaging-sw.js")
  .then((registration) => {
    console.log("✅ Service Worker registered");
    swRegistration = registration;
    swReady = true;
  })
  .catch((err) => {
    console.error("❌ Service Worker register error", err);
  });

// Button click
document.getElementById("subscribeBtn").addEventListener("click", async () => {
  try {
    if (!swReady || !swRegistration) {
      alert("⏳ กำลังเตรียม Service Worker… ลองใหม่อีกครั้ง");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("❌ ยังไม่ได้อนุญาตแจ้งเตือน");
      return;
    }

    const token = await messaging.getToken({
      vapidKey: "BNh9e0Zvd4lxWptKQX_BgYq31yhS0CfNnW63tDD597sKnSFd2qtcFl2uGMdCJ-SMy7H6szRHTqC7ZU72wNPYLmo",
      serviceWorkerRegistration: swRegistration
    });

    console.log("🔥 FCM TOKEN:", token);
    alert("✅ สมัครรับแจ้งเตือนแล้ว (ดู token ใน console)");

  } catch (err) {
    console.error("❌ ERROR:", err);
    alert("❌ Error ดูที่ console");
  }
});
