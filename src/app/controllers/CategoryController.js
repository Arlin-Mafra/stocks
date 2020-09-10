import * as Yup from "yup";

import Category from "../models/Category";

class CategoryController {
  async index(request, response) {
    const cotegories = await Category.findAll();

    return response.json(cotegories);
  }

  async show(request, response) {
    const category = await Category.findByPk(request.params.id);

    if (!category) {
      response.status(400).json({ erro: "Categoria não encontrada!" });
    }
    return response.json(category);
  }

  async store(request, response) {
    const schema = Yup.object()
      .shape({
        description: Yup.string().max(45).required(),
      })
      .noUnknown();

    try {
      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const category = await Category.create(validFields);

      return response.json(category);
    } catch (error) {
      response.status(400).json({ error });
    }
  }

  async update(request, response) {
    const schema = Yup.object()
      .shape({
        description: Yup.string().max(45),
      })
      .noUnknown();

    try {
      const category = await Category.findByPk(request.params.id);

      if (!category) {
        response.status(400).json({ error: "Categoria não encontrada" });
      }

      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      await category.update({ ...validFields });

      return response.json(category);
    } catch (error) {
      response.status(400).json({ error: "Não foi possivel atualizar" });
    }
  }

  async delete(request, response) {
    const categoty = await Category.findByPk(request.params.id);

    if (!categoty) {
      response.status(400).json({ error: "Categoria não encontrada!" });
    }

    await categoty.destroy();
    return response.json({ message: "Categoria deletada!" });
  }
}

export default new CategoryController();
