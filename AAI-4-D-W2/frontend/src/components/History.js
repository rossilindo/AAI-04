import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const History = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Buscar histórico de produtos
  useEffect(() => {
    axios
      .get("http://localhost:5000/history")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar histórico de produtos:", error);
      });
  }, []);

  // Calcular o número total de páginas
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Obter produtos da página atual
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Manipuladores para navegação de página
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    
    <div className="bg-gray-800 h-[50.5vw] overflow-hidden shadow-md rounded items-center">
      <div className="mx-5 rounded">
        <h1 className="text-3xl font-semibold pt-6 mb-6 text-blue-500">Histórico de Produtos</h1>
        
        <table className="min-w-full text-center shadow-lg mb-6 rounded-lg">
          <thead>
            <tr className="bg-gray-500 text-white">
              <th className="px-6 py-3 text-left border-r border-gray-400">Nome do Produto</th>
              <th className="px-6 py-3 text-left border-r border-gray-400">ID do Produto</th>
              <th className="px-6 py-3 text-left border-r border-gray-400">Nome do Fornecedor</th>
              <th className="px-6 py-3 text-left border-r border-gray-400">ID do Fornecedor</th>
            </tr>
          </thead>

          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-200">
                <td className="px-6 py-4 border-r border-b border-gray-300">{product.name}</td>
                <td className="px-6 py-4 border-r border-b border-gray-300">{product.id}</td>
                <td className="px-6 py-4 border-r border-b border-gray-300">{product.supplier.name}</td>
                <td className="px-6 py-4 border-r border-b border-gray-300">{product.supplier.id}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center -mt-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 m-2 bg-gray-400 text-white rounded hover:disabled:bg-gray-600"
          >
            Anterior
          </button>

          <span className="text-white">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 m-2 bg-blue-500 hover:bg-blue-700 text-white rounded disabled:bg-gray-300"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;