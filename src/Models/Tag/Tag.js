export default class Tag {
    constructor(name){
        this.id = null;
        if (typeof(name) === 'undefined') throw new Error('Tag must have a name');
        this.name = name;
        this.associations = [];
    }

    saveTagData = async () => {
        const id = await window.Database.saveTagIfNotExists(this.name);
        this.id = id;
    }

    saveAssociation = async (fileId) => {
        const res = await window.Database.saveFileTagIfNotExists(fileId, this.id);
    }

    saveAndApplyTo = async (data) => {
        if (Array.isArray(data)){
            for (const file of data){
                this.associations.push(file);
                file.tags.push(this);
                await this.saveTagData();
                await this.saveAssocation(file.id);
            }
        } else {
            this.associations.push(data);
            data.tags.push(this);
            await this.saveTagData();
            this.saveAssociation(data.id);
        }
    }
    applyTo = async (data) => {
        if (Array.isArray(data)){
            for (const file of data){
                this.associations.push(file);
                file.tags.push(this);
            }
        } else {
            this.associations.push(data);
            data.tags.push(this);
        }
    }
}