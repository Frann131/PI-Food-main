import React from "react";
import styles from '../cssModuleStyles/header.module.css'
import SearchBar from "./SearchBar";

export default function Header(props) {
    return (
        <div className={styles.header}>
            <div className={styles.headTitle}>
                Healthy Food
            </div>
            <div>
                <SearchBar />
            </div>
            <div>
                <button className={styles.addBtn}> Add recipe</button>
            </div>
        </div>
    )
}