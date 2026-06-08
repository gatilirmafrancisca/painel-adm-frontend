import { useAuth } from "../context/AuthContext";
import Loader from "~/components/Loader";
import { Navigate } from "react-router";

const Placeholder: React.FC = () => {

  const auth = useAuth();

  if (auth.checking) {
    return <Loader />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="flex-1 flex items-center justify-center h-full text-[#1e1b1c]">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">EM CONSTRUÇÃO</h2>
        <p className="text-gray-500">Página em construção.</p>
      </div>
    </div>
  );
}

export default Placeholder;