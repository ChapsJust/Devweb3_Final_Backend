import StockRepo from '@src/repos/StockRepo';
import { IStock } from '@src/models/Stock';

/******************************************************************************
                                Constants
******************************************************************************/

export const STOCK_NOT_FOUND_ERR = 'Stock not found';

/******************************************************************************
                                Functions
******************************************************************************/

function getAll(): Promise<IStock[]> {
  return StockRepo.getAll();
}

function getByName(fullName: string): Promise<IStock[]> {
  return StockRepo.getByName(fullName);
}

function getOneID(id: string): Promise<IStock | null> {
  return StockRepo.getOneID(id);
}

function getByShortName(shortName: string): Promise<IStock[]> {
  return StockRepo.getByShortName(shortName);
}

function getByUnitPrice(price: number): Promise<IStock[]> {
  return StockRepo.getByUnitPrice(price);
}

function addOne(stock: IStock): Promise<IStock> {
  return StockRepo.add(stock);
}

function updateOne(stock: IStock): Promise<void> {
  return StockRepo.update(stock);
}

function _delete(id: string): Promise<void> {
  return StockRepo.delete(id);
}

/******************************************************************************
                                Export default
******************************************************************************/
export default {
  getAll,
  getByName,
  getOneID,
  addOne,
  getByShortName,
  getByUnitPrice,
  updateOne,
  delete: _delete,
} as const;
