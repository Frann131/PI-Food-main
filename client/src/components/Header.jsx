import React from "react";
import styles from '../cssModuleStyles/header.module.css'
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
export default function Header(props) {
    return (
        <div className={styles.header}>
            <Link to='/' style={{textDecoration: 'none'}}>
                <div className={styles.headTitle}>
                    Healthy Food
                </div>
            </Link>
            <div>
                <SearchBar />
            </div>
            <div>
                <Link to='/recipes/new'>
                    <button className={styles.addBtn}> Add recipe</button>
                </Link>
            </div>
            <div>
                <Link to='/home'>
                    <button className={styles.addBtn}>Home</button>
                </Link>
            </div>
        </div>
    )
}