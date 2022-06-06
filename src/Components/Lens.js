import React, { useState, useEffect } from 'react';
import '../Styling/Lens.css';

export default function Lens(props){
    return <VideoGallery setSelected={props.setSelected} selected={props.selected} videos={props.videos} />;
}

function VideoGallery(props){
    const [ ctrlPressed, setCtrlPress ] = useState(false);

    useEffect(() => {
        function handleKeyDown(e){
            if (e.key === 'Meta') setCtrlPress(true);
        }
        function handleKeyUp(e){
            if (e.key === 'Meta') setCtrlPress(false);
        }
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        }
    }, []);

    function handleSelection(id){
        if (ctrlPressed){
            if (props.selected.includes(id)) {
                const newArray = props.selected.filter(el => el !== id);
                props.setSelected(newArray);
            } else {
                const newArray = [...props.selected];
                newArray.push(id);
                props.setSelected(newArray);
            }
        } else {
            if (!props.selected.length === 1 || props.selected[0] !== id){
                props.setSelected([id]);
            } else {
                props.setSelected([]);
            }
        }
    }

    function checkSelection(id){
        return props.selected.includes(id);
    }

    useEffect(() => {
        function outsideClick(e){
            const gallery = document.querySelector('div.lens');
            if (e.target === gallery && !ctrlPressed){
                props.setSelected([]);
            }
        }
        document.addEventListener('mousedown', outsideClick);
        return () => {
            document.removeEventListener('mousedown', outsideClick);
        }
    }, []);

    return (
        <ul className="gallery">
            {
                props.videos.map(video => {
                    return <ThumbnailImage 
                        id={video.id}
                        title={video.title}
                        height={video.height}
                        width={video.width}
                        isSelected={checkSelection}
                        handleSelection={handleSelection}
                        src={video.thumbnailSrc} 
                        key={video.id} 
                        path={video.filepath}
                        save={video.saveVideo}
                        find={video.findVideoByDetails}
                    />
                })
            }
        </ul>
    );
}

function ThumbnailImage(props){
    function handleDblClick(path){
        window.videoApi.playVideo(path);
    }
    return <li 
            className={props.isSelected(props.id) ? "selected" : ""}
            onClick={() => props.handleSelection(props.id)}
            onDoubleClick={() => handleDblClick(props.path)}
            >
        <div className="thumbnail-text-wrapper">
            <div className="image-container">
                <img src={props.src} height={props.height} width={props.width} alt="" />
            </div>
            <p>{props.title}</p>
        </div>
    </li>;
}

