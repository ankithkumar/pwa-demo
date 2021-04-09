module.exports = {
  "globDirectory": ".",
  "globPatterns": [
    "**/*.{png,html,css,js,json}"
  ],
  "swSrc": "./sw-base.js",
  "swDest": "./service-worker.js",
  "globIgnores": [
    "workbox-cli-config.js",
    "random.html",
    "node_modules/**",
    "package*.json",
    "sw*.js",
    "service-worker*.js"
  ]
};