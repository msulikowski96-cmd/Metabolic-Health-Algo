import React, { useState } from 'react';

const MealPlannerScreen = () => {
    const [mealPlan, setMealPlan] = useState([]);
    const foodDatabase = [
        { id: 1, name: 'Chicken Breast', macros: { protein: 31, fat: 3.6, carbs: 0 } },
        { id: 2, name: 'Brown Rice', macros: { protein: 2.6, fat: 0.9, carbs: 23 } },
        { id: 3, name: 'Broccoli', macros: { protein: 2.8, fat: 0.4, carbs: 6.6 } },
        { id: 4, name: 'Eggs', macros: { protein: 6.3, fat: 5.3, carbs: 0.6 } },
        { id: 5, name: 'Salmon', macros: { protein: 25, fat: 13, carbs: 0 } },
        { id: 6, name: 'Sweet Potato', macros: { protein: 2, fat: 0.2, carbs: 20.2 } },
        { id: 7, name: 'Almonds', macros: { protein: 21, fat: 49, carbs: 22 } },
        { id: 8, name: 'Greek Yogurt', macros: { protein: 10, fat: 4, carbs: 6 } },
        { id: 9, name: 'Banana', macros: { protein: 1.3, fat: 0.3, carbs: 27 } },
        { id: 10, name: 'Oats', macros: { protein: 13, fat: 6.9, carbs: 66 } },
        { id: 11, name: 'Spinach', macros: { protein: 2.9, fat: 0.4, carbs: 3.6 } },
        { id: 12, name: 'Quinoa', macros: { protein: 4.1, fat: 1.9, carbs: 21 } },
        { id: 13, name: 'Tofu', macros: { protein: 8, fat: 4.8, carbs: 1.9 } },
        { id: 14, name: 'Berries', macros: { protein: 1, fat: 0.3, carbs: 14 } },
        { id: 15, name: 'Pasta', macros: { protein: 5, fat: 1.1, carbs: 29 } }
    ];

    const addMeal = (foodItem) => {
        setMealPlan([...mealPlan, foodItem]);
    };

    const calculateMacros = () => {
        return mealPlan.reduce((totals, item) => {
            totals.protein += item.macros.protein;
            totals.fat += item.macros.fat;
            totals.carbs += item.macros.carbs;
            return totals;
        }, { protein: 0, fat: 0, carbs: 0 });
    };

    return (
        <div>
            <h1>Meal Planner</h1>
            <h2>Add Meals</h2>
            {foodDatabase.map(item => (
                <button key={item.id} onClick={() => addMeal(item)}>{item.name}</button>
            ))}
            <h3>Selected Meals</h3>
            <ul>
                {mealPlan.map((item, index) => (<li key={index}>{item.name}</li>))}
            </ul>
            <h3>Total Macros</h3>
            <div>
                Protein: {calculateMacros().protein}g<br />
                Fat: {calculateMacros().fat}g<br />
                Carbs: {calculateMacros().carbs}g
            </div>
        </div>
    );
};

export default MealPlannerScreen;