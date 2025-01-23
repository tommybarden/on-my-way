self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "/icons/logo-48.png",
            badge: "/icons/logo-48.png",
            //data: data.url,
            requireInteraction: true,
            vibrate: [400, 100, 300, 75, 200, 50, 100],
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    if (event.notification.data) {
        event.waitUntil(clients.openWindow(event.notification.data));
    }
});
