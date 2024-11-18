import React, { useEffect, useState } from "react";
import axios from "axios";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    cnpj: "",
    email: "",
    phone: "",
  });
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Carregar os fornecedores ao carregar o componente
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

  // Função para excluir fornecedor
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/suppliers/${id}`)
      .then(() => {
        setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
      })
      .catch((error) => {
        console.error("Erro ao deletar fornecedor:", error);
      });
  };

  // Funções para formatar CNPJ e telefone
  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const formatPhone = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4,5})(\d{4})$/, "$1-$2")
      .slice(0, 15);
  };

  // Função de manipulação de input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cnpj") {
      formattedValue = formatCNPJ(value);
    } else if (name === "phone") {
      formattedValue = formatPhone(value);
    }

    setNewSupplier({ ...newSupplier, [name]: formattedValue });
  };

  const totalPages = Math.ceil(suppliers.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedSuppliers = suppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Função para adicionar ou editar fornecedor
  const handleAddOrUpdateSupplier = (e) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.cnpj || !newSupplier.email || !newSupplier.phone) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    if (editingSupplier) {
      axios
        .put(`http://localhost:5000/suppliers/${editingSupplier}`, newSupplier)
        .then((response) => {
          setSuppliers(
            suppliers.map((supplier) =>
              supplier.id === response.data.id ? response.data : supplier
            )
          );
          setEditingSupplier(null);
        })
        .catch((error) => console.error("Erro ao atualizar fornecedor:", error));
    } else {
      axios
        .post("http://localhost:5000/suppliers", newSupplier)
        .then((response) => {
          setSuppliers([...suppliers, response.data]);
        })
        .catch((error) => console.error("Erro ao adicionar fornecedor:", error));
    }

    setNewSupplier({ name: "", cnpj: "", email: "", phone: "" });
  };

  return (
    <div className="p-10 bg-gray-800 h-[50.5vw] overflow-hidden shadow-md rounded flex flex-row gap-10 items-start">
      <div className="bg-gray-700 shadow-lg w-[55%] rounded-lg p-8">
        <table className="w-full">
          <thead className="bg-blue-400 text-white">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">CNPJ</th>
              <th className="p-3">Email</th>
              <th className="p-3">Telefone</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {displayedSuppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b">
                <td className="p-2 text-center truncate max-w-[100px]">{supplier.name}</td>
                <td className="p-2 text-center">{supplier.cnpj}</td>
                <td className="p-2 text-center truncate max-w-[100px]">{supplier.email}</td>
                <td className="p-2 text-center">{supplier.phone}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => {
                      setEditingSupplier(supplier.id);
                      setNewSupplier(supplier);
                    }}
                    className="px-4 py-2 text-blue-500 font-semibold hover:text-blue-600 transition duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
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
              className={`px-4 py-2 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                } hover:bg-blue-400 transition duration-200`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gray-700 shadow-lg w-[45%] rounded-lg p-8 mb-10">
        <h1 className="text-3xl font-bold text-blue-500 mb-6">Fornecedores</h1>
        <form onSubmit={handleAddOrUpdateSupplier} className="space-y-4">
          <input
            className="w-full px-4 py-3 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="name"
            placeholder="Nome do fornecedor"
            value={newSupplier.name}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full px-4 py-3 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="cnpj"
            placeholder="CNPJ"
            value={newSupplier.cnpj}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full px-4 py-3 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            name="email"
            placeholder="Email"
            value={newSupplier.email}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full px-4 py-3 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="phone"
            placeholder="Telefone"
            value={newSupplier.phone}
            onChange={handleInputChange}
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
          >
            {editingSupplier ? "Atualizar Fornecedor" : "Adicionar Fornecedor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupplierList;