import { useState, useEffect } from 'react';
import TagModel from '../Models/TagModel';
import VideoModel from '../Models/VideoModel';
import '../Styling/LeftTemple.css';

export default function LeftTemple(props){
    const [activeTags, setActiveTags] = useState([]);
    const [activeTagAssociations, setActiveTagAssociations] = useState([]);
    const [showApply, setShowApply] = useState(false);
    const [instantUpdateMode, toggleInstantUpdateMode] = useState(true);
    const [addTagMode, toggleAddTagMode] = useState(false);
    const tagModel = new TagModel();

    useEffect(() => {
        function checkTagAssociations(){
            const array = [];
            for (const videoId of props.selected){
                const video = props.videos.find(video => video.id === videoId);
                if (video) {
                    for (const tagId of video.tags){
                        const association = activeTags.find(id => id === tagId);
                        if (association) array.push({videoId: videoId, tagId: association});
                    }
                }
            }
            setActiveTagAssociations(array);
        }
        function handleApplyConfig(){
            if (props.selected.length > 0 && activeTags.length > 0 && !instantUpdateMode){
                setShowApply(true);
            } else {
                setShowApply(false);
            }
        }
        function handleInstantUpdateMode(){
            if (props.selected.length === 0) {
                toggleInstantUpdateMode(true);
            } else {
                toggleInstantUpdateMode(false);
            }
        }
        checkTagAssociations();
        handleApplyConfig();
        handleInstantUpdateMode();
        updateActiveTags();
    }, [props.selected, activeTags]);
    function saveTag(name){
        const newTagModel = new TagModel();
        newTagModel.saveTagRecord(name);
    }
    function setTag(action, value){
        if (action === 'ADD_TAG'){
            setActiveTags([...activeTags, value]);
        } else if (action === 'REMOVE_TAG') {
            setActiveTags(activeTags.filter(tag => tag !== value));
        }
    }
    async function applyActiveTagsToVideoSelection(){
        for (const tagName of activeTags){
            await tagModel.findTagByDetails('id', tagName);
            for (const videoId of props.selected){
                const videoModel = new VideoModel();
                await videoModel.findVideoByDetails('id', videoId);
                await tagModel.saveTagAssociation(videoId);
            }
        }
    }
    async function updateActiveTags(){
        const newList = [];
        for (const video of props.videos){
            if (video.tags.some(id => activeTags.includes(id))){
                newList.push(video);
            }
        }
        let isEmpty;
        if (activeTags.length > 0 && newList.length === 0){
            isEmpty = true;
        } else {
            isEmpty = false;
        }
        props.updateVideoList(isEmpty ? ["EMPTY"] : newList);
    }
    async function deleteTags(){
        for (const tagId of activeTags){
            tagModel.deleteTag('id', tagId);
            setActiveTags(activeTags.filter(id => id !== tagId));
        }
    }
    async function deleteActiveTagAssociations(){
        for (const association of activeTagAssociations){
            let res = await tagModel.deleteTagAssociation(association.videoId, association.tagId);
            console.log(res);
        }
    }
    function handleAddNewTag(){
        toggleAddTagMode(!addTagMode);
    }
    return (
        <div className="left-temple-container">
            <TagList setTag={setTag} 
                activeTags={activeTags} 
                handleAddNewTag={handleAddNewTag} 
                saveTag={saveTag}
                addTagMode={addTagMode}
            />
            {
                showApply? 
                    <button onClick={applyActiveTagsToVideoSelection}>Apply</button> 
                    :
                    ""
            }
            {
                activeTags.length > 0 ?
                    <button onClick={deleteTags}>Delete</button> 
                    :
                    ""
            }
            {activeTagAssociations.length > 0 ? <button onClick={deleteActiveTagAssociations}>Unset Tag</button> : ""}
        </div>
    );
}

function TagList(props){
    const [tags, setTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);

    useEffect(() => {
        async function asyncGet(){
            let tagModel = new TagModel()
            let tagList = await tagModel.getAllTags();
            tagList.sort((a,b) => a.name.localeCompare(b.name));
            setTags(tagList);
            setFilteredTags(tagList);
        }
        asyncGet();
    }, []);

    function filterTags(entry){
        setFilteredTags(tags.filter(tag => tag.name.toLowerCase().includes(entry.toLowerCase())));
    }
    return (
        <div className="tag-list">
            <div className="active-tag-display">
                {props.activeTags.length == 0 ? <span className="inactive-tag"></span> : props.activeTags.map(id => {
                    return <ActiveTagDisplay key={id} tagName={tags.find(tag => tag.id == id).name} />
                })}
            </div>
            <div className="new-tag-section">
                {props.addTagMode ? <UserInput save={props.saveTag}/> : <Search tags={filteredTags} filterTags={filterTags}/>} 
                <button className={props.addTagMode ? "add-new-tag form-button" : "add-new-tag"} onClick={props.handleAddNewTag}>
                    {props.addTagMode ? "Cancel" : "+"}
                </button>
            </div>
            {filteredTags.map(tag => <Tag id={tag.id} key={tag.id} name={tag.name} setTag={props.setTag}/>)}
        </div>
    )
}

function ActiveTagDisplay(props){
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        let animateTimeout = setTimeout(() => setAnimate(false), 10);
        return () => clearTimeout(animateTimeout);
    }, []);

    return <span className={animate ? "active-tag animate" : "active-tag"}>{props.tagName}</span>
}

function Search(props){
    const [value, setValue] = useState("");

    useEffect(() => {
        props.filterTags(value);
    }, [value]);

    function handleChange(e){
        setValue(e.target.value);
    }

    return (
        <input type="text" placeholder="Search for Tags..." value={value} onChange={handleChange} />
    )
}

function UserInput(props) {
    const [data, setData] = useState("");

    function handleChange(event){
        setData(event.target.value);
    }
    function handleSubmit(event){
        event.preventDefault();
        props.save(data);
    }
    return (
        <form onSubmit={handleSubmit}>
            <input 
                value={data}
                placeholder="Enter Tag Name"
                onChange={handleChange}
            />
            <button className="form-button" type="submit">Save</button>
        </form>
    );
}

function Tag(props){
    const [isEnabled, toggleTag] = useState(false);
    
    useEffect(() => {
        props.setTag(isEnabled ? 'ADD_TAG' : 'REMOVE_TAG', props.id);
    }, [isEnabled])

    function handleClick(){
        toggleTag(!isEnabled);
    }

    return (
        <button className={ isEnabled ? "tag active" : "tag" } onClick={handleClick}>
            {props.name}
        </button>
    );
}