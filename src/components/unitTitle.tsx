
interface UnitTitleProps{
    title: string
}

export default function UnitTitle({title,...props}:UnitTitleProps){
    return(
        <div {...props}>
            <h1>{title}</h1>
        </div>
    )
}