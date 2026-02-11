// ===== Firebase config =====
const firebaseConfig = {
  apiKey: "AIzaSyDJh-QdJ0O-1s-puzkumt_XWWHi1mwA61Q",
  authDomain: "leakalert-d4bfa.firebaseapp.com",
  projectId: "leakalert-d4bfa",
  storageBucket: "leakalert-d4bfa.firebasestorage.app",
  messagingSenderId: "397827695381",
  appId: "1:397827695381:web:253e42a474b8abeb89ff1c"
};

function isIOS(){
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

// ❗ FCM ใช้ไม่ได้บน iOS
if (isIOS()) {
  console.warn("❌ iOS does not support Firebase Web Push");
}

// Init Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

let swRegistration = null;
let swReady = false;

// 🔧 Google Apps Script Web App URL
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzzwcNDOSn2YfY19kX-b9atvQ7dVbVXMS7bHMkzlpb6W9oEMu3l4O1XT7ItOrbuxTEC/exec";

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


// ให้หน้า HTML เรียกฟังก์ชันนี้แทน
window.subscribeFCM = async function () {

  // กัน iOS ซ้ำอีกชั้น (กันพลาด)
  if (isIOS()) {
    alert("iPhone / iPad ยังไม่รองรับการแจ้งเตือนผ่านระบบนี้");
    return;
  }

  try {

    if (!swReady || !swRegistration) {
      alert("⏳ กำลังเตรียม Service Worker… ลองใหม่อีกครั้ง");
      return;
    }

    if (Notification.permission !== "granted") {
      alert("❌ ยังไม่ได้อนุญาตแจ้งเตือน");
      return;
    }

    const token = await messaging.getToken({
      vapidKey:
        "BNh9e0Zvd4lxWptKQX_BgYq31yhS0CfNnW63tDD597sKnSFd2qtcFl2uGMdCJ-SMy7H6szRHTqC7ZU72wNPYLmo",
      serviceWorkerRegistration: swRegistration
    });

    if (!token) {
      alert("❌ ไม่สามารถสร้าง token ได้");
      return;
    }

    console.log("🔥 FCM TOKEN:", token);

    const formData = new FormData();
    formData.append("action", "saveToken");
    formData.append("token", token);
    formData.append("subscribedAt", new Date().toISOString());

    await fetch(GAS_URL, {
      method: "POST",
      body: formData
    });

    alert("✅ สมัครรับแจ้งเตือนเรียบร้อย");

  } catch (err) {
    console.error("❌ ERROR:", err);
    alert("❌ Error ดูที่ console");
  }
};
