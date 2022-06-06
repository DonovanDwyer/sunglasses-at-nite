import { useState, useEffect, useContext } from 'react';

export const CategoryContext = createContext({
    files: []
});

const CategoryProvider = ({ children }) => {
    const [ files, setFiles ] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            
        }
    })
}