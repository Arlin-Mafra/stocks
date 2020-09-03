import * as Yup from "yup";
import Client from "../models/Client";

class ClientController {
  async index(request, response) {
    const clients = await Client.findAll();
    return response.json(clients);
  }

  async show(request, response) {
    const client = await Client.findByPk(request.params.id);

    if (!client) {
      return response.status(400).json({ error: "Cliente não encontrado!" });
    }

    return response.json(client);
  }

  async store(request, response) {
    const schema = Yup.object()
      .shape({
        name: Yup.string().max(45).required(),
        cpf: Yup.string().max(14).required(),
        phone: Yup.string().required(),
      })
      .noUnknown();

    try {
      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (await Client.findOne({ where: { cpf: request.body.cpf } })) {
        return response.status(409).json({ error: "CPF já cadstrado" });
      }

      const client = await Client.create(validFields);

      return response.json(client);
    } catch (error) {
      response.status(400).json({ error });
    }
  }

  async update(request, response) {
    const schema = Yup.object()
      .shape({
        name: Yup.string().max(45),
        cpf: Yup.string().max(14),
        phone: Yup.string(),
      })
      .noUnknown();

    try {
      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const client = await Client.findByPk(request.params.id);

      if (!client) {
        response.status(400).json({ error: "Cliente não localizado" });
      }

      await client.update(validFields);

      return response.json(client);
    } catch (error) {
      response.status(400).json({ error });
    }
  }
}

export default new ClientController();
