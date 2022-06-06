import { useState, useEffect } from 'react';
import { title, whitespace } from 'electron-folder/Components/UtilityFunctions/UtilityFunctions.js';
import { Tag } from '../../Models/Tag';
import { InputContainer } from '../InputContainer';
import { Select } from '../Select';
import { Category } from '../../Models/Category';

export default function DetailPane({ file, update }){
    const [ showFieldInput, toggleFieldInput ] = useState(false);
    const [ showTagInput, toggleTagInput ] = useState(false);
    const [ showCatSelect, toggleCatSelect ] = useState(false);
    const [ categories, setCategories ] = useState([]);
    // Update this once CTRL hotkey is implemented
    file = file[0];
    const addNewField = (valueObj) => {
        toggleFieldInput(!showFieldInput);
        let newFile = {...file};
        newFile.add(valueObj['Field Name'], valueObj['Field Value']);
        update([newFile]);
    }
    const addNewTag = (valueObj) => {
        toggleTagInput(!showTagInput);
        const model = new Tag(valueObj['Tag Name']);
        file.saveAndApplyTag(model);
    }
    const generateCategorySelect = async () => {
        const cat = new Category('null');
        let roots = await cat.getRootCategories();
        setCategories(roots);
    }
    const addFileToCategory = async (category) => {
        category.addData(file);
        await category.saveAssociatedFiles();
        toggleCatSelect(!showCatSelect);
    }
    return (
        <>
            {file && file.metadata.getAll().map((metadata,i) => {
                return <div key={metadata.field}>{title(whitespace(metadata.field))}: {metadata.value}</div>
            })}
            {showFieldInput ? <><InputContainer 
                fields={[
                    {
                        label: 'Field Name',
                        placeholder: 'Enter Field Name',
                        hideLabel: true
                    },
                    {
                        label: 'Field Value',
                        placeholder: 'Enter Field Value',
                        hideLabel: true
                    }
                ]} 
                submitLabel={'Save'}
                onSubmit={addNewField}
                 /><button onClick={() => toggleFieldInput(!showFieldInput)}>Cancel</button></> : ''}
            {!showFieldInput && file ? <button onClick={() => toggleFieldInput(!showFieldInput)}>New Field</button> : ''}
            {file && file.tags ? (
                <div>Tags : {file.tags.map((tag) =>  <p key={tag.name}>{tag.name}</p>)}</div>
            ) : (
                ""
            )}
            {showTagInput ? <><InputContainer 
                fields={[{
                    label: 'Tag Name',
                    placeholder: 'Enter Tag Name',
                    hideLabel: true
                 }]} 
                submitLabel={'Save'}
                onSubmit={addNewTag}
                 /><button onClick={() => toggleTagInput(!showTagInput)}>Cancel</button></> : ''}
            {!showTagInput && file ? <button onClick={() => toggleTagInput(!showTagInput)}>New Tag</button> : ''}
            {showCatSelect ? <><Select 
                options={categories} 
                label='What the hell' 
                placeholder='Select a Category'
                handleSubmit={addFileToCategory}
            /><button onClick={() => toggleCatSelect(!showCatSelect)}>Cancel</button></> : ''}
            {!showCatSelect && file ? <button onClick={() => {
                toggleCatSelect(!showCatSelect);
                generateCategorySelect();
            }}>Add to Category</button> : ''}
        </>
    );
}