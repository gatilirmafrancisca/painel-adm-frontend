interface Props {
    message: string
}

const Button : React.FC<Props> = ( { message }: Props) => {
    return (
        <button type="submit" 
        className="w-full bg-[#368c5e] text-white font-medium py-3 rounded-lg hover:bg-[#1a5331] transition-colors shadow-sm">
            { message }
        </button>
        
    );
}

export default Button;