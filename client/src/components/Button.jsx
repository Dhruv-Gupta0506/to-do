const Button = ({ text,onClick,type="submit" }) => {
    return (
        <button 
            type={type}
            onClick={onClick}
            className="custom-button"
        >
            {text}
        </button>
    );
};
export default Button;