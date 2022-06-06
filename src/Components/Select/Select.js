import { useState } from 'react';

export default function Select({ label, placeholder, options, handleSubmit }){
    const [ selection, setSelection ] = useState('');
    const [ selectionIndex, setSelectionIndex ] = useState('');
    const handleChange = (e) => {
        setSelection(options[e.target.value]);
        setSelectionIndex(e.target.value)
    }
    const submitSelection = (e) => {
        e.preventDefault();
        handleSubmit(selection);
    }
    return (
        <form onSubmit={submitSelection}>
            <select value={selectionIndex} onChange={handleChange} name={label}>
                {placeholder ? <option value='none' defaultValue hidden>{placeholder}</option> : '' }
                {options && options.map((opt, index) => {
                    return <option key={index} value={index}>{opt.name}</option>;
                })}
            </select>
            <input type='submit' value='Save'/>
        </form>
    )
}