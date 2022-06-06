import '../Styling/App.css';
import { useState } from 'react';
import { FileList, FileListWithContext } from './FileList';
import { CategoryList } from './CategoryList';
import FileProvider from '../Contexts/File';

function App() {
  const [ categoryMode, toggleCategoryMode ] = useState(false);
  const handleToggle = () => {
    toggleCategoryMode(!categoryMode);
  }
  return (
    <FileProvider>
      <button onClick={handleToggle}>Switch to {categoryMode ? "File" : "Category"} Mode</button>
      { categoryMode ? <CategoryList /> : <FileListWithContext /> }
    </FileProvider>
  );
}

export default App;
