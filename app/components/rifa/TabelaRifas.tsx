import React, { useEffect, useState } from "react";
import { Ticket, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { Rifa } from "../../types/rifa.type";

interface TabelaRifasProps {
  rifas: Rifa[];
  isLoading: boolean;
  onSelecionar: (rifa: Rifa) => void;
}

const TabelaRifas: React.FC<TabelaRifasProps> = ({ rifas, isLoading, onSelecionar }) => {
  const [localRifas, setLocalRifas] = useState<Rifa[]>(rifas);

  useEffect(() => {
    setLocalRifas(rifas);
  }, [rifas]);

  // Paginação — mesma lógica do GatoTabela.tsx, adaptada.
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.max(1, Math.ceil(localRifas.length / itemsPerPage));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRifas = localRifas.slice(startIndex, startIndex + itemsPerPage);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  const getPaginationItems = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }
    return [currentPage, currentPage + 1, "...", totalPages];
  };

  const estadoVazio = !isLoading && currentRifas.length === 0;

  return (
    <>
      {/* Mobile: Cards */}
      <div className="md:hidden space-y-3 p-4">
        {estadoVazio ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
              <Ticket className="h-8 w-8 text-gray-400" />
            </div>
            <p className="mb-1 text-lg font-medium text-gray-900">Nenhum número cadastrado</p>
            <p className="max-w-sm text-sm text-gray-500">
              Ainda não há registros. Clique em "+ Cadastrar número" para começar.
            </p>
          </div>
        ) : (
          currentRifas.map((rifa) => (
            <div
              key={rifa.claimedNumber}
              onClick={() => onSelecionar(rifa)}
              className="cursor-pointer rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-[#368c5e]/50 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-base font-semibold text-[#1e1b1c]">
                    {String(rifa.claimedNumber).padStart(3, "0")} — {rifa.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="mb-0.5 text-xs text-gray-500">Telefone</p>
                      <p className="font-medium text-gray-700">{rifa.phone}</p>
                    </div>
                    <div>
                      <p className="mb-0.5 text-xs text-gray-500">E-mail</p>
                      <p className="truncate font-medium text-gray-700">{rifa.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center justify-center">
                  <div className="rounded-full bg-[#368c5e] p-2 text-white">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: Tabela */}
      <table className="hidden w-full border-collapse text-left md:table">
        <thead className="sticky top-0 z-10 bg-[#1a5331] text-white">
          <tr>
            <th className="px-6 py-3 text-sm font-medium">Número</th>
            <th className="px-6 py-3 text-sm font-medium">Nome</th>
            <th className="px-6 py-3 text-sm font-medium">Telefone</th>
            <th className="px-6 py-3 text-sm font-medium">E-mail</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                Carregando...
              </td>
            </tr>
          ) : estadoVazio ? (
            <tr>
              <td colSpan={4} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                    <Ticket className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="mb-1 text-lg font-medium text-gray-900">
                    Nenhum número cadastrado
                  </p>
                  <p className="max-w-sm text-sm text-gray-500">
                    Ainda não há registros no sistema. Clique em "+ Cadastrar número" para
                    começar a controlar a rifa.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            currentRifas.map((rifa) => (
              <tr
                key={rifa.claimedNumber}
                onClick={() => onSelecionar(rifa)}
                className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-semibold text-[#ff9d3b]">
                  {String(rifa.claimedNumber).padStart(3, "0")}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-[#1e1b1c]">{rifa.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{rifa.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{rifa.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/80 p-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Mostrando{" "}
            <span className="font-medium text-gray-900">
              {localRifas.length === 0 ? 0 : startIndex + 1}
            </span>{" "}
            a{" "}
            <span className="font-medium text-gray-900">
              {Math.min(startIndex + itemsPerPage, localRifas.length)}
            </span>{" "}
            de <span className="font-medium text-gray-900">{localRifas.length}</span> números
          </p>

          <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:pl-4">
            <label htmlFor="rows-per-page" className="text-sm text-gray-500">
              Exibir:
            </label>
            <select
              id="rows-per-page"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-colors hover:border-gray-300 focus:border-[#368c5e] focus:outline-none focus:ring-1 focus:ring-[#368c5e]"
            >
              <option value={10}>10 linhas</option>
              <option value={25}>25 linhas</option>
              <option value={50}>50 linhas</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:border-[#368c5e] hover:bg-white hover:text-[#368c5e] disabled:cursor-not-allowed disabled:opacity-50"
            title="Primeira página"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:border-[#368c5e] hover:bg-white hover:text-[#368c5e] disabled:cursor-not-allowed disabled:opacity-50"
            title="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1">
            {getPaginationItems().map((item, index) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-8 w-8 items-center justify-center text-sm text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${item}`}
                  onClick={() => setCurrentPage(item as number)}
                  disabled={localRifas.length === 0}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    localRifas.length === 0
                      ? "cursor-not-allowed text-gray-400"
                      : currentPage === item
                      ? "bg-[#368c5e] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:border-[#368c5e] hover:bg-white hover:text-[#368c5e] disabled:cursor-not-allowed disabled:opacity-50"
            title="Próxima página"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:border-[#368c5e] hover:bg-white hover:text-[#368c5e] disabled:cursor-not-allowed disabled:opacity-50"
            title="Última página"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
};

export default TabelaRifas;