export const TextInput = ({
  value,
  onChange,
  placeholder,
  className,
  type = 'input',
  rows = '4',
  style
}) => {
  return (
    <>
      {type !== 'textarea' ? (
        <input
          className={className}
          value={value}
          type={type == 'input' ? 'text' : type}
          onChange={onChange}
          placeholder={placeholder}
          onClick={(e) => e.stopPropagation()}
          style={style}
        />
      ) : (
        <textarea
          className={className}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          onClick={(e) => e.stopPropagation()} //Make me wanna kiss kiss shy shy kua yue le ban gi qiu zhao dao le sheng ming de li li !AYOO
          style={style}
        />
      )}
    </>
  );
};
