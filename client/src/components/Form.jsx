import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postRecipe, getDiets } from '../redux/actions.js';
import styles from '../cssModuleStyles/form.module.css'

const Form = () => {
    const dispatch = useDispatch();
    const diets = useSelector(state => state.diets);
    console.log('diets:', diets)

    const [formData, setFormData] = useState({
        name: '',
        image: '',
        steps: [{ number: 1, step: '' }],
        diets: [],
        resume: '',
        healthScore: '',
    });

    const [stepsAdded, setStepsAdded] = useState(false)

    useEffect(() => {
        if (formData.steps.length > 0) {
            setStepsAdded(true);
        }
    }, [formData.steps]);

    useEffect(() => {
        dispatch(getDiets());
    }, [dispatch]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleStepsChange = (e, index) => {
        const newSteps = [...formData.steps];
        if (newSteps.length === 0 && index === 0) {
            newSteps.push({ number: 1, step: '' });
        }
        newSteps[index] = { ...newSteps[index], step: e.target.value };
        setFormData({
            ...formData,
            steps: newSteps.map((step, i) => ({ ...step, number: i + 1 })),
        });
    };





    const handleDietsChange = (e) => {
        const dietId = Number(e.target.value);
        const isChecked = e.target.checked;
        let newDiets = [...formData.diets];
        if (isChecked) {
            newDiets.push(dietId);
        } else {
            newDiets = newDiets.filter((id) => id !== dietId);
        }
        setFormData({
            ...formData,
            diets: newDiets,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(postRecipe(formData));
        setFormData({
            name: '',
            image: '',
            steps: [],
            diets: [],
            resume: '',
            healthScore: '',
        });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.campo}>
                <label htmlFor="name" className={styles.label}>Nombre</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.input}
                />
            </div>
            <div className={styles.campo}>
                <label htmlFor="image" className={styles.label}>Imagen</label>
                <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className={styles.input}
                />
            </div>
            <div className={styles.campo}>
                <label htmlFor="resume" className={styles.label}>Resumen</label>
                <textarea
                    id="resume"
                    name="resume"
                    rows={3}
                    value={formData.resume}
                    onChange={handleInputChange}
                    className={styles.textarea}
                />
            </div>
            <div className={styles.campo}>
                <label htmlFor="healthScore" className={styles.label}>Calificación de salud</label>
                <input
                    type="number"
                    id="healthScore"
                    name="healthScore"
                    value={formData.healthScore}
                    onChange={handleInputChange}
                    className={styles.input}
                />
            </div>
            <div className={styles.campo}>
                <label htmlFor="steps">Pasos</label>
                <div>
                    <input
                        type="number"
                        value={formData.steps.length > 0 ? formData.steps[0].number : ''}
                        readOnly
                    />
                    <input
                        type="text"
                        value={formData.steps.length > 0 ? formData.steps[0].step : ''}
                        onChange={(e) => handleStepsChange(e, 0)}
                    />
                </div>
                {formData.steps.slice(1).map((step, index) => (
                    <div key={index + 1}>
                        <input
                            type="number"
                            value={step.number}
                            readOnly
                        />
                        <input
                            type="text"
                            value={step.step}
                            onChange={(e) => handleStepsChange(e, index + 1)}
                        />
                    </div>
                ))}
                <button type="button" onClick={() => setFormData({ ...formData, steps: [...formData.steps, { number: formData.steps.length + 1, step: ' ' }] })}>
                    Agregar paso
                </button>
            </div>


            <div className={styles.campo}>
                <label>Dieta</label>
                {diets.map((diet) => (
                    <label key={diet.id}>
                        <input
                            type="checkbox"
                            value={diet.id}
                            checked={formData.diets.includes(diet.id)}
                            onChange={handleDietsChange}
                        />
                        {diet.name}
                    </label>
                ))}
            </div>

            <button type="submit">Agregar Receta</button>
        </form>


    );
};

export default Form;