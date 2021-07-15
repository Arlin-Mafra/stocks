import * as Yup from "yup";
import Product from "../models/Product";


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
        category_id:Yup.number(),
        attachment_id: Yup.number(),
      })
      .noUnknown();

    try {


      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });


      const product = await Product.create({ ...validFields });

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
        category_id:Yup.number(),
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

  async delete(request,response){
    const product = await Product.findByPk(request.params.id);
    if (!product) {
      response.status(400).json({ error: "Produto não encontrado" });
    }

    await product.destroy()

  }
}

export default new ProductController();
