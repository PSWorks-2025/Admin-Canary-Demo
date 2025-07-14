export const TextInput = ({ value, onChange, placeholder, className,type="input",rows="4" }) => {
    return(
        <>
        {type === "input" ? (
            <input
            className={`${className}`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
        ):(
            <textarea
            className={`${className}`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
          />
        )}
        </>
    )
}