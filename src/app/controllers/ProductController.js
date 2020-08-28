import * as Yup from "yup";

import Product from "../models/Product";
import Category from "../models/Category";

class ProductController {
  async index(request, response) {
    const products = await Product.findAll({
      include: [
        {
          association: "categories",
        },
      ],
    });

    return response.json(products);
  }

  async show(request, response) {
    const product = await Product.findByPk(request.params.id);

    if (product) {
      response.status(400).json({ error: "Produto não encontrado" });
    }
    return response.json(product);
  }

  async store(request, response) {
    const schema = Yup.object()
      .shape({
        name: Yup.string().max(45).required(),
        amount: Yup.number().required(),
      })
      .noUnknown();

    try {
      const { category_id } = request.params;

      const category = await Category.findByPk(category_id);

      if (!category) {
        response.status(400).json({ error: "Categoria não encontrada" });
      }

      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const product = await Product.create({ ...validFields, category_id });

      return response.json(product);
    } catch (error) {
      response.status(400).json({ error });
    }
  }

  async update(request, response) {
    return response.json({});
  }

  async delete(request, response) {
    return response.json({});
  }
}

export default new ProductController();
