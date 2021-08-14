import * as Yup from "yup";

import Sale from "../models/Sale";
import Product from "../models/Product";
import ItemSale from "../models/ItemSale";

class SaleController {
  async index(request, response) {
    const sales = await Sale.findAll({
      include: [
        {
          association: "user",
          attributes: ["id", "username", "email"],
        },
        {
          association: "item_sale",
          include:[{
            association:"product",
            attributes:['id','name']
          }]
        } ,    
        {
          association: "client",
          attributes: ["id", "name", "cpf", "phone"],
        }
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
          association: "item_sales",
          attributes: ["amount",'product_id'],
          include:[{
            include:[{
              association:"product",
              attributes:['id','name']
            }]
          }]
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
          item_sale: Yup.array()
          .of(
            Yup.object().shape({
              amount: Yup.number().required(),
              product_id: Yup.number().required(),
            })
          )
          .min(1)
          .required(),
        client_id: Yup.number().required(),
      })
      .noUnknown();

    try {
      const validFields = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const sale = await Sale.create(
        {
          ...validFields,
          user_id: request.userId,
        },
        {
          include: [
            {
              association: "item_sale",
            },
          ],
        }
      );

      //update stock
      validFields.item_sale.map(async (item, index) => {
        const product = await Product.findByPk(item.product_id);
        product.update({ amount: product.amount - item.amount });
      });

      return response.json(sale);
    } catch (error) {
      console.log(error);
      response.status(400).json({ error });
    }
  }

  async delete(request, response) {
    const sale = await Sale.findByPk(request.params.id);

    if (!sale) {
      return response.status(400).json({ error: "Compra não localizada!" });
    }

    const itensSale = await ItemSale.findAll({
      where: { sale_id: request.params.id },
    });

    itensSale.map(async (item) => {
      const product = await Product.findByPk(item.product_id);
      product.update({ amount: product.amount + item.amount });
    });

    await sale.destroy();

    return response.status(400).json({ error: "Compra excluída!" });
  }
}

export default new SaleController();
