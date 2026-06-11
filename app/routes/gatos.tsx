import React, { useState, useRef, useEffect } from 'react';
import CadastroGato from '~/components/gato/CadastroGato';
import { type Gato } from '../types/gato.type';
import { Navigate } from 'react-router';
import GatoTabela from '~/components/gato/GatoTabela';
import DetalhesGato from '~/components/gato/DetalhesGato';

const Gatos : React.FC = () => {

    const BASEURL = import.meta.env.VITE_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost");

    const normalizeGato = (g: any): Gato => {
        const {_id, id, ...rest} = g?? {};
        return {
        ...rest,
        id: id ?? (_id ? String(_id) : undefined),
        } as Gato;
    };

    const [gatos, setGatos] = useState<Gato[]>([]);
    const [selectedGato, setSelectedGato] = useState<Gato | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const originalGatosRef = useRef<Gato[]>([]);

    useEffect(() => {

        setLoading(true);

        const fetchGatos = async () => {

            const response = await fetch(`${BASEURL}/gatos`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if(response.status === 404) {
                originalGatosRef.current = [];
                setGatos([]);
                return;
            }

            if (!response.ok) {
            console.error("Error fetching gatos:", response.statusText);
            return;
        }

            const data = await response.json();
            const list = Array.isArray(data?.data) ? data.data.map((item: any) => normalizeGato(item)) : [];
            
            originalGatosRef.current = list;
            setGatos(list);
             
        };

        setLoading(false);
        fetchGatos();

    }, []);

    const handleCreated = (gato: Gato) => {
        const isTemp = typeof gato.id === "string" && gato.id.startsWith("temp-");

        // Se for um temp id, insere otimisticamente (se ainda não existir)
        if (isTemp) {
            originalGatosRef.current = originalGatosRef.current.some((b) => b.id === gato.id)
                ? originalGatosRef.current.map((b) => (b.id === gato.id ? gato : b))
                : [gato, ...originalGatosRef.current];

            setGatos((prev) => {
                if (prev.some((b) => b.id === gato.id)) return prev;
                return [gato, ...prev];
            });
            return;
        }
        setGatos((prev) => {
            // 1) substitui por id exato
            if (prev.some((b) => b.id === gato.id)) {
                return prev.map((b) => (b.id === gato.id ? gato : b));
            }

            const idx = prev.findIndex(
                (b) =>
                    (b.nome === gato.nome && b.idade === gato.idade) ||
                    (typeof b.id === "string" && b.id.startsWith("temp-"))
            );
            if (idx !== -1) {
                const copy = [...prev];
                copy[idx] = gato;
                return copy;
            }

            // 3) se não achar nada, adiciona no topo
            return [gato, ...prev];
        });

        if (originalGatosRef.current.some((b) => b.id === gato.id)) {
            originalGatosRef.current = originalGatosRef.current.map((b) => (b.id === gato.id ? gato : b));
        } else {
            const idxRef = originalGatosRef.current.findIndex(
                (b) =>
                    (b.nome === gato.nome && b.idade === gato.idade) ||
                    (typeof b.id === "string" && b.id.startsWith("temp-"))
            );
            if (idxRef !== -1) {
                const copy = [...originalGatosRef.current];
                copy[idxRef] = gato;
                originalGatosRef.current = copy;
            } else {
                originalGatosRef.current = [gato, ...originalGatosRef.current];
            }
        }
    };

    const handleEdited = (gato: Gato) => {
        originalGatosRef.current = originalGatosRef.current.map(b => b.id === gato.id ? gato : b);
        setGatos(prev => prev.map(b => b.id === gato.id ? gato : b));
    };

    const handleDeleted = (gatoId: string) => {
        originalGatosRef.current = originalGatosRef.current.filter(b => b.id !== gatoId);
        setGatos(prev => prev.filter(b => b.id !== gatoId));
        setSelectedGato(null);
    };

    return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col relative">

        {/* 1. Topo */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#1e1b1c]">Controle de Gatos</h1>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#368c5e] hover:bg-[#1a5331] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
          + Criar Gato
            </button>
        </div>

        {/* 2. Filtros Avançados */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
        </div>

        {/* 3. Tabela Principal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 flex-1 overflow-y-auto">
        <GatoTabela gatos={gatos} selectedGato={selectedGato} setSelectedGato={setSelectedGato} />
      </div>

        {/* 4. Detalhes do Gato Selecionado */}
      {selectedGato && (
        <DetalhesGato gato={selectedGato} onDeleted={handleDeleted} />
      )}

      {/* 5. PopUp Modal */}
      {isModalOpen && (
        <CadastroGato setIsModalOpen={setIsModalOpen} onCreated={handleCreated} />
      )}
    </div>
    );

}

export default Gatos;