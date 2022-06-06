class MetadataField {
    constructor(name, value){
        this.id = '';
        this.field = name;
        this.value = value;
    }
}

class Metadata {
    constructor(){
        this.map = {};
    }
    addNew = async (field, value, fileId=null) => {
        const metadata = new MetadataField(field, value);
        const metadataId = await window.Database.saveMetadataIfNotExists(field, value, fileId);
        metadata.id = metadataId;
        this.add(metadata);
    }
    add = (metadata) => {
        if (Array.isArray(metadata)){
            for (const data of metadata){
                this.map[data.field] = data;
            }
        } else {
            this.map[metadata.field] = metadata;
        }
    }
    ingestMetadataFields = (fields) => {
        for (const field of fields){
            this.addNew(field.field_name, field.field_value);
        }
    }
    byField = (field) => {
        if (this.map[field]) {
            return this.map[field];
        }
        return undefined;
    }
    byValue = (value) => {
        for (const data of Object.values(this.map)){
            if (data.value === value) return data;
        }
        return undefined;
    }
    value = (field) => {
        const metadata = this.byField(field);
        return metadata.value;
    }
    getAll = () => Object.values(this.map);
    getAllEntries = () => Object.entries(this.map);
}

module.exports = {
    Metadata: Metadata,
    MetadataField: MetadataField
}