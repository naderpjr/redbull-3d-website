export function SecHead({ no, label }: { no: string; label: string }) {
    return (
        <div className="rule-t col-span-full flex justify-between pt-[0.7rem] text-[0.8rem] font-medium">
            <span>{no}</span>
            <span>{label}</span>
        </div>
    )
}