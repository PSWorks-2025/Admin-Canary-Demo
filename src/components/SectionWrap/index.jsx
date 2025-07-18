export default function SectionWrap({children,borderColor}){
    return(
        <div className="border-t-2 w-full" style={{borderTopColor:borderColor}}>
            {children}
        </div>
    )
}