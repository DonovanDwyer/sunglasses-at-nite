export default class TagModel {   
    constructor(){
        this.id = null;
        this.name = null;
    }

    // Create a tag record
    saveTagRecord = async (name) => {
        const result = await window.videoApi.saveTag(name);
        console.log(result);
        this.name = name;
    }

    // Associate tag with video
    saveTagAssociation = async (videoId) => {
        const existingTag = await this.findTagAssociation(videoId, this.id);
        if (existingTag.length > 0) {
            return existingTag;
        } else {
            const result = await window.videoApi.createTagVideoAssociation(videoId, this.id);
            console.log(result);
            return result;
        }
    }

    findTagAssociation = async (videoId) => {
        const result = await window.videoApi.queryTagAssociation(videoId, this.id);
        console.log(result);
        return result;
    }

    // Find one or more tag records by query
    findTagByDetails = async (detailName, detailValue) => {
        const result = await window.videoApi.queryTag(detailName, detailValue);
        this.name = result[0].name;
        this.id = result[0].id;
        return result;
    }

    // Find all tag records
    getAllTags = async () => {
        const result = await window.videoApi.queryTag();
        return result;
    }

    // Update tag record
    updateTag = (updateField, updateValue, tagDetail, tagValue) => {
        // Call to sqlite3 select function
        // Call to sqlite3 update function
    }

    // Delete tag record
    deleteTag = async (tagDetail, tagValue) => {
        const result = await window.videoApi.deleteTag(tagDetail, tagValue);
        console.log(result);
        return result;
    }
    deleteTagAssociation = async (tagDetail, tagValue) => {
        const result = await window.videoApi.deleteTagAssociation(tagDetail, tagValue);
        console.log(result);
        return result;
    }
}