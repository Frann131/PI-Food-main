import React from "react";
import styles from '../cssModuleStyles/searchBar.module.css'
import lupa from '../img/lupa blanca.svg'

export default function SearchBar(props) {
    return (    
        <div className={styles.searchBar}>
            <input 
            className={styles.searchInput} 
            type="search" 
            name="search" 
            autoComplete="off" 
            placeholder=""/>
            <button className={styles.searchBttn} onClick=''>
                <img className={styles.lupa} src={lupa} alt=''/>
            </button>
        </div>
    )
}