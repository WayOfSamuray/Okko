import { useState, type ChangeEvent } from "react"

export const useSearch = (initial: string = '') => {
    const [query, setQuery] = useState<string>(initial);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const resetSearch = () => {
        setQuery('');
    }
    return {
        query, setQuery, handleChange, resetSearch
    };
};