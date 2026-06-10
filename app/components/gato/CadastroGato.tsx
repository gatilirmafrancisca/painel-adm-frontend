import { X, UploadCloud, Image as ImageIcon, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import { type GatoFormData, CORTYPES, FIVFELVTYPES, PERSONALIDADETYPES, STATUSTYPES } from '~/types/gato.type';
import Loader from "../Loader";
import { successNotification, errorNotification } from "~/components/ToasterComponents/ToasterNotifications";

interface CadastroGatoProps {
    setIsModalOpen: (isOpen: boolean) => void;
    onCreated?: (gato: any) => void;
}

const CadastroGato: React.FC<CadastroGatoProps> = ({ setIsModalOpen, onCreated }) => {
    const BASEURL = import.meta.env.VITE_BASE_URL ?? "http://localhost";
    const [loading, setLoading] = useState<boolean>(false);
    
    // Estados para controle de imagens e previews
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    
    const ref = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref para acionar o clique na caixa inteira

    useEffect(() => {
        const onMouseDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsModalOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsModalOpen(false);
        };
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [setIsModalOpen]);

    useEffect(() => {
        return () => previewUrls.forEach(url => URL.revokeObjectURL(url));
    }, [previewUrls]);

    const { register, handleSubmit, formState: { errors } } = useForm<GatoFormData>({
        defaultValues: { status: 'Disponível', personalidade: [], castrado: false, vacinado: false, vermifugado: false, necessidadesEspeciais: false }
    });

    // Função unificada para processar a adição de arquivos (via clique ou drag-and-drop)
    const adicionarArquivos = (files: FileList) => {
        const novosArquivos = Array.from(files);
        const espacoDisponivel = 10 - selectedFiles.length;
        
        if (espacoDisponivel <= 0) {
            errorNotification("Limite máximo de 10 imagens atingido.");
            return;
        }

        const arquivosPermitidos = novosArquivos.slice(0, espacoDisponivel);
        const novasUrls = arquivosPermitidos.map(file => URL.createObjectURL(file));

        setSelectedFiles(prev => [...prev, ...arquivosPermitidos]);
        setPreviewUrls(prev => [...prev, ...novasUrls]);
        
        if (novosArquivos.length > espacoDisponivel) {
            errorNotification(`Apenas ${espacoDisponivel} imagem(ns) foram adicionadas para respeitar o limite de 10.`);
        }
    };

    // Handlers para o arrastar e soltar (Drag and Drop)
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            adicionarArquivos(e.dataTransfer.files);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            adicionarArquivos(e.target.files);
            e.target.value = ''; // Reseta o input para disparar eventos em arquivos repetidos se necessário
        }
    };

    const removerImagem = (indexToRemove: number) => {
        URL.revokeObjectURL(previewUrls[indexToRemove]);
        setSelectedFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
        setPreviewUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const onSubmit = async (data: GatoFormData) => {
        if (selectedFiles.length === 0) {
            errorNotification("Pelo menos uma imagem é obrigatória.");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Acesso não autorizado.");

            const formData = new FormData();
            formData.append("nome", data.nome);
            formData.append("idade", String(data.idade));
            formData.append("sexo", data.sexo);
            formData.append("cor", data.cor);
            formData.append("castrado", String(data.castrado));
            formData.append("vacinado", String(data.vacinado));
            formData.append("vermifugado", String(data.vermifugado));
            formData.append("fivFelv", data.fivFelv);
            formData.append("necessidadesEspeciais", String(data.necessidadesEspeciais));
            formData.append("descricaoBio", data.descricaoBio);
            formData.append("status", data.status);

            data.personalidade.forEach(p => formData.append("personalidade", p));
            selectedFiles.forEach(file => formData.append("imagens", file));

            const response = await fetch(`${BASEURL}/gatos`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            const parsed = await response.json().catch(() => null);
            if (!response.ok) throw new Error(parsed?.message || "Erro ao cadastrar gato");

            successNotification("Gato cadastrado com sucesso!");
            if (parsed?.data) onCreated?.(parsed.data);
            setIsModalOpen(false);

        } catch (err: any) {
            errorNotification(err.message ?? "Ocorreu um erro inesperado");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#368c5e]/20 focus:border-[#368c5e] outline-none transition-all text-sm";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
    const sectionTitleClass = "text-lg font-bold text-[#1a5331] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2";

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div ref={ref} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
                
                <div className="sticky top-0 z-10 p-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[#1a5331]">Cadastrar Novo Gato</h2>
                        <p className="text-sm text-gray-500 mt-1">Preencha o perfil completo para a adoção.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="hover:bg-gray-100 p-2 rounded-full transition-colors text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-10 flex-1">
                    
                    {/* SEÇÃO 1: Informações Básicas */}
                    <section>
                        <h3 className={sectionTitleClass}>Informações Básicas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>Nome do Gato *</label>
                                <input type="text" placeholder="Ex: Mingau" {...register("nome", { required: true })} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Idade (meses) *</label>
                                <input type="number" min="0" placeholder="Ex: 12" {...register("idade", { required: true, valueAsNumber: true })} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Sexo *</label>
                                <select {...register("sexo", { required: true })} className={inputClass}>
                                    <option value="">Selecione...</option>
                                    <option value="Macho">Macho</option>
                                    <option value="Fêmea">Fêmea</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Cor / Pelagem *</label>
                                <select {...register("cor", { required: true })} className={inputClass}>
                                    <option value="">Selecione...</option>
                                    {CORTYPES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* SEÇÃO 2: Saúde e Condição */}
                    <section>
                        <h3 className={sectionTitleClass}>Saúde Clínica</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className={labelClass}>Teste de FIV/FeLV *</label>
                                <select {...register("fivFelv", { required: true })} className={inputClass}>
                                    <option value="">Selecione o resultado...</option>
                                    {FIVFELVTYPES.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['castrado', 'vacinado', 'vermifugado', 'necessidadesEspeciais'].map((item) => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" {...register(item as keyof GatoFormData)} className="peer sr-only" />
                                        <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded transition-colors peer-checked:bg-[#368c5e] peer-checked:border-[#368c5e]"></div>
                                        <svg className="absolute w-4 h-4 text-white left-1 top-1 opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 capitalize group-hover:text-[#368c5e] transition-colors">
                                        {item.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* SEÇÃO 3: Perfil e Personalidade */}
                    <section>
                        <h3 className={sectionTitleClass}>Perfil e Descrição</h3>
                        <div className="mb-6">
                            <label className={labelClass}>Personalidade (Múltipla escolha) *</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                                {PERSONALIDADETYPES.map(p => (
                                    <label key={p} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 cursor-pointer hover:border-[#368c5e] transition-colors">
                                        <input type="checkbox" value={p} {...register("personalidade", { required: true })} className="w-4 h-4 text-[#368c5e] rounded border-gray-300 focus:ring-[#368c5e]" />
                                        <span className="text-sm text-gray-700">{p}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                            <div>
                                <label className={labelClass}>Biografia / Descrição *</label>
                                <textarea rows={4} placeholder="Conte um pouco sobre a história e o jeito do gato..." {...register("descricaoBio", { required: true })} className={`${inputClass} resize-none`} />
                            </div>
                            <div className="md:w-1/2">
                                <label className={labelClass}>Status do Animal *</label>
                                <select {...register("status", { required: true })} className={inputClass}>
                                    {STATUSTYPES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* SEÇÃO 4: Mídia (Imagens com Área Total de Drop) */}
                    <section>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                            <h3 className="text-lg font-bold text-[#1a5331] flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" /> Fotos do Gato *
                            </h3>
                            <span className="text-sm font-medium text-gray-500">{selectedFiles.length} / 10 imagens</span>
                        </div>
                        
                        {/* Box de Upload totalmente interativo e clicável */}
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`p-8 rounded-xl border-2 border-dashed text-center relative group cursor-pointer transition-all duration-200 select-none
                                ${isDragging 
                                    ? 'border-[#368c5e] bg-[#368c5e]/10 scale-[0.99] shadow-inner' 
                                    : 'border-gray-300 bg-gray-50 hover:border-[#368c5e] hover:bg-gray-50/40'}`}
                        >
                            {/* Input oculto controlado via ref */}
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                multiple 
                                accept="image/*" 
                                onChange={handleInputChange} 
                                disabled={selectedFiles.length >= 10} 
                                className="sr-only" 
                            />

                            <UploadCloud className={`mx-auto h-12 w-12 transition-colors mb-3 
                                ${isDragging ? 'text-[#368c5e]' : 'text-gray-400 group-hover:text-[#368c5e]'}`} 
                            />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                {isDragging ? "Solte as fotos aqui!" : "Arraste imagens ou clique em qualquer lugar desta caixa"}
                            </p>
                            <p className="text-xs text-gray-400">PNG, JPG até 6MB. Máximo 10 arquivos.</p>
                        </div>

                        {/* Grade de Previews abaixo */}
                        {previewUrls.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-6">
                                {previewUrls.map((url, index) => (
                                    <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white animate-in fade-in duration-200">
                                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.stopPropagation(); removerImagem(index); }} 
                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transform scale-90 group-hover:scale-100 transition-all shadow-md"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100 flex justify-end gap-3 mt-8">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="bg-[#368c5e] text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a5331] disabled:opacity-50 flex items-center justify-center min-w-[160px] shadow-sm transition-colors">
                            {loading ? <Loader /> : "Salvar Cadastro"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CadastroGato;