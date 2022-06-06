import { useState } from 'react';
import InputField from '../InputField/InputField';

export default function InputContainer({ fields, onSubmit, submitLabel  }){
    const [ values, updateValues ] = useState({});
    const update = (e) => {
        const { id, value } = e.target;
        updateValues({
            ...values,
            [id]: value
        });
    }
    const submit = (e) => {
        e.preventDefault();
        onSubmit(values);
    }
    return <form onSubmit={submit} data-testid='form'>
        {fields.map((field) => {
            return <InputField 
                key={field.label} 
                label={field.label} 
                hideLabel={field.hideLabel ? true : false}
                placeholder={field.placeholder} 
                onChange={update} 
            />
}       )}
        {<input type='submit' value={ submitLabel }></input>}
    </form>
}