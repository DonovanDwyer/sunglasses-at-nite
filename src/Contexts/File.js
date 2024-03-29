import { useState, useEffect, createContext } from 'react';
import { File } from '../Models/File';

export const FileContext = createContext({
    files: []
});

const FileProvider = ({ children }) => {
    const [ files, setFiles ] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            let dir;
            if (window.navigator.appVersion.includes('Windows')){
                dir = "E:\\The Big Guns\\torrents";
            } else {
                dir = '/Users/donovandwyer/Downloads';
            }
            window.FileSystem.watch(dir);
            window.FileSystem.setTypes(['videos']);
            const files = await window.FileSystem.sync();
            const fileHandler = new File();
            const arr = [];
            for (const f of files){
                let file = await fileHandler.getFileData(f.path, f.metadata);
                arr.push(file);
            }
            setFiles(arr);
        }
        fetchFiles();
    }, []);
    const context = { files };
    return <FileContext.Provider value={context}>{children}</FileContext.Provider>;
};

export default FileProvider;