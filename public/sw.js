"use strict"
const staticCacheName = 'wings-of-bharat-react';
const urlsToCache = [
  '/',
  'favicon.ico',
  'index.html',
  '/index.css',
  '/App.js',
  '/FilterLocations.js',
  '/SanctuaryLocations.js',
  '/InfoWindow.js',
  '/index.js',
  '/sw_registration.js'


];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            return cache.addAll(urlsToCache);
        }).catch(err => {
            console.log(err);
        })
    );
});


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, {
            ignoreSearch: true
        }).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request).then(response => {
                return caches.open(staticCacheName).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            }).catch(err => {
                throw err;
            });
        })
    );
});
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName.startsWith('wings-of-') && cacheName != staticCacheName;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
