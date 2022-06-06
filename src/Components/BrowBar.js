import { useState, useEffect } from 'react';

export default function BrowBar(props) {
    const [selected, setSelected] = useState('title');

    useEffect(() => {
        const sort = (sortValue, sortObjects) => {
            if (sortObjects.length === 0){
                return;
            }
            switch (sortValue) {
                case 'title':
                    props.updateVideoList(sortObjects.sort((a,b) => a.title.localeCompare(b.title)));
                    break;
                case 'titleDesc':
                    props.updateVideoList(sortObjects.sort((a,b) => -1 * a.title.localeCompare(b.title)));
                    break;
                case 'size':
                    props.updateVideoList(sortObjects.sort((a,b) => a.filesize-b.filesize));
                    break;
                case 'sizeDesc':
                    props.updateVideoList(sortObjects.sort((a,b) => b.filesize-a.filesize));
                    break;
                case 'length':
                    props.updateVideoList(sortObjects.sort((a,b) => a.duration-b.duration));
                    break;
                case 'lengthDesc':
                    props.updateVideoList(sortObjects.sort((a,b) => b.duration-a.duration));
                    break;
                case 'resolution':
                    props.updateVideoList(sortObjects.sort((a,b) => a.height-b.height));
                    break;
                case 'resolutionDesc':
                    props.updateVideoList(sortObjects.sort((a,b) => b.height-a.height));
                    break;
                default:
                    console.log('Exiting sort function without taking action')
            }
        }
        sort(selected, props.videos);
    }, [selected, props.videos])

    const options = [
        { value: 'title', label: 'Title' },
        { value: 'size', label: 'Filesize' },
        { value: 'length', label: 'Length'},
        { value: 'resolution', label: 'Resolution' }
    ];
    const handleSubmit = (value) => {
        if (selected === value){
            setSelected(value + 'Desc');
        } else {
            setSelected(value);
        }
    }
    return (
        <div className="brow-bar">
            <div className="logo">B@n</div>
            <DropDown 
                options={options} 
                title="Sort by" 
                selected={selected} 
                handleSubmitExternal={handleSubmit} 
                submitButtonText="Update"
            />
        </div>
    );
}

function DropDown(props){
    const [current, setCurrent] = useState(props.selected);

    function handleChange(e){
        e.preventDefault();
        setCurrent(e.target.value);
    }
    function handleSubmit(e, value){
        e.preventDefault();
        props.handleSubmitExternal(value);
    }
    return (
        <form onSubmit={(e) => handleSubmit(e, current)}>
            <label>
                {props.title}
                <select value={current} onChange={handleChange}>
                    {props.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </label>
            <input type="submit" value={props.submitButtonText}/>
        </form>
    );
}