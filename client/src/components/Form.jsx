import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postRecipe, getDiets } from '../redux/actions.js';
import styles from '../cssModuleStyles/form.module.css'

const Form = () => {
    const dispatch = useDispatch();
    const diets = useSelector(state => state.diets);
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [disableAddStep, setDisableAddStep] = useState(true)
    const [postStatus, setPostStatus] = useState({})
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

    useEffect(() => {
        const nameRegex = /^[a-zA-Z.,\s]*$/;
        if (formData.name.trim().length > 10 && formData.name.trim().length < 100 &&
            /\.(gif|jpe?g|png)$/i.test(formData.image) &&
            (formData.image.startsWith('https://') || formData.image.startsWith('http://')) &&
            formData.image.trim().length > 0 &&
            formData.resume.trim().length > 50 && formData.resume.trim().length < 1200 &&
            formData.healthScore >= 0 && formData.healthScore < 100 &&
            formData.steps.every(step => step.step.trim().length > 0 && step.step.trim().length < 400) &&
            nameRegex.test(formData.name.trim())) {
            setDisableSubmit(false);
        } else {
            setDisableSubmit(true);
        }
    }, [formData]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleRecipeNameChange = (event) => {
        const value = event.target.value;
        const valueLength = value.trim().length
        const nameRegex = /^[a-zA-Z.,\s]*$/;
        const validCharacters = nameRegex.test(formData.name.trim())
        if (valueLength > 10 && valueLength < 100 && validCharacters) {
            event.target.style.backgroundColor = '#fff'
        } else {
            event.target.style.backgroundColor = '#fcc'

        }
    };



    const handleImageChange = (event) => {
        const value = event.target.value;
        const isValidImage = /\.(gif|jpe?g|png)$/i.test(value);
        const isHttps = value.startsWith('https://')
        const isHttp = value.startsWith('http://')
        if (!isValidImage || (!isHttps && !isHttp) || value.length === 0) {
            event.target.style.backgroundColor = '#fcc'

        } else {
            event.target.style.backgroundColor = '#fff'

        }
    };

    const handleSummaryChange = (event) => {
        const value = event.target.value;
        const valueLength = value.trim().length;
        if (valueLength > 50 && valueLength < 1200) {

            event.target.style.backgroundColor = '#fff'
        } else {
            ;
            event.target.style.backgroundColor = '#fcc'
        }
    };

    const handleHealthScoreChange = (event) => {
        const value = event.target.value;
        if (value >= 0 && value < 100) {

            event.target.style.backgroundColor = '#fff'
        } else {

            event.target.style.backgroundColor = '#fcc'
        }
    };

    const handleStepsChange = (e, index) => {
        const newSteps = [...formData.steps];
        const stepValue = e.target.value;
        const stepLength = stepValue.length;
      
        if (stepLength > 0 && stepLength < 400) {
          setDisableAddStep(false);
          e.target.style.backgroundColor = "#fff";
          newSteps[index] = { ...newSteps[index], step: stepValue };
          setFormData({
            ...formData,
            steps: newSteps.map((step, i) => ({ ...step, number: i + 1 })),
          });
        } else if (stepValue === "") {
          setDisableAddStep(true);
          e.target.style.backgroundColor = "#fcc";
        } else if (stepValue.length === 1) {
          newSteps[index] = { ...newSteps[index], step: stepValue };
          setFormData({
            ...formData,
            steps: newSteps.map((step, i) => ({ ...step, number: i + 1 })),
          });
        } else {
          setDisableAddStep(true);
          e.target.style.backgroundColor = "#fcc";
        }
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

    const handleCombinedHealthScoreChange = (event) => {
        handleHealthScoreChange(event);
        handleInputChange(event);
    }
    const handleCombinedImageChange = (event) => {
        handleImageChange(event)
        handleInputChange(event)
    }
    const handleCombinedNameChange = (event) => {
        handleRecipeNameChange(event);
        handleInputChange(event)
    }
    const handleCombinedSummaryChange = (event) => {
        handleSummaryChange(event);
        handleInputChange(event)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await dispatch(postRecipe(formData));
        setPostStatus(response.data)
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
                <label htmlFor="name" className={styles.label}>Recipe name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleCombinedNameChange}
                    className={styles.input}
                    placeholder='Example: Full Vegan Burger (10-100 characters)'
                    autoComplete='off'
                />
            </div>
            <div className={styles.campo}>
                <label htmlFor="image" className={styles.label}>Image (URL)</label>
                <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleCombinedImageChange}
                    className={styles.input}
                    placeholder='Example: https://www.foodimages-example.com/image/vegan_burger.jpg (Must be JPG/JPEG/PNG/GIF)'
                    autoComplete='off'
                />
            </div>
            <div className={styles.campo}>
                <label htmlFor="resume" className={styles.label}>Summary</label>
                <textarea
                    id="resume"
                    name="resume"
                    rows={3}
                    value={formData.resume}
                    onChange={handleCombinedSummaryChange}
                    className={styles.textarea}
                    placeholder='Enter recipe summary (50-1200 characters)'
                />
            </div>
            <div className={styles.campo}>
                <label htmlFor="healthScore" className={styles.label}>Health Score</label>
                <input
                    type="number"
                    id="healthScore"
                    name="healthScore"
                    value={formData.healthScore}
                    onChange={handleCombinedHealthScoreChange}
                    className={styles.input}
                    placeholder='It has to be a value between 0 and 100'
                    autoComplete='off'
                />
            </div>
            <div className={styles.campoSteps}>
                <label className={styles.label} htmlFor="steps">Steps</label>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', textAlign: 'center' }}>
                        <p style={{ border: '2px solid grey', width: '28px', borderRadius: '50%' }}>{formData.steps.length > 0 ? formData.steps[0].number : '' + '°'}</p>
                        <input
                            type="number"
                            value={formData.steps.length > 0 ? formData.steps[0].number : '' + '°'}
                            readOnly
                            className={styles.stepNumber}
                            style={{ display: 'none' }}
                        />
                        <input
                            type="text"
                            value={formData.steps.length > 0 ? formData.steps[0].step : ''}
                            onChange={(e) => handleStepsChange(e, 0)}
                            className={styles.stepInput}
                            placeholder='First step...'
                            autoComplete='off'
                        />
                    </div>
                </div>
                {formData.steps.slice(1).map((step, index) => (
                    <div key={index + 1}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', textAlign: 'center' }}>
                            <p style={{ border: '2px solid grey', width: '28px', borderRadius: '50%' }} >{step.number}</p>
                            <input
                                type="number"
                                value={step.number}
                                readOnly
                                className={styles.stepNumber}
                                style={{ display: 'none' }}
                            />
                            <input
                                type="text"
                                value={step.step}
                                onChange={(e) => handleStepsChange(e, index + 1)}
                                className={styles.stepInput}
                                autoComplete='off'
                            />
                        </div>
                    </div>
                ))}
                <button disabled={disableAddStep} className={styles.button} type="button" onClick={() => setFormData({ ...formData, steps: [...formData.steps, { number: formData.steps.length + 1, step: ' ' }] })}>
                    Add step
                </button>
            </div>


            <div className={styles.campo}>
                <label>Diets</label>
                {diets.map((diet) => (
                    <label key={diet.id} className={styles.dietItem}>
                        <input
                            type="checkbox"
                            value={diet.id}
                            checked={formData.diets.includes(diet.id)}
                            onChange={handleDietsChange}
                            className={styles.check}
                        />
                        {diet.name}
                    </label>
                ))}
            </div>

            <button style={{fontSize: '1.2rem'}} className={styles.button} type="submit" disabled={disableSubmit}>Post recipe</button>
            <div className={postStatus.success ? styles.success : styles.error}>
                {postStatus.success ? postStatus.success : postStatus.error}
            </div>

        </form>


    );
};

export default Form;