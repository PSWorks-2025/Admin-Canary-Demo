export default function ColorInput({ value, onChange, className }) {
  return (
    <input
        type="color"
        value={value}
        onChange={onChange}
        className={className}
    />
  );
}