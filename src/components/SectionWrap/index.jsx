export default function SectionWrap({children,borderColor,className}){
    return(
        <div className={`${className} border-t-2 w-full py-5 mb-3`} style={{borderTopColor:borderColor}}>
            {children}
        </div>
    )
}