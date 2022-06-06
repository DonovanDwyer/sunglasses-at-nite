export default function InputField({ label, hideLabel, onChange, placeholder }){
    return <>
            <label htmlFor={label}>
                {hideLabel ? '' : label}
                <input
                    id={label}
                    name={label}
                    onChange={onChange} 
                    placeholder={placeholder ? placeholder : ''}
                />
            </label>
        </>
}

