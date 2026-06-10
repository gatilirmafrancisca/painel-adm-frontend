import { Plus, X, UploadCloud, Edit2, Trash2 } from 'lucide-react';

interface CadastroGatoProps {
    setIsModalOpen: (isOpen: boolean) => void;
}


const CadastroGato: React.FC<CadastroGatoProps> = ({ setIsModalOpen }) => {

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#1a5331] text-white rounded-t-xl">
                <h2 className="text-xl font-bold">Cadastrar Novo Gato</h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            </div>
        </div>
    );

}

export default CadastroGato;