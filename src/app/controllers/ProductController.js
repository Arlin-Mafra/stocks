import * as Yup from "yup";

import Product from "../models/Product";
import Category from "../models/Category";

class ProductController {
  async index(request, response) {
    const products = await Product.findAll({
      include: [
        {
          association: "categories",
          attributes: ["description"],
        },
        {
          association: "attachments",
          attributes: ["id", "url", "name", "file"],
        },
      ],
    });

    return response.json(products);
  }

  async show(request, response) {
    const product = await Product.findByPk(request.params.id, {
      include: [
        {
          association: "attachments",
        },
        {
          association: "categories",
        },
      ],
    });

    if (!product) {
      response.status(400).json({ error: "Produto não encontrado" });
    }
    return response.json(product);
  }

  async store(request, response) {
    const schema = Yup.object()
      .shape({
        name: Yup.string().max(45).required(),
        amount: Yup.number().required(),
        attachment_id: Yup.number(),
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
    const schema = Yup.object()
      .shape({
        name: Yup.string().max(45),
        amount: Yup.number(),
        attachment_id: Yup.number(),
      })
      .noUnknown();

    try {
      const product = await Product.findByPk(request.params.id);

      if (!product) {
        response.status(400).json({ error: "Produto não encontrado" });
      }

      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      await product.update({ ...validFields });

      return response.json(product);
    } catch (error) {
      response.status(400).json({ error });
    }
  }
}

export default new ProductController();
