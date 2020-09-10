import jwt from "jsonwebtoken";
import { promisify } from "util";
import authConfig from "../../config/auth";

export default async (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization) {
    response.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authorization.split(" ");
  try {
    const { id } = await promisify(jwt.verify)(token, authConfig.secret);

    // console.log(tokendecoded);
    request.userId = id;
  } catch (error) {
    return response.status(401).json({
      error: "Token inválido",
    });
  }
  return next();
};
