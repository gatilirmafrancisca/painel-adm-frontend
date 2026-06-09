import React from 'react';
import { type Gato } from '~/types/gato.type';
import { Edit2, Trash2 } from 'lucide-react';


interface DetalhesGatoProps {
    gato: Gato;
    onClose: () => void;
}


const DetalhesGato: React.FC<DetalhesGatoProps> = ({ gato, onClose }) => {

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-[0_12px_40px_rgba(17,24,39,0.08)] border border-gray-100 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">ID</p><p className="font-medium text-gray-800 break-all leading-snug">{gato.id}</p></div>
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Idade (meses)</p><p className="font-medium text-gray-800 leading-snug">{gato.idade}</p></div>
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Status</p><p className="font-semibold text-gray-800 leading-snug">{gato.status}</p></div>
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">FIV/FeLV</p><p className="font-semibold text-[#ff9d3b] leading-snug">{gato.fivFelv}</p></div>
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Personalidade</p><p className="font-medium text-gray-800 leading-snug break-words">{gato.personalidade.map((p) => p).join(', ')}</p></div>
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Castrado</p><p className="font-medium text-gray-800 leading-snug">{gato.castrado ? 'Sim' : 'Não'}</p></div>
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Vacinado</p><p className="font-medium text-gray-800 leading-snug">{gato.vacinado ? 'Sim' : 'Não'}</p></div>
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Vermifugado</p><p className="font-medium text-gray-800 leading-snug">{gato.vermifugado ? 'Sim' : 'Não'}</p></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 sm:gap-6 items-start">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Imagem</p>
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                <img
                  src={gato.imagemUrl}
                  alt={gato.nome}
                  className="w-full h-auto max-h-[320px] lg:max-h-[420px] object-cover"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Biografia</p>
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-700 bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-100 min-h-[180px] whitespace-pre-wrap break-words">
                {gato.descricaoBio}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end border-t border-gray-100 pt-4">
            <button className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[180px] bg-[#ff9d3b] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#e88a2a] transition-colors shadow-sm">
              <Edit2 className="w-4 h-4" /> Editar Cadastro
            </button>
            <button className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[180px] border border-gray-200 text-gray-600 px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              <Trash2 className="w-4 h-4" /> Deletar Gato
            </button>
          </div>
        </div>
    );

}

export default DetalhesGato;