const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const prisma = new PrismaClient();

const app = express();
app.use(cors()); // Adicionando middleware CORS para permitir requisições do frontend
app.use(express.json()); // Habilitar o Express a lidar com JSON nas requisições

// Rota para listar produtos
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);  // Log detalhado do erro
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

// Adicionando um produto
app.post("/products", async (req, res) => {
  const { name, description, price, quantity, supplierId } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
        supplier: {
          connect: { id: supplierId } // Aqui estamos conectando ao fornecedor pelo ID
        }
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    res.status(500).json({ message: "Erro ao adicionar produto." });
  }
});



// Rota para deletar produto
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.send("Produto deletado com sucesso");
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ error: "Erro ao deletar produto." });
  }
});

// Rota para atualizar produto
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, supplierId } = req.body;

  try {
    // Verificando se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    // Atualizando o produto
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price,
        quantity,
        supplier: supplierId ? { connect: { id: supplierId } } : undefined,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
});


// Rota para listar fornecedores
app.get("/suppliers", async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.json(suppliers);
  } catch (error) {
    console.error("Erro ao buscar fornecedores:", error);
    res.status(500).json({ error: "Erro ao buscar fornecedores." });
  }
});

// Rota para adicionar fornecedor
app.post("/suppliers", async (req, res) => {
  const { name, cnpj, email, phone } = req.body;
  try {
    if (!name || !cnpj || !email || !phone) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const newSupplier = await prisma.supplier.create({
      data: { name, cnpj, email, phone },
    });
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error("Erro ao adicionar fornecedor:", error);
    res.status(500).json({ error: error.message || "Erro ao adicionar fornecedor." });
  }
});

// Rota para deletar fornecedor
app.delete("/suppliers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.supplier.delete({
      where: { id: parseInt(id) },
    });
    res.send("Fornecedor deletado com sucesso");
  } catch (error) {
    console.error("Erro ao deletar fornecedor:", error);
    res.status(500).json({ error: "Erro ao deletar fornecedor." });
  }
});

// Rota para atualizar fornecedor
app.put("/suppliers/:id", async (req, res) => {
  const { id } = req.params;
  const { name, cnpj, email, phone } = req.body;

  try {
    // Verificando se o fornecedor existe
    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(id) },
    });

    if (!supplier) {
      return res.status(404).json({ error: "Fornecedor não encontrado." });
    }

    // Atualizando o fornecedor
    const updatedSupplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: {
        name,
        cnpj,
        email,
        phone,
      },
    });

    res.json(updatedSupplier);
  } catch (error) {
    console.error("Erro ao atualizar fornecedor:", error);
    res.status(500).json({ error: "Erro ao atualizar fornecedor." });
  }
});

// Rota para buscar todos os produtos com fornecedor
app.get("/history", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        supplier: true, // Incluir os dados do fornecedor
      },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar histórico de produtos:", error);
    res.status(500).json({ message: "Erro ao buscar histórico de produtos." });
  }
});



// Rodando o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
