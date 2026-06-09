import React, { useEffect, useState } from 'react';
import type { Gato } from '~/types/gato.type';
import { ChevronRight } from 'lucide-react';

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

    return (
        <>
          {/* Mobile: Cards */}
          <div className="md:hidden space-y-3 p-4">
            {localGatos.map((gato) => (
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
              {localGatos.map((gato) => (
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
        </>
    );

}

export default GatoTabela;