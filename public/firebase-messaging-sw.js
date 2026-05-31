/* RentalPins web push service worker (FCM background messages). */
/* eslint-disable */
importScripts(
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js"
);

// Public web config — matches lib/firebase-client.ts.
firebase.initializeApp({
  apiKey: "AIzaSyBQg5AbUmjdCwbpbJv01mkdBs06vC4TM0c",
  authDomain: "rent-it-dev-6bcfd.firebaseapp.com",
  projectId: "rent-it-dev-6bcfd",
  storageBucket: "rent-it-dev-6bcfd.firebasestorage.app",
  messagingSenderId: "73612808652",
  appId: "1:73612808652:web:e3dae981ad451935c60d69",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "RentalPins";
  const body = (payload.notification && payload.notification.body) || "";
  const url = (payload.data && payload.data.url) || "/";
  self.registration.showNotification(title, {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { url },
    tag: (payload.data && payload.data.savedSearchId) || "rentalpins",
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ("focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});
