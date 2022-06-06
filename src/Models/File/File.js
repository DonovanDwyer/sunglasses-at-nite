import { Metadata } from '../Metadata';
import { Tag } from '../Tag';

export default class File {
    constructor(data){
        this.id = null;
        this.filePath = '';
        this.metadata = ''
        this.tags = [];
        if (data !== undefined){
            this.metadata = new Metadata();
            this.generateMetadata(data);
        }
    }
    add = (fieldName, value) => {
        this.metadata.addNew(fieldName, value, this.id);
    };
    saveAndApplyTag = (tag) => {
        if (Array.isArray(tag)){
            for (const t of tag){
                t.saveAndApplyTo(this);
            }
        } else {
            tag.saveAndApplyTo(this);
        }
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
            if (key === 'file_path') {
                this.filePath = value;
            } else {
                this.add(key, value);
            }
        }
    }
    getFileData = async (dir, metadata) => {
        const fileData = await window.Database.getFileData(dir, metadata);
        return this.applyFileData(fileData);
    }
    applyFileData = (fileData) => {
        const file = new File();
        file.id = fileData.id;
        file.filePath = fileData.path;
        file.metadata = new Metadata();
        file.metadata.ingestMetadataFields(fileData.metadata);
        for (const t of fileData.tags){
            let tag = new Tag(t.tag_name);
            tag.id = t.id;
            file.applyTag(tag);
        }
        return file;
    }
    saveFileData = async () => {
        this.id = await window.Database.saveFileIfNotExists('file_path', this.filePath);
        const metadata = this.metadata.getAllEntries();
        for (const [fieldName, MetadataField] of metadata){
            const metadataId = await window.Database.saveMetadataIfNotExists(fieldName, MetadataField.value, this.id);
            MetadataField.id = metadataId;
        }
    }
}