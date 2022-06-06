import { File } from '../File';

export default class Category {
    constructor(name){
        if (typeof name === 'undefined') {
            throw new Error('Categories must have names');
        }
        this.id = null;
        this.name = name;
        this.parent = null;
        this.children = [];
        this.data = [];
    }
    appendChild = (category) => {
        if (Array.isArray(category)){
            for (const item of category){
                this.errorCheckCategory(item);
                this.children.push(item);
            }
        } else {
            this.errorCheckCategory(category);
            this.children.push(category);
        }
    }
    addData = (data) => {
        if (Array.isArray(data)){
            for (const item of data){
                this.data.push(item);
            }
        } else {
            this.data.push(data);
        }
    }
    errorCheckCategory = (data) => {
        if (!(data instanceof Category)) throw new Error('Only categories can be appended as children');
    }
    saveCategory = async () => {
        let res = await window.Database.saveCategoryIfNotExists(this.name, this.parent);
        this.id = res;
    }
    saveAssociatedFiles = async () => {
        for (const file of this.data){
            await window.Database.saveCategoryFilesIfNotExists(this.id, file.id);
        }
    }
    saveParentCategory = async () => {
        await window.Database.saveChildCategoryIfNotExists(this.parent, this.id);
    }
    saveAll = async () => {
        await this.saveCategory();
        await this.saveParentCategory();
    }
    getRootCategories = async () => {
        const res = await window.Database.getCategoryByParent(null);
        let newRes = res.map(cat => {
            let category = new Category(cat.name);
            category.id = cat.id;
            return category
        });
        return newRes;
    }
    getChildren = async () => {
        const res = await window.Database.getCategoryChildren(this.id);
        let newRes = res.map(cat => {
            let category = new Category(cat.name);
            category.id = cat.id;
            category.parent = cat.parent_id;
            return category;
        });
        this.children = newRes;
    }
    getData = async () => {
        const res = await window.Database.getCategoryFiles(this.id);
        let arr = [];
        for (const fileData of res){
            let file = new File();
            file = file.applyFileData(fileData);
            arr.push(file);
        }
        this.data = arr;
    }
}