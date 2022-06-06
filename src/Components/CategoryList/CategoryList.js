import { useState, useEffect } from 'react';
import { InputContainer } from '../InputContainer';
import Category from '../../Models/Category/Category';
import { FileList } from '../FileList';

function CategoryItem({ category }){
    const [ showInput, toggleShowInput ] = useState(false);
    const [ isFurled, toggleFurl ] = useState(true);
    const handleShowInput = () => toggleShowInput(!showInput);
    const handleUnfurling = async () => {
        if (isFurled) await category.getChildren();
        await category.getData();
        toggleFurl(!isFurled);
    }
    const addChildCategory = (valueObj) => {
        const child = new Category(valueObj['Category Name']);
        child.parent = category.id;
        category.appendChild(child);
        child.saveAll();
        handleShowInput();
    }
    return (
        <>
            <div>
                <span onClick={handleUnfurling}>{category.name}</span>
                {isFurled ? ''  : (
                    <div>
                        {showInput ? <><InputContainer fields={[
                            {
                                label: 'Category Name',
                                placeholder: 'Enter category name',
                                hideLabel: true
                            }
                        ]}
                        submitLabel={'Save'}
                        onSubmit={addChildCategory}/>
                        <button onClick={handleShowInput}>Cancel</button>
                        </> : <button onClick={handleShowInput}>Add Subcategory</button>}
                        <ul>
                            {<FileList files={category.data} />}
                        </ul>
                        <ul>
                            {category.children.map((category,i) => <li key={i}><CategoryItem category={category} /></li>)}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

export default function CategoryList(){
    const [ showInput, toggleShowInput ] = useState(false);
    const [ categories, updateCategories ] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const cat = new Category('null');
            const roots = await cat.getRootCategories();
            updateCategories(roots);
        }
        fetchCategories();
    },[]);

    const handleShowInput = () => toggleShowInput(!showInput);
    const addRootCategory = (valueObj) => {
        const category = new Category(valueObj['Category Name']);
        category.parent = null;
        category.saveAll();
        let newCats = [...categories, category];
        updateCategories(newCats);
        handleShowInput();
    }
    return (
        <>
            {showInput ? <><InputContainer fields={[
                {
                    label: 'Category Name',
                    placeholder: 'Enter category name',
                    hideLabel: true
                }
            ]}
            submitLabel={'Save'}
            onSubmit={addRootCategory} /><button onClick={handleShowInput}>Cancel</button></> : <button onClick={handleShowInput}>New Category</button>}
            <ul>
                {
                    categories && categories.map((category,i) => <CategoryItem key={i} category={category} />)
                }
            </ul>
        </>
    );
}