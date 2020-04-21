workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.core.exclude([/\.njk$/i, /\.css$/i]);

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

