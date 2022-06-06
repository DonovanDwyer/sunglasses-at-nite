import React from 'react';
import VideoModel from '../Models/VideoModel';
import Lens from './Lens';
import LeftTemple from './LeftTemple';
import BrowBar from './BrowBar';
import '../Styling/LensFrame.css';

export class VideoController extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            videos: [],
            fullVideoList: [],
            selected: []
        };
    }
    async componentDidMount(){
        const videos = await this.serializeVideoFiles();
        this.setState({ 
            videos: videos,
            fullVideoList: videos
        });
    }

    searchVideoFiles = () => window.videoApi.runFileSearch();
    captureThumbnail = (path, duration) => window.videoApi.captureThumbnail(path, duration);

    serializeVideoFiles = async () => {
        // Get Videos from DB
        const videoDB = new VideoModel();
        let videosFromDB = await videoDB.getAllVideos();
        videosFromDB = videosFromDB.map(video => {
            const videoDBObj = new VideoModel()
            videoDBObj.convertDBRecordToObject(video);
            return videoDBObj;
        });
        const truncDBList = videosFromDB.map(video => video.filepath);

        // Get Videos from File System
        const videos = this.searchVideoFiles();
        const videosFromLocal = [];

        // Compare FS videos to DB videos, adding
        // any missing videos to DB
        for (const videoPath of videos){
            const videoModel = new VideoModel();
            const {error, stdout} = await window.videoApi.getVideoMetadata(videoPath);
            if (error) console.error(error);
            const metadata = JSON.parse(stdout);
            let timecode = new Date((metadata.format.duration / 3) * 1000).toISOString().substr(11, 8);
            this.captureThumbnail(videoPath, timecode);
            videoModel.convertFileToObject(videoPath, JSON.parse(stdout));
            if (!truncDBList.includes(videoModel.filepath)) {
                console.log("Saving video...");
                videoModel.saveVideo();
            }
            videosFromLocal.push(videoModel);
        }
        return videosFromDB;
    }

    updateVideoList = (newVideoList) => {
        if (newVideoList.length === 0){
            this.setState({ videos: this.state.fullVideoList });   
        } else {
            if (newVideoList.length === 1 && newVideoList[0] === "EMPTY"){
                this.setState({ videos: [] });
            } else {
                this.setState({ videos: newVideoList });
            }
        }
    }
    setSelected = (selected) => { this.setState({ selected: selected }) }

    render = () => {
        return (
            <div className="lens-frame">
                <div className="brow-bar">
                    <BrowBar 
                        videos={this.state.videos}
                        updateVideoList={this.updateVideoList}
                    />
                </div>
                <div className="left-temple">
                    <LeftTemple 
                        videos={this.state.videos}
                        selected={this.state.selected}
                        updateVideoList={this.updateVideoList}
                    />
                </div>
                <div className="lens">
                    <Lens 
                        videos={this.state.videos} 
                        setSelected={this.setSelected} 
                        selected={this.state.selected}
                    />
                </div>
            </div>
        )
    }
}