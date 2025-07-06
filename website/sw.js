// Service Worker for Kauai Property Solutions
const CACHE_NAME = 'kps-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/contact.html',
  '/css/style.css',
  '/css/reset.css',
  '/css/variables.css',
  '/js/modern-script.js',
  '/offline.html'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the response for future use
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'form-sync') {
    event.waitUntil(syncFormData());
  }
});

async function syncFormData() {
  // Get queued form data from IndexedDB
  const formData = await getQueuedForms();
  
  for (const data of formData) {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      // Remove from queue on success
      await removeFromQueue(data.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

// Push notifications (if implemented)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update from KPS',
    icon: '/img/icon-192.png',
    badge: '/img/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Kauai Property Solutions', options)
  );
});