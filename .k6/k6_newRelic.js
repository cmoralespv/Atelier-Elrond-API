  // Commands to run k6 on docker container as part of the New Relic integration.
  // Run these commands inside the directory where they exist.

  // K6_STATSD_ENABLE_TAGS=true k6 run --out statsd metadata_low.js
  // K6_STATSD_ENABLE_TAGS=true k6 run --out statsd metadata_mid.js
  // K6_STATSD_ENABLE_TAGS=true k6 run --out statsd metadata_high.js

  // K6_STATSD_ENABLE_TAGS=true k6 run --out statsd products_low.js
  // K6_STATSD_ENABLE_TAGS=true k6 run --out statsd products_mid.js
  // K6_STATSD_ENABLE_TAGS=true k6 run --out statsd products_high.js
