const express = require("express");
const { basicAuth } = require("./middleware/middleware");
const {
  generateBearerToken,
  verifyBearerToken,
} = require("./middleware/middleware_token");

const app = express();
app.use(express.json());

// ---------------------------------------------------------------------------
// Datos mock de facturas
// ---------------------------------------------------------------------------
const facturas = [
  {
    id_factura: "001",
    tipo_id: "CC",
    numero_id: 10251205,
    nombre: "Carlos Ramirez",
    descripcion: "Servicio de acueducto mensual periodo enero 2024",
    numero_id_empresa: "EMP-00123",
    codigo_pago: "ACU-2024-001",
    valor: 5,
    impuesto1: 5700,
    segundo_valor: 12000,
    segundo_impuesto: 2280,
    tercer_valor: 8000,
    tercer_impuesto: 1520,
    correo: "carlos1payco@pruebas.com",
    telefono: "3101234567",
    adicional1: "Zona Norte",
    adicional2: "Estrato 3",
    adicional3: "Ciclo A",
    adicional4: "Ruta 12",
    adicional5: "Medidor 45678",
    adicional6: "Lectura anterior 1250",
    adicional7: "Lectura actual 1380",
    adicional8: "Consumo 130 m3",
    adicional9: "Periodo ENE-2024",
    adicional10: "Vencimiento 2024-01-31",
    adicional11: "Subsidio E3",
    adicional12: "Cargo fijo 8500",
    adicional13: "Cargo variable 21500",
    adicional14: "Descuento 0",
    adicional15: "Interes 0",
    adicional16: "Saldo anterior 0",
    adicional17: "Cuotas pendientes 0",
    adicional18: "Predio 001-A",
    adicional19: "Barrio El Centro",
    adicional20: "Ciudad Medellin",
    fecha: "2024-01-15"
  },
  {
    id_factura: "002",
    tipo_id: "CC",
    numero_id: 52036741,
    nombre: "Ana Maria Torres",
    descripcion: "Servicio de energia electrica febrero 2024",
    numero_id_empresa: "EMP-00456",
    codigo_pago: "ENE-2024-002",
    valor: 45000,
    impuesto1: 8550,
    segundo_valor: 18000,
    segundo_impuesto: 3420,
    tercer_valor: 0,
    tercer_impuesto: 0,
    correo: "ana2payco@pruebas.com",
    telefono: "3209876543",
    adicional1: "Zona Sur",
    adicional2: "Estrato 4",
    adicional3: "Ciclo B",
    adicional4: "Ruta 07",
    adicional5: "Medidor 78901",
    adicional6: "Lectura anterior 3400",
    adicional7: "Lectura actual 3560",
    adicional8: "Consumo 160 kWh",
    adicional9: "Periodo FEB-2024",
    adicional10: "Vencimiento 2024-02-28",
    adicional11: "",
    adicional12: "Cargo fijo 12000",
    adicional13: "Cargo variable 33000",
    adicional14: "Descuento 0",
    adicional15: "Interes 0",
    adicional16: "Saldo anterior 0",
    adicional17: "",
    adicional18: "Predio 002-B",
    adicional19: "Barrio Las Palmas",
    adicional20: "Ciudad Bogota",
    fecha: "2024-02-01"
  },
  {
    id_factura: "003",
    tipo_id: "NIT",
    numero_id: 900123456,
    nombre: "Comercializadora El Progreso S.A.S",
    descripcion: "Pago arriendo bodega comercial marzo 2024",
    numero_id_empresa: "EMP-00789",
    codigo_pago: "ARR-2024-003",
    valor: 250000,
    impuesto1: 47500,
    segundo_valor: 0,
    segundo_impuesto: 0,
    tercer_valor: 0,
    tercer_impuesto: 0,
    correo: "progreso3payco@pruebas.com",
    telefono: "6014567890",
    adicional1: "Local 12",
    adicional2: "Piso 1",
    adicional3: "Centro Comercial Exito",
    adicional4: "Contrato 2022-0045",
    adicional5: "Area 80 m2",
    adicional6: "",
    adicional7: "",
    adicional8: "",
    adicional9: "Periodo MAR-2024",
    adicional10: "Vencimiento 2024-03-05",
    adicional11: "",
    adicional12: "",
    adicional13: "",
    adicional14: "Descuento 0",
    adicional15: "Interes mora 0",
    adicional16: "Saldo anterior 0",
    adicional17: "",
    adicional18: "",
    adicional19: "Barrio Industrial",
    adicional20: "Ciudad Cali",
    fecha: "2024-03-01"
  },
  {
    id_factura: "004",
    tipo_id: "CC",
    numero_id: 71589034,
    nombre: "Luis Fernando Ospina",
    descripcion: "Cuota mensual prestamo personal abril 2024",
    numero_id_empresa: "EMP-00321",
    codigo_pago: "PRES-2024-004",
    valor: 180000,
    impuesto1: 0,
    segundo_valor: 0,
    segundo_impuesto: 0,
    tercer_valor: 0,
    tercer_impuesto: 0,
    correo: "luis4payco@pruebas.com",
    telefono: "3154567890",
    adicional1: "Credito 00987654",
    adicional2: "Cuota 5 de 24",
    adicional3: "Capital 150000",
    adicional4: "Interes 30000",
    adicional5: "Seguro 0",
    adicional6: "",
    adicional7: "",
    adicional8: "",
    adicional9: "Periodo ABR-2024",
    adicional10: "Vencimiento 2024-04-10",
    adicional11: "",
    adicional12: "",
    adicional13: "",
    adicional14: "Descuento 0",
    adicional15: "Mora acumulada 0",
    adicional16: "Saldo capital 3400000",
    adicional17: "Cuotas pendientes 19",
    adicional18: "",
    adicional19: "Barrio Poblado",
    adicional20: "Ciudad Medellin",
    fecha: "2024-04-01"
  },
  {
    id_factura: "005",
    tipo_id: "CE",
    numero_id: 34567890,
    nombre: "Jorge Alberto Mendoza",
    descripcion: "Matricula semestre 2024-1 universidad",
    numero_id_empresa: "EMP-00654",
    codigo_pago: "MAT-2024-005",
    valor: 1200000,
    impuesto1: 0,
    segundo_valor: 0,
    segundo_impuesto: 0,
    tercer_valor: 0,
    tercer_impuesto: 0,
    correo: "jorge5payco@pruebas.com",
    telefono: "3112345678",
    adicional1: "Programa Ingenieria de Sistemas",
    adicional2: "Semestre 5",
    adicional3: "Creditos 18",
    adicional4: "Modalidad Presencial",
    adicional5: "Jornada Diurna",
    adicional6: "Sede Principal",
    adicional7: "",
    adicional8: "",
    adicional9: "Periodo 2024-1",
    adicional10: "Vencimiento 2024-01-20",
    adicional11: "Beca parcial 10%",
    adicional12: "Descuento 120000",
    adicional13: "Valor neto 1080000",
    adicional14: "Fondo beca 0",
    adicional15: "Deuda anterior 0",
    adicional16: "",
    adicional17: "",
    adicional18: "Codigo estudiante 20190045",
    adicional19: "Barrio Laureles",
    adicional20: "Ciudad Bogota",
    fecha: "2024-01-10"
  },
  {
    id_factura: "006",
    tipo_id: "CC",
    numero_id: 48901234,
    nombre: "Patricia Gutierrez Alvarez",
    descripcion: "Pago mensualidad colegio mayo 2024",
    numero_id_empresa: "EMP-00987",
    codigo_pago: "COL-2024-006",
    valor: 320000,
    impuesto1: 0,
    segundo_valor: 0,
    segundo_impuesto: 0,
    tercer_valor: 0,
    tercer_impuesto: 0,
    correo: "patricia6payco@pruebas.com",
    telefono: "3187654321",
    adicional1: "Alumno Santiago Mora",
    adicional2: "Grado 8B",
    adicional3: "Pension mayo",
    adicional4: "Transporte escolar incluido",
    adicional5: "Almuerzo incluido",
    adicional6: "",
    adicional7: "",
    adicional8: "",
    adicional9: "Periodo MAY-2024",
    adicional10: "Vencimiento 2024-05-05",
    adicional11: "",
    adicional12: "",
    adicional13: "",
    adicional14: "Descuento hermano 5%",
    adicional15: "Valor con descuento 304000",
    adicional16: "Deuda anterior 0",
    adicional17: "",
    adicional18: "Codigo alumno 20110078",
    adicional19: "Barrio Bello",
    adicional20: "Ciudad Barranquilla",
    fecha: "2024-05-01"
  },
  {
    id_factura: "007",
    tipo_id: "CC",
    numero_id: 63489012,
    nombre: "Ricardo Herrera Vega",
    descripcion: "Servicio internet y television cable junio 2024",
    numero_id_empresa: "EMP-01234",
    codigo_pago: "INT-2024-007",
    valor: 95000,
    impuesto1: 18050,
    segundo_valor: 0,
    segundo_impuesto: 0,
    tercer_valor: 0,
    tercer_impuesto: 0,
    correo: "ricardo7payco@pruebas.com",
    telefono: "3003456789",
    adicional1: "Plan Hogar Total",
    adicional2: "Internet 100 Mbps",
    adicional3: "TV 130 canales",
    adicional4: "Contrato 2023-00765",
    adicional5: "Nodo 34-B",
    adicional6: "",
    adicional7: "",
    adicional8: "",
    adicional9: "Periodo JUN-2024",
    adicional10: "Vencimiento 2024-06-15",
    adicional11: "",
    adicional12: "Cargo basico 77000",
    adicional13: "IVA 18050",
    adicional14: "Descuento 0",
    adicional15: "Mora 0",
    adicional16: "Saldo anterior 0",
    adicional17: "",
    adicional18: "Direccion Cra 50 #80-23",
    adicional19: "Barrio Estadio",
    adicional20: "Ciudad Pereira",
    fecha: "2024-06-01"
  },
  {
    id_factura: "008",
    tipo_id: "NIT",
    numero_id: 800654321,
    nombre: "Servicios Medicos Especialidad S.A.",
    descripcion: "Pago copago consulta especialista julio 2024",
    numero_id_empresa: "EMP-01567",
    codigo_pago: "SAL-2024-008",
    valor: 15200,
    impuesto1: 0,
    segundo_valor: 0,
    segundo_impuesto: 0,
    tercer_valor: 0,
    tercer_impuesto: 0,
    correo: "medicos8payco@pruebas.com",
    telefono: "6023456789",
    adicional1: "Paciente Carlos Rios",
    adicional2: "Especialidad Cardiologia",
    adicional3: "Medico Dr. Juan Pelaez",
    adicional4: "Cita 2024-07-22 10:00",
    adicional5: "Eps Sura",
    adicional6: "Nivel 2",
    adicional7: "",
    adicional8: "",
    adicional9: "Periodo JUL-2024",
    adicional10: "Vencimiento 2024-07-22",
    adicional11: "",
    adicional12: "",
    adicional13: "",
    adicional14: "Copago nivel 2",
    adicional15: "",
    adicional16: "",
    adicional17: "",
    adicional18: "Codigo autorización 88765",
    adicional19: "Sede Norte",
    adicional20: "Ciudad Cali",
    fecha: "2024-07-20"
  },
  {
    id_factura: "009",
    tipo_id: "CC",
    numero_id: 27890123,
    nombre: "Sandra Milena Castro",
    descripcion: "Impuesto predial predio urbano agosto 2024",
    numero_id_empresa: "EMP-01890",
    codigo_pago: "PRED-2024-009",
    valor: 430000,
    impuesto1: 0,
    segundo_valor: 0,
    segundo_impuesto: 0,
    tercer_valor: 0,
    tercer_impuesto: 0,
    correo: "sandra9payco@pruebas.com",
    telefono: "3159876543",
    adicional1: "Chip 10-01-0045678-0",
    adicional2: "Matricula inmobiliaria 050-0123456",
    adicional3: "Avaluo catastral 95000000",
    adicional4: "Tarifa 0.45%",
    adicional5: "Area construida 72 m2",
    adicional6: "Area terreno 100 m2",
    adicional7: "Uso residencial",
    adicional8: "Estrato 3",
    adicional9: "Periodo 2024",
    adicional10: "Vencimiento 2024-08-31",
    adicional11: "Descuento pronto pago 10%",
    adicional12: "Valor con descuento 387000",
    adicional13: "",
    adicional14: "Deuda anterior 0",
    adicional15: "Interes mora 0",
    adicional16: "",
    adicional17: "",
    adicional18: "Direccion Cl 12 #45-67",
    adicional19: "Barrio Chapinero",
    adicional20: "Ciudad Bogota",
    fecha: "2024-08-01"
  },
  {
    id_factura: "010",
    tipo_id: "CC",
    numero_id: 91234567,
    nombre: "Manuel Eduardo Suarez",
    descripcion: "Pago parqueadero mensual septiembre 2024",
    numero_id_empresa: "EMP-02100",
    codigo_pago: "PARK-2024-010",
    valor: 120000,
    impuesto1: 22800,
    segundo_valor: 0,
    segundo_impuesto: 0,
    tercer_valor: 0,
    tercer_impuesto: 0,
    correo: "manuel10payco@pruebas.com",
    telefono: "3178901234",
    adicional1: "Puesto 23",
    adicional2: "Torre A Sotano 1",
    adicional3: "Placa ABC-123",
    adicional4: "Tipo cubierto",
    adicional5: "Contrato 2023-0099",
    adicional6: "",
    adicional7: "",
    adicional8: "",
    adicional9: "Periodo SEP-2024",
    adicional10: "Vencimiento 2024-09-05",
    adicional11: "",
    adicional12: "Cargo mensual 97200",
    adicional13: "IVA 22800",
    adicional14: "Descuento 0",
    adicional15: "Mora 0",
    adicional16: "Saldo anterior 0",
    adicional17: "",
    adicional18: "Direccion Av 80 #20-10",
    adicional19: "Barrio Laureles",
    adicional20: "Ciudad Medellin",
    fecha: "2024-09-01"
  }
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const filterFacturas = (req) => {
  const idFactura = req.body?.id_factura || req.query?.id_factura;
  return idFactura ? facturas.filter((f) => f.id_factura === idFactura) : facturas;
};

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

// Respuesta: { facturas: [...] }
const handleListFacturas = (req, res) => {
  return res.status(200).json({ facturas: filterFacturas(req) });
};

// Respuesta: [...] (array directo) o { facturas: [...] } cuando filtra por id
const handleListFacturasArray = (req, res) => {
  const idFactura = req.body?.id_factura || req.query?.id_factura;
  if (idFactura) {
    return res.status(200).json({ facturas: facturas.filter((f) => f.id_factura === idFactura) });
  }
  return res.status(200).json(facturas);
};

// Respuesta: { facturacion: { data: [...] } }  ← objeto anidado
const handleListFacturasAnidado = (req, res) => {
  return res.status(200).json({ facturacion: { data: filterFacturas(req) } });
};

const handleConfirmacionPost = (req, res) => {
  const payload = req.body;
  console.log("[POST] Datos recibidos:", JSON.stringify(payload, null, 2));
  res.status(200).json({
    success: true,
    message: "Datos recibidos correctamente (POST)",
    data: payload,
  });
};

const handleConfirmacionGet = (req, res) => {
  const queryParams = req.query;
  console.log("[GET] Parametros recibidos:", queryParams);
  res.status(200).json({
    success: true,
    message: "Parametros recibidos correctamente (GET)",
    params: queryParams,
  });
};

// ===========================================================================
//  1. SIN SEGURIDAD
// ===========================================================================

app.post("/no-auth/list/facturas", handleListFacturas);
app.get("/no-auth/list/facturas", handleListFacturas);
app.post("/no-auth/list/facturas-array", handleListFacturasArray);
app.get("/no-auth/list/facturas-array", handleListFacturasArray);
app.post("/no-auth/list/facturas-anidado", handleListFacturasAnidado);
app.get("/no-auth/list/facturas-anidado", handleListFacturasAnidado);
app.post("/no-auth/confirmacion", handleConfirmacionPost);
app.get("/no-auth/confirmacion", handleConfirmacionGet);

// ===========================================================================
//  2. BASIC AUTH (usuario: testuser / password: testpass)
// ===========================================================================

app.get("/basic/login", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Use Basic Auth con usuario: testuser / password: testpass",
    token: Buffer.from("testuser:testpass").toString("base64"),
  });
});

app.post("/basic/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === "testuser" && password === "testpass") {
    return res.status(200).json({
      success: true,
      token: Buffer.from(`${username}:${password}`).toString("base64"),
    });
  }
  return res.status(401).json({ success: false, message: "Credenciales invalidas" });
});

app.post("/basic/list/facturas", basicAuth, handleListFacturas);
app.get("/basic/list/facturas", basicAuth, handleListFacturas);
app.post("/basic/list/facturas-array", basicAuth, handleListFacturasArray);
app.get("/basic/list/facturas-array", basicAuth, handleListFacturasArray);
app.post("/basic/list/facturas-anidado", basicAuth, handleListFacturasAnidado);
app.get("/basic/list/facturas-anidado", basicAuth, handleListFacturasAnidado);
app.post("/basic/confirmacion", basicAuth, handleConfirmacionPost);
app.get("/basic/confirmacion", basicAuth, handleConfirmacionGet);

// ===========================================================================
//  3. JWT (Bearer Token)
// ===========================================================================

app.get("/jwt/login", generateBearerToken, (req, res) => {
  res.status(200).json({ success: true, token: req.bearerToken });
});

app.post("/jwt/login", generateBearerToken, (req, res) => {
  res.status(200).json({ success: true, token: req.bearerToken });
});

app.post("/jwt/list/facturas", verifyBearerToken, handleListFacturas);
app.get("/jwt/list/facturas", verifyBearerToken, handleListFacturas);
app.post("/jwt/list/facturas-array", verifyBearerToken, handleListFacturasArray);
app.get("/jwt/list/facturas-array", verifyBearerToken, handleListFacturasArray);
app.post("/jwt/list/facturas-anidado", verifyBearerToken, handleListFacturasAnidado);
app.get("/jwt/list/facturas-anidado", verifyBearerToken, handleListFacturasAnidado);
app.post("/jwt/confirmacion", verifyBearerToken, handleConfirmacionPost);
app.get("/jwt/confirmacion", verifyBearerToken, handleConfirmacionGet);

// ===========================================================================
//  ENDPOINT DE INFORMACION
// ===========================================================================

app.get("/", (req, res) => {
  res.status(200).json({
    service: "API Mock - Pruebas ePayco",
    nota: "Todos los endpoints admiten ?id_factura=001 (GET) o body {id_factura:'001'} (POST) para filtrar",
    estructura_respuesta: {
      "facturas":         "{ facturas: [...] }",
      "facturas-array":   "[...] (array directo)",
      "facturas-anidado": "{ facturacion: { data: [...] } }",
    },
    endpoints: {
      sin_seguridad: {
        descripcion: "Sin autenticacion",
        consulta_post: "/no-auth/list/facturas",
        consulta_get: "/no-auth/list/facturas?id_factura=001",
        consulta_array_post: "/no-auth/list/facturas-array",
        consulta_array_get: "/no-auth/list/facturas-array?id_factura=001",
        consulta_anidado_post: "/no-auth/list/facturas-anidado",
        consulta_anidado_get: "/no-auth/list/facturas-anidado?id_factura=001",
        confirmacion_post: "/no-auth/confirmacion",
        confirmacion_get: "/no-auth/confirmacion?param1=valor1",
      },
      basic_auth: {
        descripcion: "Basic Auth (usuario: testuser / password: testpass)",
        login_get: "/basic/login",
        login_post: "/basic/login (body: {username, password})",
        consulta_post: "/basic/list/facturas",
        consulta_get: "/basic/list/facturas?id_factura=001",
        consulta_array_post: "/basic/list/facturas-array",
        consulta_array_get: "/basic/list/facturas-array?id_factura=001",
        consulta_anidado_post: "/basic/list/facturas-anidado",
        consulta_anidado_get: "/basic/list/facturas-anidado?id_factura=001",
        confirmacion_post: "/basic/confirmacion",
        confirmacion_get: "/basic/confirmacion?param1=valor1",
      },
      jwt: {
        descripcion: "JWT Bearer Token",
        login_get: "/jwt/login",
        login_post: "/jwt/login",
        variable_token: "token",
        consulta_post: "/jwt/list/facturas",
        consulta_get: "/jwt/list/facturas?id_factura=001",
        consulta_array_post: "/jwt/list/facturas-array",
        consulta_array_get: "/jwt/list/facturas-array?id_factura=001",
        consulta_anidado_post: "/jwt/list/facturas-anidado",
        consulta_anidado_get: "/jwt/list/facturas-anidado?id_factura=001",
        confirmacion_post: "/jwt/confirmacion",
        confirmacion_get: "/jwt/confirmacion?param1=valor1",
      },
    },
  });
});

// ===========================================================================
//  INICIAR SERVIDOR
// ===========================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("=".repeat(55));
  console.log("  API Mock - Pruebas de Confirmacion ePayco");
  console.log("=".repeat(55));
  console.log(`\n  Server: http://localhost:${PORT}`);
  console.log("  Modos:  sin-auth, Basic Auth, JWT");
  console.log(`\n  Ver endpoints: GET http://localhost:${PORT}/`);
  console.log("\n" + "=".repeat(55) + "\n");
});
