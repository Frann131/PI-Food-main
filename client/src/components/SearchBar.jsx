import React, { useState } from "react";
import { useHistory } from 'react-router-dom'
import styles from '../cssModuleStyles/searchBar.module.css'
import lupa from '../img/lupa blanca.svg'

export default function SearchBar(props) {
    const [searchValue, setSearchValue] = useState('');
    const history = useHistory()

    const handleSearch = () => {
        history.push(`/recipes?name=${searchValue}`);
        setSearchValue('');
    }

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    }
    
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }
    return (
        <div className={styles.searchBar}>
            <input
                className={styles.searchInput}
                type="search"
                name="search"
                autoComplete="off"
                placeholder=""
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <button className={styles.searchBttn} onClick={handleSearch}>
                <img className={styles.lupa} src={lupa} alt='' />
            </button>
        </div>
    )
}