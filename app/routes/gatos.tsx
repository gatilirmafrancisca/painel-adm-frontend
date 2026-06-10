import React, { useState, useRef, useEffect } from 'react';
import CadastroGato from '~/components/gato/CadastroGato';
import { type Gato } from '../types/gato.type';
import Loader from "~/components/Loader";
import { Navigate } from 'react-router';
import { useAuth } from "~/context/AuthContext";
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

    const auth = useAuth();

    if (auth.checking) {
        return <Loader />;
    }

    if (!auth.isAuthenticated) {
        return <Navigate to="/" replace />;
    }

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
        <DetalhesGato gato={selectedGato} onClose={() => setSelectedGato(null)} />
      )}

      {/* 5. PopUp Modal */}
      {isModalOpen && (
        <CadastroGato setIsModalOpen={setIsModalOpen} />
      )}
    </div>
    );

}

export default Gatos;