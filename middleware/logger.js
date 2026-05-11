const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.ip || req.socket?.remoteAddress || "unknown";
};

const pad = (n) => String(n).padStart(2, "0");

const timestamp = () => {
  const d = new Date();
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
};

const ipLogger = (req, res, next) => {
  const start = Date.now();
  const ip = getClientIp(req);

  res.on("finish", () => {
    const ms = Date.now() - start;
    const line = `[${timestamp()}] ip=${ip} ${req.method} ${req.originalUrl} status=${res.statusCode} ${ms}ms ua="${req.headers["user-agent"] || "-"}"`;
    console.log(line);
  });

  next();
};

module.exports = { ipLogger };
