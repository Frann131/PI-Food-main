import React from "react";
import { Link } from "react-router-dom";
import styles from '../cssModuleStyles/Card.module.css'

export default function Card(props) {
    const capitalDiets = props.diets.map((diet) => {
        return diet.charAt(0).toUpperCase() + diet.slice(1)
    })
    const healthScore = props.healthScore;
    const healthScoreColor = `hsl(${120 * healthScore / 100}, 100%, 50%)`
    return (
        <Link to={`/recipes/${props.id}`} style={{ color: '#000000', textDecoration: 'none' }}>
            <div className={styles.card}>
                <p className={styles.title}>{props.name}</p>
                <div className={styles.image}>
                    <img src={props.image} alt="" />
                </div>
                <div className={styles.diets}>
                    <b>{'Dietas: '}</b>
                    {capitalDiets.join(', ') + '.'}
                </div>
                <div className={styles.cirContainer}>
                    <div className={styles.circular} style={{ '--healthScore-color': healthScoreColor }}>
                        <p className={styles.score}>{healthScore}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}