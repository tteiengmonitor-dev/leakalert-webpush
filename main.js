// ===== Firebase config =====
const firebaseConfig = {
  apiKey: "AIzaSyDJh-QdJ00-1s-puzkumt_XWWhi1mwA61Q",
  authDomain: "leakalert-d4bfa.firebaseapp.com",
  projectId: "leakalert-d4bfa",
  storageBucket: "leakalert-d4bfa.firebasestorage.app",
  messagingSenderId: "397827695381",
  appId: "1:397827695381:web:253e42a474b8abeb89ff1c"
};

// Init Firebase (compat)
firebase.initializeApp(firebaseConfig);

// Messaging
const messaging = firebase.messaging();

// Register service worker
navigator.serviceWorker.register("firebase-messaging-sw.js")
  .then((registration) => {
    messaging.useServiceWorker(registration);
  });

// Button click
document.getElementById("subscribeBtn").addEventListener("click", async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("ยังไม่ได้อนุญาตแจ้งเตือน");
      return;
    }

    const token = await messaging.getToken({
      vapidKey: "PUT_YOUR_VAPID_KEY"
    });

    console.log("🔥 FCM TOKEN:", token);
    alert("สมัครรับแจ้งเตือนเรียบร้อย");

  } catch (err) {
    console.error(err);
    alert("Error ดูที่ console");
  }
});
