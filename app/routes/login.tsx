import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { errorNotification, successNotification } from "~/components/ToasterComponents/ToasterNotifications";
import avatarImg from "~/assets/avatar.png";
import LoginForm from "~/components/login/LoginForm";
import LoginButton from "~/components/MainButton";
import Loader from "~/components/Loader";
import "~/styles/loader.css";


interface Props {
    login: string,
    password: string
}

const Login : React.FC = () => {

    const navigate = useNavigate();
    const auth = useAuth();

    const { register, handleSubmit, formState: {errors} } = useForm<Props>();
    const BASEURL = import.meta.env.VITE_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost"); 
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: Props) => {

        const controller = new AbortController();

        try {

            setLoading(true);

            const response = await fetch(`${BASEURL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                signal: controller.signal,

            });

            const ct = response.headers.get("content-type") ?? "";
            const body = ct.includes("application/json") ? await response.json() : await response.text();
            const message = typeof body === "string" ? body : (body?.message ?? JSON.stringify(body));

            if(response.ok && body?.user?.token) {

                console.log("Login successful");
                auth.login(body.user.token);
                successNotification(message);
                navigate("/dashboard", { replace: true });
                
            } else {

                console.log("Login failed");
                errorNotification(message);
            }

        } catch (err: any) {

            if (err.name === "AbortError") {
                console.log("Request was aborted");

            } else {

                console.error("Login error:", err);
                errorNotification(err.message ?? "An unexpected error occurred");

            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <main className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4 font-sans text-[#1e1b1c]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4">
            <img 
              src={avatarImg} 
              alt="Avatar Principal" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#1e1b1c] mb-2">Acesso ao Painel</h1>
          <p className="text-sm text-gray-500">Insira suas credenciais para entrar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${loading ? 'opacity-60 pointer-events-none' : ''}`}>

            <LoginForm register={register} errors={errors} />
            <LoginButton message={"Entrar"} />
            
        </form>

        {loading && (
            <Loader />
        )}
      </div>
    </main>
  );
}

export default Login;