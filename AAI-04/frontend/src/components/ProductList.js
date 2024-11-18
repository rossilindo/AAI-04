import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    supplierId: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  // Buscar produtos
  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos:", error);
      });
  }, []);

  // Buscar fornecedores
  useEffect(() => {
    axios
      .get("http://localhost:5000/suppliers")
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar fornecedores:", error);
      });
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  const displayedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  // Função para deletar um produto
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/products/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => {
        console.error("Erro ao deletar produto:", error);
      });
  };

  // Função para editar um produto
  const handleEditProduct = (id) => {
    const productToEdit = products.find((product) => product.id === id);
    setNewProduct({
      id: productToEdit.id,
      name: productToEdit.name,
      description: productToEdit.description,
      price: productToEdit.price,
      quantity: productToEdit.quantity,
      supplierId: productToEdit.supplierId,
    });
  };

  // Função para atualizar o estado dos inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Função para adicionar ou atualizar um produto
  const handleAddOrUpdateProduct = (e) => {
    e.preventDefault();
    const { name, description, price, quantity, supplierId, id } = newProduct;

    if (!name || !description || !price || !quantity || !supplierId) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    if (id) {
      // Atualizar produto
      axios
        .put(`http://localhost:5000/products/${id}`, {
          name,
          description,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          supplierId: parseInt(supplierId),
        })
        .then((response) => {
          setProducts(
            products.map((product) =>
              product.id === response.data.id ? response.data : product
            )
          );
          setNewProduct({
            id: "",
            name: "",
            description: "",
            price: "",
            quantity: "",
            supplierId: "",
          });
        })
        .catch((error) => {
          console.error("Erro ao atualizar produto:", error);
          alert("Erro ao atualizar produto.");
        });
    } else {
      // Adicionar novo produto
      axios
        .post("http://localhost:5000/products", {
          name,
          description,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          supplierId: parseInt(supplierId),
        })
        .then((response) => {
          setProducts([...products, response.data]);
          setNewProduct({
            id: "",
            name: "",
            description: "",
            price: "",
            quantity: "",
            supplierId: "",
          });
        })
        .catch((error) => {
          console.error("Erro ao adicionar produto:", error);
          alert("Erro ao adicionar produto.");
        });
    }
  };

  return (
    <div className="p-10 bg-gray-800 h-[50.5vw] overflow-hidden shadow-md rounded flex flex-row gap-10 items-start">
      <div className="bg-gray-700 shadow-lg w-[50%] rounded-lg p-8">
        <table className="w-full">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Descrição</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Quantidade</th>
              <th className="p-3">Fornecedor</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-3 text-center truncate max-w-[100px]">{product.name}</td>
                <td className="p-3 text-center truncate max-w-[150px]">{product.description}</td>
                <td className="p-3 text-center">{product.price}</td>
                <td className="p-3 text-center">{product.quantity}</td>
                <td className="p-3 text-center truncate max-w-[100px]">
                  {suppliers.find((s) => s.id === product.supplierId)?.name || "Desconhecido"}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleEditProduct(product.id)}
                    className="px-4 py-2 text-blue-500 font-semibold hover:text-blue-700 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-4 py-2 text-red-500 font-semibold hover:text-red-600 transition duration-200 ml-2"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded ${currentPage === index + 1
                ? "bg-blue-400 text-white"
                : "bg-gray-200 text-gray-700"
                } hover:bg-blue-500 transition duration-200`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gray-700 shadow-lg w-[45%] rounded-lg p-8 mb-10">
        <h1 className="text-3xl font-bold text-blue-500 mb-6">Produtos</h1>
        <form onSubmit={handleAddOrUpdateProduct} className="space-y-4">
          <input
            className="w-full px-4 py-3 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="name"
            placeholder="Nome do produto"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full px-4 py-3 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="description"
            placeholder="Descrição"
            value={newProduct.description}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full px-4 py-3 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            name="price"
            placeholder="Preço"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full px-4 py-3 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            name="quantity"
            placeholder="Quantidade"
            value={newProduct.quantity}
            onChange={handleInputChange}
            required
          />
          <select
            name="supplierId"
            className="w-full px-4 py-3 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newProduct.supplierId}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione um fornecedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded transition duration-200"
          >
            {newProduct.id ? "Atualizar Produto" : "Adicionar Produto"}
          </button>
        </form>
      </div>  
    </div>
  );
};

export default ProductList;
