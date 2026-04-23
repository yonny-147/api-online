#!/usr/bin/env node

/**
 * Prueba todos los endpoints de la API Mock
 * Uso: node scripts/test-all-endpoints.js
 */

const http = require("http");

const PORT = process.env.PORT || 3000;
let passed = 0;
let failed = 0;

function request(method, urlPath, { headers = {}, body = null } = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: PORT,
      path: urlPath,
      method,
      headers: { "Content-Type": "application/json", ...headers },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function log(name, ok, detail = "") {
  if (ok) { passed++; console.log(`  [OK]   ${name}${detail ? " - " + detail : ""}`); }
  else    { failed++; console.log(`  [FAIL] ${name}${detail ? " - " + detail : ""}`); }
}

async function testNoAuth() {
  console.log("\n--- SIN SEGURIDAD ---\n");

  let r = await request("POST", "/no-auth/list/facturas", { body: { id_factura: "001" } });
  log("POST /no-auth/list/facturas", r.status === 200, `status=${r.status}`);

  r = await request("GET", "/no-auth/list/facturas?id_factura=001");
  log("GET  /no-auth/list/facturas", r.status === 200, `status=${r.status}`);

  r = await request("POST", "/no-auth/confirmacion", { body: { test: "data" } });
  log("POST /no-auth/confirmacion", r.status === 200, `status=${r.status}`);

  r = await request("GET", "/no-auth/confirmacion?ref=12345");
  log("GET  /no-auth/confirmacion", r.status === 200, `status=${r.status}`);
}

async function testBasicAuth() {
  console.log("\n--- BASIC AUTH ---\n");
  const auth = "Basic " + Buffer.from("testuser:testpass").toString("base64");

  let r = await request("POST", "/basic/list/facturas", { headers: { Authorization: auth }, body: { id_factura: "001" } });
  log("POST /basic/list/facturas", r.status === 200, `status=${r.status}`);

  r = await request("POST", "/basic/list/facturas");
  log("POST /basic/list/facturas (sin auth -> 401)", r.status === 401, `status=${r.status}`);

  r = await request("POST", "/basic/confirmacion", { headers: { Authorization: auth }, body: { ref: "12345" } });
  log("POST /basic/confirmacion", r.status === 200, `status=${r.status}`);

  r = await request("GET", "/basic/confirmacion?ref=12345", { headers: { Authorization: auth } });
  log("GET  /basic/confirmacion", r.status === 200, `status=${r.status}`);
}

async function testJWT() {
  console.log("\n--- JWT ---\n");

  let r = await request("GET", "/jwt/login");
  log("GET  /jwt/login", r.status === 200, `status=${r.status}`);

  if (r.status === 200 && r.body.token) {
    const auth = `Bearer ${r.body.token}`;

    let r2 = await request("POST", "/jwt/list/facturas", { headers: { Authorization: auth }, body: { id_factura: "002" } });
    log("POST /jwt/list/facturas", r2.status === 200, `status=${r2.status}`);

    r2 = await request("POST", "/jwt/confirmacion", { headers: { Authorization: auth }, body: { test: "data" } });
    log("POST /jwt/confirmacion", r2.status === 200, `status=${r2.status}`);

    r2 = await request("GET", "/jwt/confirmacion?ref=12345", { headers: { Authorization: auth } });
    log("GET  /jwt/confirmacion", r2.status === 200, `status=${r2.status}`);
  }

  r = await request("POST", "/jwt/list/facturas");
  log("POST /jwt/list/facturas (sin token -> 401)", r.status === 401, `status=${r.status}`);
}

async function run() {
  console.log("=".repeat(55));
  console.log("  TEST: Endpoints API Mock");
  console.log("=".repeat(55));

  await testNoAuth();
  await testBasicAuth();
  await testJWT();

  console.log("\n" + "=".repeat(55));
  console.log(`  Resultado: ${passed} OK | ${failed} FAIL`);
  console.log("=".repeat(55) + "\n");

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
