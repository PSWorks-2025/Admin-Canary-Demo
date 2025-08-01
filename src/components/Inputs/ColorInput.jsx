export default function ColorInput({ value, onChange, className = 'relative inline-block rounded-full w-8 h-8 ml-2 overflow-hidden border-2 border-gray-300 hover:border-gray-500 transition-colors duration-200' }) {
  return (
    <div className={`${className}`} style={{ backgroundColor: value }}>
      <input
        type="color"
        value={value}
        onChange={onChange}
        className="absolute top-0 left-0 w-[100%] h-[100%] opacity-0 cursor-pointer"
      />
    </div>
  );
}
