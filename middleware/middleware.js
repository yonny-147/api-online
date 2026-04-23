const basicAuth = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Restricted"');
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Basic') {
    res.setHeader('WWW-Authenticate', 'Basic realm="Restricted"');
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const creds = Buffer.from(parts[1], 'base64').toString('ascii');
  const sep = creds.indexOf(':');
  if (sep === -1) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Restricted"');
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const username = creds.slice(0, sep);
  const password = creds.slice(sep + 1);

  const validUser = 'testuser';
  const validPass = 'testpass';

  if (username !== validUser || password !== validPass) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Restricted"');
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  next();
}

module.exports = {
  basicAuth
};