  // Commands to run k6 on docker container as part of the New Relic integration.
  // Run these commands inside the directory where they exist.

  // K6_STATSD_ENABLE_TAGS=true k6 run --out statsd k6_metadata_low.js
  // K6_STATSD_ENABLE_TAGS=true k6 run --out statsd k6_metadata_mid.js
  // K6_STATSD_ENABLE_TAGS=true k6 run --out statsd k6_metadata_high.js

  // K6_STATSD_ENABLE_TAGS=true k6 run --out statsd k6_reviews_low.js
  // K6_STATSD_ENABLE_TAGS=true k6 run --out statsd k6_reviews_mid.js
  // K6_STATSD_ENABLE_TAGS=true k6 run --out statsd k6_reviews_high.js
