// Imports
importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v3';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg'
];

const APP_SHELL_INMUTABLE =  [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/app.js'
];

// instalamos cache
self.addEventListener('install', e =>{

    const cacheStatic = caches.open(STATIC_CACHE).then(
        cache => cache.addAll(APP_SHELL)
    )

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(
        cache => cache.addAll(APP_SHELL_INMUTABLE)
    )


    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));
})

// Borramoslos antiguos
self.addEventListener('activate', e =>{
 
    const cacheProm = caches.keys().then(keys =>{
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
            if (key !== DYNAMIC_CACHE && key.includes('dynamic')){
                return caches.delete(key);
            }            
        });
    })
    e.waitUntil(cacheProm);

}) 


// Implantamos la estrategia del cache

 self-addEventListener('fetch', e =>{

    const respuesta = caches.match(e.request).then(res =>{

        if  (res){
            return res;
        } else {
            // console.log(e.request.url);
            return fetch(e.request).then(newRes =>{
                return actualizaCacheDinamico(DYNAMIC_CACHE,e.request,newRes);
            })
        }
    });

    e.respondWith(respuesta);
}) 