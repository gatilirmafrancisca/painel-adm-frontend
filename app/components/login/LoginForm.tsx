import { type UseFormRegister, type FieldErrors, type UseFormWatch } from "react-hook-form";

type Data = {
    login: string,
    password: string,
}

interface Props {
    register: UseFormRegister<Data>;
    errors: FieldErrors<Data>;
    
}

const LoginForm : React.FC<Props> = ({ register, errors }) => {

    return (
        <div>

            { /* Username Field */ }
            <div className="mb-4">
            <label htmlFor="login" className="block text-sm font-medium text-[#1e1b1c] mb-2">
              Usuário
            </label>
            <input
              id="login"
              placeholder="Digite seu nome de usuário"
              className={`${errors.login ? 'border-red-500' : 'border-gray-200'} w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#368c5e]/20 focus:border-[#368c5e] transition-colors`}
            {...register("login", { required: "O nome de usuário é obrigatório" })}
            />
            {errors?.login && <p className="text-red-500 text-sm mt-2 whitespace-normal break-words max-w-full sm:max-w-md">{errors.login.message}</p>}
          </div>

            { /* Password Field */ }
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1e1b1c] mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "A senha é obrigatória" })}
              placeholder="••••••••"
              className={`${errors.password ? 'border-red-500' : 'border-gray-200'} w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#368c5e]/20 focus:border-[#368c5e] transition-colors`}
            />
            {errors?.password && <p className="text-red-500 text-sm mt-2 whitespace-normal break-words max-w-full sm:max-w-md">{errors.password.message}</p>}
          </div>
        </div>
    )

}

export default LoginForm;