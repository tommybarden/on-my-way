import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    "name":"On My Way",
    "short_name":"OMW",
    "theme_color":"#4682B4",
    "background_color":"#ffffff",
    "display":"standalone",
    "orientation":"any",
    "scope":"/",
    "start_url":"/profile",
    "icons":[
        {"src":"/logo-192.png","type":"image/png","sizes":"192x192"},
        {"src":"/logo-256.png","type":"image/png","sizes":"256x256"},
        {"src":"/logo-512.png","type":"image/png","sizes":"512x512"}
    ]}
}