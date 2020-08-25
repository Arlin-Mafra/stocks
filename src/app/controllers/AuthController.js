import * as Yup from "yup";
import { sign } from "jsonwebtoken";

import authConfig from "../../config/auth";
import User from "../models/User";

class AuthController {
  async store(request, response) {
    let schema = Yup.object().shape({
      username: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.json({
        error: "Preencha todos os campos",
      });
    }

    const { username, password } = request.body;

    const user = await User.findOne({ where: { username } });

    if (!user) {
      response.status(400).json({ error: "Usuário não encontrado!" });
    }

    if (!(await user.checkPassword(password))) {
      return response.status(401).json({ error: "Senha incorreta!" });
    }

    const { id, email } = user;

    return response.json({
      user: {
        id,
        username,
        email,
      },
      token: sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new AuthController();
