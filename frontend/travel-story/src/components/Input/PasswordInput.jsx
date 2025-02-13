const PasswordInput = ({value, onChange, placeholder}) => {
  return (
    <div className="flex items-center bg-cyan-600/5 px-5 rounded mb-3">
      <input
        type="password"
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        className="w-full text-sm bg-transparent py-3 rounded outline-none"
      />
    </div>
  );
};

export default PasswordInput;
