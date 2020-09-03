import * as Yup from "yup";

import Sale from "../models/Sale";
import Product from "../models/Product";

class SaleController {
  async index(request, response) {
    const sales = await Sale.findAll({
      include: [
        {
          association: "user",
          attributes: ["id", "username", "email"],
        },
        {
          association: "product",
          attributes: ["id", "name", "amount", "attachment_id", "category_id"],
        },
        {
          association: "client",
          attributes: ["id", "name", "cpf", "phone"],
        },
      ],
    });
    return response.json(sales);
  }

  async show(request, response) {
    const sale = await Sale.findByPk(request.params.id, {
      include: [
        {
          association: "user",
          attributes: ["id", "username", "email"],
        },
        {
          association: "product",
          attributes: ["id", "name", "amount", "attachment_id", "category_id"],
        },
        {
          association: "client",
          attributes: ["id", "name", "cpf", "phone"],
        },
      ],
    });

    if (!sale) {
      response.status(400).json({ error: "Compra não localizada" });
    }
    return response.json(sale);
  }

  async store(request, response) {
    const schema = Yup.object()
      .shape({
        description: Yup.string().max(100),
        amount: Yup.number().required(),
        product_id: Yup.number().required(),
        client_id: Yup.number().required(),
      })
      .noUnknown();

    try {
      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const product = await Product.findOne({
        where: { id: request.body.product_id },
      });

      if (product.amount <= 0 || product.amount < validFields.amount) {
        return response
          .status(400)
          .json({ error: "Verifique a quantidade indisponível!" });
      }

      await product.update({
        amount: product.amount - validFields.amount,
      });

      const sale = await Sale.create({
        ...validFields,
        user_id: request.userId,
      });

      return response.json(sale);
    } catch (error) {
      response.status(400).json({ error });
    }
  }

  async update(request, response) {
    const schema = Yup.object()
      .shape({
        description: Yup.string().max(100),
        amount: Yup.number(),
        product_id: Yup.number(),
        client_id: Yup.number(),
      })
      .noUnknown();

    try {
      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const product = await Product.findOne({
        where: { id: request.body.product_id },
      });

      if (product.amount <= 0 || product.amount < validFields.amount) {
        return response
          .status(400)
          .json({ error: "Verifique a quantidade indisponível!" });
      }

      await product.update({
        amount: product.amount - validFields.amount,
      });

      const sale = await Sale.findByPk(request.params.id);

      if (!sale) {
        return response.status(400).json({ error: "Compra não localizada" });
      }

      await sale.update({
        ...validFields,
      });

      return response.json(sale);
    } catch (error) {
      response.status(400).json({ error });
    }
  }

  async delete(request, response) {
    const sale = await Sale.findByPk(request.params.id);

    if (!sale) {
      return response.status(400).json({ error: "Compra não localizada!" });
    }

    await sale.destroy();

    const product = await Product.findOne({ where: { id: sale.product_id } });

    await product.update({
      amount: product.amount + sale.amount,
    });

    return response.status(400).json({ error: "Compra excluída!" });
  }
}

export default new SaleController();
