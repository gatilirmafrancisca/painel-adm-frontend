import React, { useEffect, useState } from 'react';
import type { Gato } from '~/types/gato.type';
import {  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface GatoTabelaProps {
    gatos: Gato[];
    selectedGato: Gato | null;
    setSelectedGato: (gato: Gato) => void;
}

const GatoTabela: React.FC<GatoTabelaProps> = ({ gatos, selectedGato, setSelectedGato }) => {

    const [localGatos, setLocalGatos] = useState<Gato[]>(gatos);

    useEffect(() => {
      setLocalGatos(gatos);
    }, [gatos]);

    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPages = Math.ceil(localGatos.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentGatos = localGatos.slice(startIndex, startIndex + itemsPerPage);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
    };

    const goToNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const goToPreviousPage = () => {
      if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const getPaginationItems = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Se estivermos nas últimas páginas, mostrar as 3 últimas
    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }
    
    // Caso padrão: mostrar a página atual, a próxima, reticências e a última
    return [currentPage, currentPage + 1, '...', totalPages];
  };    

    return (
        <>
        <div>
          {/* Mobile: Cards */}
          <div className="md:hidden space-y-3 p-4">
            {currentGatos.map((gato) => (
              <div
                key={gato.id}
                onClick={() => setSelectedGato(gato)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                  selectedGato?.id === gato.id
                    ? 'border-[#368c5e] bg-[#368c5e]/5 shadow-md'
                    : 'border-gray-100 hover:border-[#368c5e]/50 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1e1b1c] text-base mb-2">{gato.nome}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Sexo</p>
                        <p className="text-gray-700 font-medium">{gato.sexo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Cor</p>
                        <p className="text-gray-700 font-medium">{gato.cor}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center flex-shrink-0">
                    <div className="bg-[#368c5e] text-white rounded-full p-2">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Tabela */}
          <table className="hidden md:table w-full text-left border-collapse">
            <thead className="bg-[#1a5331] text-white sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 font-medium text-sm">Nome</th>
                <th className="px-6 py-3 font-medium text-sm">Sexo</th>
                <th className="px-6 py-3 font-medium text-sm">Cor</th>
                <th className="px-6 py-3 font-medium text-sm text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {currentGatos.map((gato) => (
                <tr
                  key={gato.id}
                  onClick={() => setSelectedGato(gato)}
                  className={`border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedGato?.id === gato.id ? 'bg-[#368c5e]/10' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-[#1e1b1c]">{gato.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{gato.sexo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{gato.cor}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-[#368c5e] text-sm font-medium hover:text-[#1a5331] transition-colors">
                      Ver detalhes
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {/* Pagination Controls */}
        <div className="bg-gray-50/80 border-t border-gray-100 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-sm text-gray-500">
              Mostrando <span className="font-medium text-gray-900">{Math.min(startIndex + 1, localGatos.length)}</span> a{' '}
              <span className="font-medium text-gray-900">{Math.min(startIndex + itemsPerPage, localGatos.length)}</span> de{' '}
              <span className="font-medium text-gray-900">{localGatos.length}</span> gatos
            </p>
            
            <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:pl-4">
              <label htmlFor="rows-per-page" className="text-sm text-gray-500">Exibir:</label>
              <select 
                id="rows-per-page"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#368c5e] focus:ring-1 focus:ring-[#368c5e] text-gray-700 cursor-pointer hover:border-gray-300 transition-colors shadow-sm"
              >
                <option value={10}>10 linhas</option>
                <option value={30}>30 linhas</option>
                <option value={50}>50 linhas</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:border-[#368c5e] hover:text-[#368c5e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Primeira página"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:border-[#368c5e] hover:text-[#368c5e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {getPaginationItems().map((item, index) => (
                item === '...' ? (
                  <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${item}`}
                    onClick={() => setCurrentPage(item as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === item 
                        ? 'bg-[#368c5e] text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {item}
                  </button>
                )
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:border-[#368c5e] hover:text-[#368c5e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Próxima página"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:border-[#368c5e] hover:text-[#368c5e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Última página"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        </>
    );

}

export default GatoTabela;