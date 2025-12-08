import { IStock, Stocks } from "@src/models/Stock";
import { ObjectId } from "mongodb";

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Extraire tous les holdings
 */
async function getAll(): Promise<IStock[]> {
  const stocks = await Stocks.find({});
  return stocks;
}

/**
 * Extraire tous les holdings, filtré par nom
 */
async function getByName(fullName: string): Promise<IStock[]> {
  const stocks = await Stocks.find({
    fullName: fullName,
  });
  return stocks;
}

async function getByShortName(shortName: string): Promise<IStock[]> {
  const stocks = await Stocks.find({
    stockShortName: shortName,
  });
  return stocks;
}

async function getByUnitPrice(price: number): Promise<IStock[]> {
  const stocks = await Stocks.find({
    unitPrice: price,
  });
  return stocks;
}

async function getOneID(id: string): Promise<IStock | null> {
  const stock = await Stocks.findOne({ _id: id });
  return stock;
}

/**
 * Ajouter un holding
 */
async function add(stock: IStock): Promise<IStock> {
  const newStock = new Stocks(stock);
  await newStock.save();
  return newStock;
}

/**
 * Mettre à jour un holding
 */
async function update(stock: IStock): Promise<IStock> {
  const stockAModifier = await Stocks.findById(stock._id);

  if (stockAModifier === null) {
    throw new Error("Stock non trouvé");
  }

  stockAModifier.quantity = stock.quantity;
  stockAModifier.unitPrice = stock.unitPrice;
  stockAModifier.isAvailable = stock.isAvailable;
  stockAModifier.tags = stock.tags;
  stockAModifier.buyAt = stock.buyAt;
  stockAModifier.lastUpdatedAt = stock.lastUpdatedAt;

  await stockAModifier.save();
  return stockAModifier;
}

/**
 * Supprimer tous les holdings avec un ID spécifique
 */
async function deleteAStock(id: string): Promise<void> {
  await Stocks.deleteOne({ _id: id });
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  getByName,
  getOneID,
  getByShortName,
  getByUnitPrice,
  add,
  update,
  delete: deleteAStock,
} as const;
