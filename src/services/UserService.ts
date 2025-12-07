import UserRepo from "@src/repos/UserRepo";
import { IUser } from "@src/models/User";
import { brotliCompress } from "zlib";
import jwt from "jsonwebtoken";
import ENV from "@src/common/constants/ENV";
import bcrypt from "bcrypt";
import StockRepo from "@src/repos/StockRepo";
import { IStock } from "@src/models/Stock";
import { I } from "vitest/dist/chunks/reporters.d.OXEK7y4s";

/******************************************************************************
                                Constants
******************************************************************************/

export const USER_NOT_FOUND_ERR = "User not found";

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Retourne tous les utilisateurs.
 *
 * @returns IUser
 */
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

/**
 * Retourne un utilisateur par son id.
 *
 * @param id
 * @returns IUser | null
 */
function getUserById(id: string): Promise<IUser | null> {
  return UserRepo.getUserById(id);
}

/**
 * Ajoute un utilisateur.
 *
 * @param user
 * @returns Retourne le user créé
 */
function addOne(user: IUser): Promise<IUser | null> {
  return UserRepo.addUser(user);
}

/**
 * Met a jour un utilisateur.
 *
 * @param user
 * @returns Retourne le user modifié
 */
function updateOne(user: IUser): Promise<IUser | null> {
  return UserRepo.updateUser(user);
}

/**
 * Efface un utilisateur par son id.
 *
 * @param id
 */
function _delete(id: string): Promise<void> {
  return UserRepo.deleteUser(id);
}

async function buyStock(userId: string, stockId: string, quantity: number): Promise<IUser> {
  try {
    const user = await UserRepo.getUserById(userId);

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const stock = await StockRepo.getOneID(stockId);

    if (!stock) {
      throw new Error("Stock non trouvé");
    }

    if (!stock.isAvailable) {
      throw new Error("Stock non disponible");
    }

    if (stock.quantity < quantity) {
      throw new Error(`Quantité insuffisante. Disponible: ${stock.quantity}`);
    }

    const userStocks = user.stocks || [];
    const existingStockIndex = userStocks.findIndex((s) => s._id === stockId);

    if (existingStockIndex >= 0) {
      userStocks[existingStockIndex] = {
        ...userStocks[existingStockIndex],
        quantity: userStocks[existingStockIndex].quantity + quantity,
      };
    } else {
      userStocks.push({
        _id: stock._id?.toString() || stock._id,
        stockName: stock.stockName,
        stockShortName: stock.stockShortName,
        quantity: quantity,
        unitPrice: stock.unitPrice,
        isAvailable: stock.isAvailable,
        tags: stock.tags,
        buyAt: new Date(),
        lastUpdatedAt: stock.lastUpdatedAt,
      } as IStock);
    }

    // Mettre à jour le stock
    const newStockQuantity = stock.quantity - quantity;
    stock.quantity = newStockQuantity;
    stock.lastUpdatedAt = new Date();

    await StockRepo.update(stock);

    const updatedUser: IUser = {
      ...user,
      stocks: userStocks,
    };

    const result = await UserRepo.updateUser(updatedUser);

    return result;
  } catch (error) {
    throw error;
  }
}

// SourceChatGPT : Promise<Omit<IUser, "password">>
async function login(email: string, password: string) {
  const user = await UserRepo.getByEmail(email);

  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const token = jwt.sign({ userId: user._id, email: user.email }, ENV.Jwtsecret, { expiresIn: "7d" });

  // Retourner token ET user (cookie)
  return { token, user: { _id: user._id, name: user.name, email: user.email, stocks: user.stocks } };
}

// SourceChatGPT : Promise<Omit<IUser, "password">>
async function register(userData: IUser): Promise<Omit<IUser, "password">> {
  const existingUser = await UserRepo.getByEmail(userData.email);

  if (existingUser) {
    throw new Error("Cet email est déjà utilisé");
  }

  //HASH MOT DE PASSE
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  //Ajouter le mot de passe hashé à l'utilisateur
  const newUser: IUser = {
    ...userData,
    password: hashedPassword,
  };

  await UserRepo.addUser(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  getUserById,
  addOne,
  updateOne,
  delete: _delete,
  buyStock,
  login,
  register,
} as const;
