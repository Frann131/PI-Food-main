import React from "react"
import { Link } from 'react-router-dom';

import styles from '../cssModuleStyles/landing.module.css'
export default function Landing() {
    return (
        <div className={`${styles.landing} ${styles['landing-container']}`}>
            <h1 className={styles.title}>PI-Food</h1>
            <h1 className={styles.name}>Franco Mindurry</h1>
            <h2 className={styles.description}>Comidas saludables para tu día a día</h2>
            <Link to='/home'>
                <button className={styles.homeButton}>Ir al home</button>
            </Link>
        </div>
    )
}