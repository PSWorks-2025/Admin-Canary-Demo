export const TextInput = ({ value, onChange, placeholder, className,type="input",rows="4" }) => {
    return(
        <>
        {type === "input" ? (
            <input
            className={`${className} border-1`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
        ):(
            <textarea
            className={`${className} border-1`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
          />
        )}
        </>
    )
}