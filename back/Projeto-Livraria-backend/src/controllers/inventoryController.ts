import { Request, Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import * as inventoryService from "../services/inventoryService";

export const addBook = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const bookData = req.body;
    // Validação básica (opcional, mas recomendado)
    if (
      !bookData ||
      !bookData.googleBookId ||
      !bookData.title ||
      !bookData.author ||
      !bookData.imageUrl ||
      !bookData.condition ||
      bookData.tradeValue == null
    ) {
      console.error(
        "[inventoryController:addBook] Dados incompletos recebidos:",
        bookData
      ); // Log dos dados recebidos
      return res
        .status(400)
        .json({ message: "Dados incompletos para adicionar o livro." });
    }
    const result = await inventoryService.addBookToInventory(userId, bookData);
    return res.status(201).json(result);
  } catch (error: any) {
    // --- CORREÇÃO: Adicionado console.error ---
    console.error(
      "[inventoryController:addBook] Erro ao adicionar livro:",
      error
    );
    return res
      .status(500)
      .json({ message: error.message || "Erro interno ao adicionar livro." });
  }
};

export const getRecent = async (req: Request, res: Response) => {
  try {
    const books = await inventoryService.getRecentBooks();
    return res.status(200).json(books);
  } catch (error: any) {
    // --- CORREÇÃO: Adicionado console.error ---
    console.error(
      "[inventoryController:getRecent] Erro ao buscar recentes:",
      error
    );
    return res
      .status(500)
      .json({ message: error.message || "Erro interno ao buscar recentes." });
  }
};

export const getMyInventory = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const books = await inventoryService.getBooksByUserId(userId);
    return res.status(200).json(books);
  } catch (error: any) {
    // --- CORREÇÃO: Adicionado console.error ---
    console.error(
      "[inventoryController:getMyInventory] Erro ao buscar minha estante:",
      error
    );
    return res
      .status(500)
      .json({ message: error.message || "Erro interno ao buscar estante." });
  }
};

export const deleteBook = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const inventoryId = parseInt(req.params.id, 10);

    if (isNaN(inventoryId)) {
      return res.status(400).json({ message: "ID do item inválido." });
    }

    const result = await inventoryService.deleteBookFromInventory(
      userId,
      inventoryId
    );
    return res.status(200).json(result);
  } catch (error: any) {
    // --- CORREÇÃO: Adicionado console.error ---
    console.error(
      "[inventoryController:deleteBook] Erro ao deletar livro:",
      error
    );
    // Ajusta o status code dependendo do erro do service
    return res
      .status(error.message.includes("não encontrado") ? 404 : 500)
      .json({ message: error.message });
  }
};

export const getPublicInventoryByUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID de usuário inválido." });
    }
    const books = await inventoryService.getBooksByUserId(userId);
    return res.status(200).json(books);
  } catch (error: any) {
    // --- CORREÇÃO: Adicionado console.error ---
    console.error(
      "[inventoryController:getPublicInventoryByUser] Erro ao buscar inventário público:",
      error
    );
    return res
      .status(500)
      .json({
        message: error.message || "Erro interno ao buscar inventário público.",
      });
  }
};
