import type {MetadataRoute} from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        "name": "On My Way",
        "short_name": "OMW",
        "theme_color": "#000",
        "background_color": "#000",
        "display": "standalone",
        "orientation": "any",
        "scope": "/",
        "start_url": "/profile",
        "icons": [
            {"src": "/icons/logo-128.png", "type": "image/png", "sizes": "128x128"},
            {"src": "/icons/logo-192.png", "type": "image/png", "sizes": "192x192"},
            {"src": "/icons/logo-256.png", "type": "image/png", "sizes": "256x256"},
            {"src": "/icons/logo-512.png", "type": "image/png", "sizes": "512x512"}
        ]
    }
}