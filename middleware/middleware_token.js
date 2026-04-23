const jwt = require('jsonwebtoken');

// Clave secreta para firmar los tokens (cambiar en producción)
const SECRET_KEY = 'tu_clave_secreta_super_segura';

/**
 * Middleware para crear y asignar un bearer token
 * Genera un JWT y lo asigna al objeto req para uso posterior
 */
const generateBearerToken = (req, res, next) => {
  try {
    // Datos a incluir en el token
    const payload = {
      timestamp: new Date().getTime(),
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    // Generar el token con expiración de 1 hora
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    // Asignar el token al objeto request
    req.bearerToken = token;

    // Pasar al siguiente middleware
    next();
  } catch (error) {
    console.error('Error generando bearer token:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al generar el token' 
    });
  }
};

/**
 * Middleware para verificar un bearer token
 * Valida que el token sea válido y no haya expirado
 */
const verifyBearerToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token no proporcionado' 
      });
    }

    // Extraer el token del formato "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Formato de token inválido. Use: Bearer <token>' 
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Asignar los datos decodificados al objeto request
    req.tokenData = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expirado' 
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Error verificando el token' 
    });
  }
};

module.exports = {
  generateBearerToken,
  verifyBearerToken,
  SECRET_KEY
};
