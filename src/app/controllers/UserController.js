import * as Yup from "yup";

import User from "../models/User";

class UserController {
  async index(request, response) {
    const users = await User.findAll();
    return response.json(users);
  }

  async show(request, response) {
    const user = await User.findByPk(request.params.id);
    return response.json(user);
  }

  async store(request, response) {
    const schema = Yup.object()
      .shape({
        username: Yup.string().max(45).required(),
        email: Yup.string().max(100).email().lowercase().trim().required(),
        password: Yup.string().required().min(4),
      })
      .noUnknown();

    try {
      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (await User.findOne({ where: { email: request.body.email } })) {
        return response.status(409).json({ error: "Email já cadstrado" });
      }

      const user = await User.create(validFields);

      return response.json(user);
    } catch (error) {
      response.status(400).json({ error });
    }
  }

  async update(request, response) {
    const schema = Yup.object()
      .shape({
        username: Yup.string().max(45),
        email: Yup.string().max(100).email().lowercase().trim(),
        password: Yup.string().min(4),
      })
      .noUnknown();

    try {
      const user = await User.findByPk(request.params.id);

      if (!user) {
        return response.status(400).json({ error: "Usuário não existe" });
      }
      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      await user.update({ ...validFields });

      return response.json(user);
    } catch (error) {
      response.status(400).json({ error });
    }
  }
}

export default new UserController();
