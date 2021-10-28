
import {useState, useEffect} from "react";


// eslint-disable-next-line
function getStorageValue(key: string, defaultValue: any) {
    // get the stored value
    const saved = String(localStorage.getItem(key));
    const initial = saved!== null ? JSON.parse(saved) : defaultValue;
    return initial || defaultValue;

}


// eslint-disable-next-line
export const useLocalStorage = (key: string, defaultValue: any) => {
    
    const [value, setValue] = useState( ()=> {
        return getStorageValue(key, defaultValue);
    });

    useEffect(() => {
        
        // storing input name
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

export default useLocalStorage;