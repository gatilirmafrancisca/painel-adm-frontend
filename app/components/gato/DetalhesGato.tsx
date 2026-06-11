import React, { useState } from 'react';
import { type Gato } from '~/types/gato.type';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../ImageWithFallback';
import Loader from "../Loader";
import { successNotification } from '../ToasterComponents/ToasterNotifications';

interface DetalhesGatoProps {
    gato: Gato;
    onDeleted: (gatoId: string) => void;
}

const DetalhesGato: React.FC<DetalhesGatoProps> = ({ gato, onDeleted }) => {
    // Estado local para controlar qual imagem está ativa no carrossel
    const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);

    // Garante compatibilidade caso o backend envie um array de strings ou apenas uma string isolada
    const imagens: string[] = Array.isArray(gato.imagemUrl) 
        ? gato.imagemUrl 
        : gato.imagemUrl ? [gato.imagemUrl] : [];

    // Navegações seguras com efeito cíclico (volta pro começo ou fim)
    const proximaImagem = () => {
        setCurrentImgIndex((prev) => (prev + 1) % imagens.length);
    };

    const imagemAnterior = () => {
        setCurrentImgIndex((prev) => (prev - 1 + imagens.length) % imagens.length);
    };

    const BASEURL = import.meta.env.VITE_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost");
    const TOKEN_KEY = "token";

    const [loading, setLoading] = useState<boolean>(false);

    const deleteGato = async (gatoId: string) => {

        try {
            setLoading(true);

            const response = await fetch(`${BASEURL}/gatos/${gatoId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete gato");
            }

            const data = await response.json();
            onDeleted(gatoId);
            successNotification(data.message || "Gato deleted successfully");

        } finally {

            setLoading(false);
        }
    }

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-[0_12px_40px_rgba(17,24,39,0.08)] border border-gray-100 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">ID</p><p className="font-medium text-gray-800 break-all leading-snug">{gato.id}</p></div>
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Idade (meses)</p><p className="font-medium text-gray-800 leading-snug">{gato.idade}</p></div>
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Status</p><p className="font-semibold text-gray-800 leading-snug">{gato.status}</p></div>
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">FIV/FeLV</p><p className="font-semibold text-[#ff9d3b] leading-snug">{gato.fivFelv}</p></div>
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Personalidade</p><p className="font-medium text-gray-800 leading-snug break-words">{gato.personalidade?.join(', ') || 'Não informada'}</p></div>            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Castrado</p><p className="font-medium text-gray-800 leading-snug">{gato.castrado ? 'Sim' : 'Não'}</p></div>
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Vacinado</p><p className="font-medium text-gray-800 leading-snug">{gato.vacinado ? 'Sim' : 'Não'}</p></div>
            <div className="rounded-xl bg-gray-50/80 p-4 border border-gray-100"><p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Vermifugado</p><p className="font-medium text-gray-800 leading-snug">{gato.vermifugado ? 'Sim' : 'Não'}</p></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 sm:gap-6 items-start">
            
            {/* ATUALIZAÇÃO EXCLUSIVA NA DIV DA IMAGEM - ESTILO CARROSSEL INSTAGRAM */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Imagem</p>
              
              {/* Container de visualização relativa para suportar as setas absolutas */}
              <div className="relative group overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm aspect-[4/3] flex items-center justify-center">
                <ImageWithFallback
                  src={imagens[currentImgIndex] || ''}
                  alt={`${gato.nome} - Foto ${currentImgIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Controles de Seta Invisíveis por padrão no desktop, aparecem com o Hover (e sempre visíveis no mobile) */}
                {imagens.length > 1 && (
                    <>
                        <button 
                            onClick={imagemAnterior}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100"
                            aria-label="Imagem anterior"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={proximaImagem}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100"
                            aria-label="Próxima imagem"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
              </div>

              {/* Bolinhas indicativas de paginação abaixo do carrossel */}
              {imagens.length > 1 && (
                  <div className="flex justify-center items-center gap-1.5 pt-1.5">
                      {imagens.map((_, idx) => (
                          <button
                              key={idx}
                              onClick={() => setCurrentImgIndex(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 
                                  ${idx === currentImgIndex 
                                      ? 'w-4 bg-[#368c5e]' 
                                      : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`}
                              aria-label={`Ir para imagem ${idx + 1}`}
                          />
                      ))}
                  </div>
              )}
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
            <button className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[180px] border border-gray-200 text-gray-600 px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              onClick={() => {
                if (confirm("Tem certeza que deseja deletar este gato? Esta ação não pode ser desfeita.")) {
                  deleteGato(gato.id);
                }
              }}
                disabled={loading}
            >
              <Trash2 className="w-4 h-4" /> Deletar Gato
            </button>
          </div>
          {loading && (<div className="absolute inset-0 flex items-center justify-center z-50">
                <Loader /> </div>)}
        </div>
    );
};

export default DetalhesGato;