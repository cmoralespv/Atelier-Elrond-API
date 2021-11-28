import { check } from 'k6';
import http from 'k6/http';

const host = `http://localhost:3000`;
// See https://k6.io/docs/using-k6/scenarios/executors/constant-arrival-rate/
export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: `constant-arrival-rate`,
      rate: 200, // 200 RPS, since timeUnit is the default 1s
      //timeUnit: '1s', // per time unit
      duration: '20s',
      preAllocatedVUs: 2000,
      maxVUs: 5000,
      gracefulStop: '5s',
    },
  },
};

export default function () {
  let product = 350000 + Math.floor(Math.random() * 900000);
  let res = http.get(`${host}/reviews/meta/?product_id=${product}`);
  check(res, {
    "success": (r) => r.status == 200
  });
};