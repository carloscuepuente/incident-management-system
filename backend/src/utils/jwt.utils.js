import jwt from "jsonwebtoken";

class JwtUtils {
  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error("Token inválido o expirado");
    }
  }

  // Solo para pruebas y desarrollo, hay que eliminarlo en produccion
  // flag: no usar en produccion
  decodeToken(token) {
    return jwt.decode(token);
  }
}

export default new JwtUtils();
