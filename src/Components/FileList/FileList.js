import { useContext, useState } from 'react';
import { FileContext } from '../../Contexts/File';
import { DetailPane } from '../DetailPane';

function ListItem({ file, columns, selection, isSelected }){
    const selectStyle = { backgroundColor: 'red' };
    return (
        <li
            onClick={() => selection(file)}
            style={isSelected ? selectStyle : {}}
        >
            {columns.map((col, i) => <span key={i}>
                    { col === 'file_path' ? file.filePath : ( 
                        file.metadata.byField(col)?.value ? file.metadata.byField(col).value : 'N/A'
                    )}
                </span>
            )}
        </li>
    );
}

export function FileList({ overrideDefaultColumns, files }){
    const [ selectedFiles, updateSelectedFiles ] = useState([]);
    const columns = overrideDefaultColumns ? overrideDefaultColumns : [ 'file_name', 'file_size', 'file_path' ];
    const handleSelection = (file) => {
        let updatedSelection;
        if (selectedFiles.includes(file)){
            updatedSelection = selectedFiles.filter(f => f !== file);
        } else {
            // Update this when CTRL hotkey is implemented
            updatedSelection = [ file ];
        }
        updateSelectedFiles(updatedSelection);
    }
    const handleUpdate = (newFiles) => {
        updateSelectedFiles(newFiles);
    }
    return (
        <>
            <ul>
                {columns.map((col,i) => <span key={i}>{col}</span>)}
                {files.map((file, i) => {
                    return <ListItem 
                        key={file.filePath} 
                        selection={handleSelection}
                        isSelected={selectedFiles.includes(file)}
                        file={file} 
                        columns={columns}
                    />
                })}
            </ul>
            {selectedFiles.length > 0 ? <DetailPane file={selectedFiles} update={handleUpdate}/> : ''}
        </>
    );
}

export function FileListWithContext(){
    const { files } = useContext(FileContext);
    return <FileList files={files} />;
}