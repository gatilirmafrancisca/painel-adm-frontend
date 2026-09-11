import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { CriarRifaFormData, Rifa } from "../../types/rifa.type";

interface FormularioCadastroRifaProps {
  baseUrl: string;
  numeroInicial?: number | null;
  onCriado: (rifa: Rifa) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const FormularioCadastroRifa: React.FC<FormularioCadastroRifaProps> = ({
  baseUrl,
  numeroInicial,
  onCriado,
}) => {
  const [erroServidor, setErroServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CriarRifaFormData>({
    defaultValues: { name: "", phone: "", claimedNumber: "", email: "" },
  });

  useEffect(() => {
    reset({
      name: "",
      phone: "",
      email: "",
      claimedNumber: numeroInicial ? String(numeroInicial) : "",
    });
    setErroServidor(null);
  }, [numeroInicial, reset]);

  async function onSubmit(dados: CriarRifaFormData) {
    setErroServidor(null);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${baseUrl}/rifa/criar-rifa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: dados.name.trim(),
          phone: dados.phone.trim(),
          claimedNumber: Number(dados.claimedNumber),
          ...(dados.email.trim() ? { email: dados.email.trim() } : {}),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setErroServidor(payload?.message ?? "Não foi possível cadastrar. Tenta de novo.");
        return;
      }

      onCriado({
        claimedNumber: Number(dados.claimedNumber),
        name: dados.name.trim(),
        phone: dados.phone.trim(),
        email: dados.email.trim(),
        status: "PENDENTE",
      });
      reset({ name: "", phone: "", email: "", claimedNumber: "" });
    } catch {
      setErroServidor("Erro de conexão. Tenta de novo.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-bold text-[#1a5331]">
          Nome completo
        </label>
        <input
          type="text"
          placeholder="Nome de quem comprou o número"
          className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-[#1e1b1c] outline-none focus:border-[#368c5e]"
          {...register("name", {
            required: "Informe o nome.",
            minLength: { value: 3, message: "Pelo menos 3 caracteres." },
          })}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-bold text-[#1a5331]">
          Telefone / WhatsApp
        </label>
        <input
          type="tel"
          placeholder="(71) 9 9999-9999"
          className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-[#1e1b1c] outline-none focus:border-[#368c5e]"
          {...register("phone", {
            required: "Informe o telefone.",
            validate: (value) =>
              value.replace(/\D/g, "").length >= 10 || "Telefone inválido, com DDD.",
          })}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-bold text-[#1a5331]">
          Número da rifa
        </label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Entre 1 e 500"
          className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-[#1e1b1c] outline-none focus:border-[#368c5e]"
          {...register("claimedNumber", {
            required: "Informe o número.",
            validate: (value) => {
              const numero = Number(value);
              return (
                (Number.isInteger(numero) && numero >= 1 && numero <= 500) ||
                "Número inteiro entre 1 e 500."
              );
            },
          })}
        />
        {errors.claimedNumber && (
          <p className="mt-1 text-xs text-red-600">{errors.claimedNumber.message}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-bold text-[#1a5331]">
          E-mail <span className="font-normal text-[#9a9a92]">(opcional)</span>
        </label>
        <input
          type="email"
          placeholder="Deixe em branco se não tiver"
          className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-[#1e1b1c] outline-none focus:border-[#368c5e]"
          {...register("email", {
            validate: (value) => !value || EMAIL_REGEX.test(value) || "E-mail inválido.",
          })}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      {erroServidor && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {erroServidor}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[#368c5e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1a5331] disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isSubmitting ? "Cadastrando..." : "Cadastrar número"}
      </button>
    </form>
  );
};