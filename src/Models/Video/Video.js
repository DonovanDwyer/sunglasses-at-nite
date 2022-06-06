import { Metadata } from '../Metadata/Metadata';

export default class Video {
    constructor(data){
        this.id = '';
        this.metadata = new Metadata();
        this.tags = [];
        if (data !== undefined){
            this.generateMetadata(data);
        }
    }
    add = (fieldName, value) => {
        this.metadata.addNew(fieldName, value);
    }
    applyTag = (tag) => {
        if (Array.isArray(tag)){
            for (const t of tag){
                t.applyTo(this);
            }
        } else {
            tag.applyTo(this);
        }
    }
    generateMetadata = (dataObject) => {
        for (const [key, value] of Object.entries(dataObject)){
            this.add(key, value);
        }
    }
}