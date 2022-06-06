import { useState } from 'react';

export default function Dropdown({ options, defaultOption, submitLabel, submitHandler }){
    const [ selected, setSelected ] = useState("")
    function handleChange(e){
        e.preventDefault();
        setSelected(e.target.value);
    }
    function submitHandlerWrapper(e){
        e.preventDefault();
        submitHandler(selected);
    }
    return (
        <>
            <select value={ selected } onChange={handleChange}>
                {defaultOption ? <option value='none'>{defaultOption}</option> : ''  }
                {options ? options.map(opt => <option value={opt} key={opt}>{opt}</option>) : []}
            </select>
            <button onClick={submitHandlerWrapper}>{submitLabel}</button>
        </>
    )
}