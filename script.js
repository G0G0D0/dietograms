document.getElementById('sedentary').addEventListener('click', () => {
    resetForm();
    showForm('sedentary');
});

document.getElementById('active').addEventListener('click', () => {
    resetForm();
    showForm('active');
});

document.querySelectorAll('#height, #weight, #gender, #meals').forEach(input => {
    input.addEventListener('input', () => {
        if (isFormFilled()) {
            calculateAndShowMeals();
        }
    });
});

document.getElementById('generate-plan').addEventListener('click', (e) => {
    e.preventDefault();
    showLoadingPage();
});

document.getElementById('download-plan').addEventListener('click', showAdModal);
document.getElementById('download-free-plan').addEventListener('click', downloadPlan);

document.getElementById('explore-2000').addEventListener('click', () => generatePlan('2000'));
document.getElementById('explore-2500').addEventListener('click', () => generatePlan('2500'));
document.getElementById('explore-3000').addEventListener('click', () => generatePlan('3000'));
document.getElementById('explore-3500').addEventListener('click', () => generatePlan('3500'));

let activityLevel = '';
let maintenanceCalories = 0;
let calorieCategory = '2000';

function resetForm() {
    document.getElementById('diet-form').reset();
    document.getElementById('form-container').classList.add('hidden');
    document.getElementById('meal-options').classList.add('hidden');
    document.getElementById('north-indian').classList.add('hidden');
    document.getElementById('south-indian').classList.add('hidden');
    document.getElementById('active-meals').classList.add('hidden');
    document.getElementById('diet-plan').classList.add('hidden');
    document.getElementById('explore-more').classList.add('hidden');
    document.querySelectorAll('.meal-select').forEach(select => {
        select.innerHTML = '';
    });
}

function showForm(level) {
    activityLevel = level;
    document.getElementById('form-container').classList.remove('hidden');
    document.getElementById('meal-options').classList.add('hidden');
    document.getElementById('north-indian').classList.add('hidden');
    document.getElementById('south-indian').classList.add('hidden');
    document.getElementById('active-meals').classList.add('hidden');
}

function isFormFilled() {
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const gender = document.getElementById('gender').value;
    const meals = document.getElementById('meals').value;
    return height && weight && gender && meals;
}

function calculateAndShowMeals() {
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const gender = document.getElementById('gender').value;

    maintenanceCalories = calculateCalories(height, weight, gender);
    if (maintenanceCalories < 2000) {
        maintenanceCalories = 2000;
    } else if (maintenanceCalories > 3500) {
        maintenanceCalories = 3500;
    }

    if (maintenanceCalories > 3200) {
        calorieCategory = '3500';
    } else if (maintenanceCalories > 2700) {
        calorieCategory = '3000';
    } else if (maintenanceCalories > 2200) {
        calorieCategory = '2500';
    } else {
        calorieCategory = '2000';
    }

    updateMealOptions();
    document.getElementById('meal-options').classList.remove('hidden');
}

function updateMealOptions() {
    const northBreakfastSelect = document.getElementById('north-breakfast-select');
    const northSnack1Select = document.getElementById('north-snack1-select');
    const northLunchSelect = document.getElementById('north-lunch-select');
    const northSnack2Select = document.getElementById('north-snack2-select');
    const northDinnerSelect = document.getElementById('north-dinner-select');

    const southBreakfastSelect = document.getElementById('south-breakfast-select');
    const southSnack1Select = document.getElementById('south-snack1-select');
    const southLunchSelect = document.getElementById('south-lunch-select');
    const southSnack2Select = document.getElementById('south-snack2-select');
    const southDinnerSelect = document.getElementById('south-dinner-select');

    const activeBreakfastSelect = document.getElementById('active-breakfast-select');
    const activeSnack1Select = document.getElementById('active-snack1-select');
    const activeLunchSelect = document.getElementById('active-lunch-select');
    const activeSnack2Select = document.getElementById('active-snack2-select');
    const activeDinnerSelect = document.getElementById('active-dinner-select');

    const numberOfMeals = document.getElementById('meals').value;

    if (activityLevel === 'sedentary') {
        document.getElementById('north-indian').classList.remove('hidden');
        document.getElementById('south-indian').classList.remove('hidden');

        northBreakfastSelect.innerHTML = getOptions('north', 'breakfast', numberOfMeals);
        northSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('north', 'snack1', numberOfMeals) : '';
        northLunchSelect.innerHTML = getOptions('north', 'lunch', numberOfMeals);
        northSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('north', 'snack2', numberOfMeals) : '';
        northDinnerSelect.innerHTML = getOptions('north', 'dinner', numberOfMeals);

        southBreakfastSelect.innerHTML = getOptions('south', 'breakfast', numberOfMeals);
        southSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('south', 'snack1', numberOfMeals) : '';
        southLunchSelect.innerHTML = getOptions('south', 'lunch', numberOfMeals);
        southSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('south', 'snack2', numberOfMeals) : '';
        southDinnerSelect.innerHTML = getOptions('south', 'dinner', numberOfMeals);

        toggleVisibility(northSnack1Select, numberOfMeals >= 4);
        toggleVisibility(northSnack2Select, numberOfMeals == 5);
        toggleVisibility(southSnack1Select, numberOfMeals >= 4);
        toggleVisibility(southSnack2Select, numberOfMeals == 5);
    } else {
        document.getElementById('active-meals').classList.remove('hidden');

        activeBreakfastSelect.innerHTML = getOptions('active', 'breakfast', numberOfMeals);
        activeSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('active', 'snack1', numberOfMeals) : '';
        activeLunchSelect.innerHTML = getOptions('active', 'lunch', numberOfMeals);
        activeSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('active', 'snack2', numberOfMeals) : '';
        activeDinnerSelect.innerHTML = getOptions('active', 'dinner', numberOfMeals);

        toggleVisibility(activeSnack1Select, numberOfMeals >= 4);
        toggleVisibility(activeSnack2Select, numberOfMeals == 5);
    }

    document.getElementById('generate-plan').classList.remove('hidden');
}

function toggleVisibility(element, isVisible) {
    if (isVisible) {
        element.classList.remove('hidden');
        element.previousElementSibling.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
        element.previousElementSibling.classList.add('hidden');
    }
}

function getOptions(type, meal, numberOfMeals) {
    const options = {
        '2000': {
            'north': {
                '3': {
                    'breakfast': [
                        "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
                        "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
                        "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
                        "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
                        "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
                    ],
                    'lunch': [
                        "Paneer Butter Masala (1 cup) + Naan (2)",
                        "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
                        "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
                        "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
                        "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
                    ],
                    'dinner': [
                        "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
                        "Baingan Bharta (1 cup) + Chapati (2)",
                        "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
                        "Paneer Bhurji (1 cup) + Paratha (2)",
                        "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
                    ]
                },
                '4': {
                    'breakfast': [
                        "Aloo Paratha (1) + Curd (1/2 cup) + Mango Pickle (1 tablespoon)",
                        "Chole (1/2 cup) + Bhature (1) + Salad (1/2 bowl)",
                        "Paneer Tikka (100 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
                        "Rajma (1 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
                        "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1/2 small serving)"
                    ],
                    'snack1': [
                        "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
                        "Mixed Nuts (1/4 cup) + Apple (1)",
                        "Granola Bar (1) + Orange (1)",
                        "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
                        "Smoothie (1 cup) + Banana (1)"
                    ],
                    'lunch': [
                        "Paneer Butter Masala (1/2 cup) + Naan (1)",
                        "Aloo Gobhi (1/2 cup) + Chapati (1) + Boondi Raita (1 cup)",
                        "Chicken Curry (1/2 cup) + Rice (1/2 cup) + Mixed Vegetable Salad (1 bowl)",
                        "Palak Paneer (1/2 cup) + Jeera Rice (1 cup)",
                        "Mutton Rogan Josh (1/2 cup) + Tandoori Roti (1)"
                    ],
                    'dinner': [
                        "Dal Tadka (1/2 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
                        "Baingan Bharta (1/2 cup) + Chapati (1)",
                        "Chicken Tikka (100 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
                        "Paneer Bhurji (1/2 cup) + Paratha (1)",
                        "Kadhai Paneer (1/2 cup) + Jeera Rice (1/2 cup)"
                    ]
                },
                '5': {
                    'breakfast': [
                        "Aloo Paratha (1/2) + Curd (1/3 cup) + Mango Pickle (1 tablespoon)",
                        "Chole (1/3 cup) + Bhature (1) + Salad (1/3 bowl)",
                        "Paneer Tikka (50 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
                        "Rajma (1/2 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
                        "Dal Makhani (1/2 cup) + Naan (1) + Carrot Halwa (1/3 small serving)"
                    ],
                    'snack1': [
                        "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
                        "Mixed Nuts (1/8 cup) + Apple (1/2)",
                        "Granola Bar (1/2) + Orange (1/2)",
                        "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
                        "Smoothie (1/2 cup) + Banana (1/2)"
                    ],
                    'lunch': [
                        "Paneer Butter Masala (1/3 cup) + Naan (1)",
                        "Aloo Gobhi (1/3 cup) + Chapati (1) + Boondi Raita (1 cup)",
                        "Chicken Curry (1/3 cup) + Rice (1/3 cup) + Mixed Vegetable Salad (1 bowl)",
                        "Palak Paneer (1/2 cup) + Jeera Rice (1/2 cup)",
                        "Mutton Rogan Josh (1/3 cup) + Tandoori Roti (1)"
                    ],
                    'snack2': [
                        "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
                        "Mixed Nuts (1/8 cup) + Apple (1/2)",
                        "Granola Bar (1/2) + Orange (1/2)",
                        "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
                        "Smoothie (1/2 cup) + Banana (1/2)"
                    ],
                    'dinner': [
                        "Dal Tadka (1/3 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
                        "Baingan Bharta (1/3 cup) + Chapati (1)",
                        "Chicken Tikka (70 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
                        "Paneer Bhurji (1/3 cup) + Paratha (1)",
                        "Kadhai Paneer (1/3 cup) + Jeera Rice (1/2 cup)"
                    ]
                }
            },
            'south': {
                '3': {
                    'breakfast': [
                        "Dosa (2) + chutney (50 grams) + banana (1)",
                        "Idli (3) + Sambar (1 cup) + Coconut Chutney (50 grams)",
                        "Upma (1 cup) + Curd (1 cup) + Papaya (1 slice)",
                        "Pongal (1 cup) + Coconut Chutney (50 grams) + Orange (1)",
                        "Masala Dosa (1) + Sambar (1 cup) + Mango (1 slice)"
                    ],
                    'lunch': [
                        "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
                        "Fish Curry (1 cup) + Rice (1 cup) + Veg Poriyal (1 bowl)",
                        "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
                        "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
                        "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
                    ],
                    'dinner': [
                        "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
                        "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
                        "Vegetable Biryani (1 cup) + Raita (1 cup)",
                        "Avial (1 cup) + Rice (1 cup) + Appalam (2)",
                        "Egg Curry (1 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
                    ]
                },
                '4': {
                    'breakfast': [
                        "Dosa (1) + chutney (50 grams) + banana (1)",
                        "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
                        "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
                        "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
                        "Masala Dosa (1) + Sambar (1/2 cup) + Mango (1/2 slice)"
                    ],
                    'snack1': [
                        "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
                        "Mixed Nuts (1/4 cup) + Apple (1)",
                        "Granola Bar (1) + Orange (1)",
                        "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
                        "Smoothie (1 cup) + Banana (1)"
                    ],
                    'lunch': [
                        "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
                        "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
                        "Lemon Rice (1/2 cup) + Coconut Chutney (25 grams) + Curd (1/2 cup)",
                        "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
                        "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
                    ],
                    'dinner': [
                        "Pesarattu (1) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
                        "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
                        "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
                        "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
                        "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
                    ]
                },
                '5': {
                    'breakfast': [
                        "Dosa (1) + chutney (25 grams) + banana (1)",
                        "Idli (1) + Sambar (1/3 cup) + Coconut Chutney (25 grams)",
                        "Upma (1/3 cup) + Curd (1/3 cup) + Papaya (1 slice)",
                        "Pongal (1/3 cup) + Coconut Chutney (25 grams) + Orange (1/2)",
                        "Masala Dosa (1) + Sambar (1/3 cup) + Mango (1/2 slice)"
                    ],
                    'snack1': [
                        "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
                        "Mixed Nuts (1/8 cup) + Apple (1/2)",
                        "Granola Bar (1/2) + Orange (1/2)",
                        "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
                        "Smoothie (1/2 cup) + Banana (1/2)"
                    ],
                    'lunch': [
                        "Sambar Rice (1/3 cup) + Papad (1) + Curd (1/3 cup)",
                        "Fish Curry (1/3 cup) + Rice (1/2 cup) + Veg Poriyal (1/3 bowl)",
                        "Lemon Rice (1/3 cup) + Coconut Chutney (25 grams) + Curd (1/3 cup)",
                        "Rasam (1 cup) + Rice (1/2 cup) + Beetroot Thoran (1 bowl)",
                        "Chicken Chettinad (1/2 cup) + Rice (1/3 cup) + Cucumber Raita (1 cup)"
                    ],
                    'snack2': [
                        "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
                        "Mixed Nuts (1/8 cup) + Apple (1/2)",
                        "Granola Bar (1/2) + Orange (1/2)",
                        "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
                        "Smoothie (1/2 cup) + Banana (1/2)"
                    ],
                    'dinner': [
                        "Pesarattu (1) + Coconut Chutney (25 grams) + Tomato Chutney (25 grams)",
                        "Curd Rice (1/3 cup) + Pickle (1 tablespoon) + Papad (1)",
                        "Vegetable Biryani (1/3 cup) + Raita (1 cup)",
                        "Avial (1/2 cup) + Rice (1/2 cup) + Appalam (1)",
                        "Egg Curry (1/2 cup) + Rice (1/2 cup) + Spinach Poriyal (1/2 bowl)"
                    ]
                }
            },
            'active': {
                '3': {
                    'breakfast': [
                        "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
                        "Greek Yogurt (1 cup) + Blueberries (1/2 cup)",
                        "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
                        "Smoothie (Banana, Spinach, Almond Milk)",
                        "Avocado Toast (1 slice) + Poached Egg (1)"
                    ],
                    'lunch': [
                        "Grilled Chicken Salad + Quinoa (1 cup)",
                        "Turkey Sandwich on Whole Wheat + Carrot Sticks",
                        "Lentil Soup (1 cup) + Mixed Green Salad",
                        "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
                        "Vegetable Stir Fry + Tofu (1 cup)"
                    ],
                    'dinner': [
                        "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
                        "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
                        "Beef Stir Fry + Mixed Vegetables (1 cup)",
                        "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
                        "Pasta with Marinara Sauce + Meatballs (3)"
                    ]
                },
                '4': {
                    'breakfast': [
                        "Oatmeal (3/4 cup) + Almonds (8) + Apple (1)",
                        "Greek Yogurt (3/4 cup) + Blueberries (1/3 cup)",
                        "Scrambled Eggs (2) + Whole Wheat Toast (1 slice)",
                        "Smoothie (Banana, Spinach, Almond Milk)",
                        "Avocado Toast (1 slice) + Boiled Egg (1)"
                    ],
                    'snack1': [
                        "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
                        "Mixed Nuts (1/4 cup) + Apple (1)",
                        "Granola Bar (1) + Orange (1)",
                        "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
                        "Smoothie (1 cup) + Banana (1)"
                    ],
                    'lunch': [
                        "Grilled Chicken Salad + Quinoa (3/4 cup)",
                        "Turkey Sandwich on Whole Wheat + Celery Sticks",
                        "Lentil Soup (3/4 cup) + Mixed Green Salad",
                        "Salmon (3/4 fillet) + Brown Rice (3/4 cup) + Broccoli (3/4 cup)",
                        "Vegetable Stir Fry + Tofu (3/4 cup)"
                    ],
                    'dinner': [
                        "Baked Cod (3/4 fillet) + Sweet Potato (3/4) + Asparagus (3/4 cup)",
                        "Chicken Breast (3/4) + Couscous (3/4 cup) + Green Beans (3/4 cup)",
                        "Beef Stir Fry + Mixed Vegetables (3/4 cup)",
                        "Quinoa Bowl + Black Beans (3/4 cup) + Corn (3/4 cup)",
                        "Pasta with Marinara Sauce + Meatballs (2)"
                    ]
                },
                '5': {
                    'breakfast': [
                        "Oatmeal (1/2 cup) + Almonds (5) + Apple (1/2)",
                        "Greek Yogurt (1/2 cup) + Blueberries (1/4 cup)",
                        "Scrambled Eggs (1) + Whole Wheat Toast (1 slice)",
                        "Smoothie (Banana, Spinach, Almond Milk)",
                        "Avocado Toast (1 slice)"
                    ],
                    'snack1': [
                        "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
                        "Mixed Nuts (1/8 cup) + Apple (1/2)",
                        "Granola Bar (1/2) + Orange (1/2)",
                        "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
                        "Smoothie (1/2 cup) + Banana (1/2)"
                    ],
                    'lunch': [
                        "Grilled Chicken Salad + Quinoa (1/2 cup)",
                        "Turkey Sandwich on Whole Wheat + Cucumber Slices",
                        "Lentil Soup (1/2 cup) + Mixed Green Salad",
                        "Salmon (1/2 fillet) + Brown Rice (1/2 cup) + Broccoli (1/2 cup)",
                        "Vegetable Stir Fry + Tofu (1/2 cup)"
                    ],
                    'snack2': [
                        "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
                        "Mixed Nuts (1/8 cup) + Apple (1/2)",
                        "Granola Bar (1/2) + Orange (1/2)",
                        "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
                        "Smoothie (1/2 cup) + Banana (1/2)"
                    ],
                    'dinner': [
                        "Baked Cod (1/2 fillet) + Sweet Potato (1/2) + Asparagus (1/2 cup)",
                        "Chicken Breast (1/2) + Couscous (1/2 cup) + Green Beans (1/2 cup)",
                        "Beef Stir Fry + Mixed Vegetables (1/2 cup)",
                        "Quinoa Bowl + Black Beans (1/2 cup) + Corn (1/2 cup)",
                        "Pasta with Marinara Sauce + Meatballs (1)"
                    ]
                }
            }
        },

        '2500': {
            'north': {
                '3': {
                    'breakfast': [
                        "Aloo Paratha (3) + Curd (1.5 cup) + Mango Pickle (1.5 tablespoon)",
                        "Chole (1.5 cup) + Bhature (3) + Salad (1.5 bowl)",
                        "Paneer Tikka (300 grams) + Green Chutney (3 tablespoons) + Mixed Veg Raita (1.5 cup)",
                        "Rajma (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
                        "Dal Makhani (1.5 cup) + Naan (1.5) + Carrot Halwa (1.5 small serving)"
                    ],
                    'lunch': [
                        "Paneer Butter Masala (1.5 cup) + Naan (3)",
                        "Aloo Gobhi (1.5 cup) + Chapati (3) + Boondi Raita (1.5 cup)",
                        "Chicken Curry (1.5 cup) + Rice (1.5 cup) + Mixed Vegetable Salad (1.5 bowl)",
                        "Palak Paneer (1.5 cup) + Jeera Rice (1.5 cup)",
                        "Mutton Rogan Josh (1.5 cup) + Tandoori Roti (3)"
                    ],
                    'dinner': [
                        "Dal Tadka (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
                        "Baingan Bharta (1.5 cup) + Chapati (3)",
                        "Chicken Tikka (300 grams) + Mint Chutney (3 tablespoons) + Salad (1.5 bowl)",
                        "Paneer Bhurji (1.5 cup) + Paratha (3)",
                        "Kadhai Paneer (1.5 cup) + Jeera Rice (1.5 cup)"
                    ]
                },
                '4': {
                    'breakfast': [
                        "Aloo Paratha (1.5) + Curd (0.75 cup) + Mango Pickle (0.75 tablespoon)",
                        "Chole (0.75 cup) + Bhature (1.5) + Salad (0.75 bowl)",
                        "Paneer Tikka (150 grams) + Green Chutney (1.5 tablespoons) + Mixed Veg Raita (0.75 cup)",
                        "Rajma (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
                        "Dal Makhani (0.75 cup) + Naan (0.75) + Carrot Halwa (0.75 small serving)"
                    ],
                    'snack1': [
                        "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
                        "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
                        "Granola Bar (1.5) + Orange (1.5)",
                        "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
                        "Smoothie (1.5 cup) + Banana (1.5)"
                    ],
                    'lunch': [
                        "Paneer Butter Masala (0.75 cup) + Naan (1.5)",
                        "Aloo Gobhi (0.75 cup) + Chapati (1.5) + Boondi Raita (0.75 cup)",
                        "Chicken Curry (0.75 cup) + Rice (0.75 cup) + Mixed Vegetable Salad (0.75 bowl)",
                        "Palak Paneer (0.75 cup) + Jeera Rice (0.75 cup)",
                        "Mutton Rogan Josh (0.75 cup) + Tandoori Roti (1.5)"
                    ],
                    'dinner': [
                        "Dal Tadka (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
                        "Baingan Bharta (0.75 cup) + Chapati (1.5)",
                        "Chicken Tikka (150 grams) + Mint Chutney (1.5 tablespoons) + Salad (0.75 bowl)",
                        "Paneer Bhurji (0.75 cup) + Paratha (1.5)",
                        "Kadhai Paneer (0.75 cup) + Jeera Rice (0.75 cup)"
                    ]
                },
                '5': {
                    'breakfast': [
                        "Aloo Paratha (0.75) + Curd (0.375 cup) + Mango Pickle (0.375 tablespoon)",
                        "Chole (0.375 cup) + Bhature (0.75) + Salad (0.375 bowl)",
                        "Paneer Tikka (75 grams) + Green Chutney (0.75 tablespoons) + Mixed Veg Raita (0.375 cup)",
                        "Rajma (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
                        "Dal Makhani (0.375 cup) + Naan (0.75) + Carrot Halwa (0.375 small serving)"
                    ],
                    'snack1': [
                        "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
                        "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
                        "Granola Bar (0.75) + Orange (0.75)",
                        "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
                        "Smoothie (0.75 cup) + Banana (0.75)"
                    ],
                    'lunch': [
                        "Paneer Butter Masala (0.375 cup) + Naan (0.75)",
                        "Aloo Gobhi (0.375 cup) + Chapati (0.75) + Boondi Raita (0.375 cup)",
                        "Chicken Curry (0.375 cup) + Rice (0.375 cup) + Mixed Vegetable Salad (0.375 bowl)",
                        "Palak Paneer (0.375 cup) + Jeera Rice (0.375 cup)",
                        "Mutton Rogan Josh (0.375 cup) + Tandoori Roti (0.75)"
                    ],
                    'snack2': [
                        "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
                        "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
                        "Granola Bar (0.75) + Orange (0.75)",
                        "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
                        "Smoothie (0.75 cup) + Banana (0.75)"
                    ],
                    'dinner': [
                        "Dal Tadka (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
                        "Baingan Bharta (0.375 cup) + Chapati (0.75)",
                        "Chicken Tikka (75 grams) + Mint Chutney (0.75 tablespoons) + Salad (0.375 bowl)",
                        "Paneer Bhurji (0.375 cup) + Paratha (0.75)",
                        "Kadhai Paneer (0.375 cup) + Jeera Rice (0.375 cup)"
                    ]
                }
            },
            'south': {
                '3': {
                    'breakfast': [
                        "Dosa (3) + chutney (75 grams) + banana (1.5)",
                        "Idli (4.5) + Sambar (1.5 cup) + Coconut Chutney (75 grams)",
                        "Upma (1.5 cup) + Curd (1.5 cup) + Papaya (1.5 slice)",
                        "Pongal (1.5 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
                        "Masala Dosa (1.5) + Sambar (1.5 cup) + Mango (1.5 slice)"
                    ],
                    'lunch': [
                        "Sambar Rice (1.5 cup) + Papad (3) + Curd (1.5 cup)",
                        "Fish Curry (1.5 cup) + Rice (1.5 cup) + Veg Poriyal (1.5 bowl)",
                        "Lemon Rice (1.5 cup) + Coconut Chutney (75 grams) + Curd (1.5 cup)",
                        "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (1.5 bowl)",
                        "Chicken Chettinad (1.5 cup) + Rice (1.5 cup) + Cucumber Raita (1.5 cup)"
                    ],
                    'dinner': [
                        "Pesarattu (3) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
                        "Curd Rice (1.5 cup) + Pickle (1.5 tablespoon) + Papad (3)",
                        "Vegetable Biryani (1.5 cup) + Raita (1.5 cup)",
                        "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (3)",
                        "Egg Curry (1.5 cup) + Rice (1.5 cup) + Spinach Poriyal (1.5 bowl)"
                    ]
                },
                '4': {
                    'breakfast': [
                        "Dosa (1.5) + chutney (75 grams) + banana (1.5)",
                        "Idli (3) + Sambar (0.75 cup) + Coconut Chutney (75 grams)",
                        "Upma (0.75 cup) + Curd (0.75 cup) + Papaya (1.5 slice)",
                        "Pongal (0.75 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
                        "Masala Dosa (1.5) + Sambar (0.75 cup) + Mango (0.75 slice)"
                    ],
                    'snack1': [
                        "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
                        "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
                        "Granola Bar (1.5) + Orange (1.5)",
                        "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
                        "Smoothie (1.5 cup) + Banana (1.5)"
                    ],
                    'lunch': [
                        "Sambar Rice (0.75 cup) + Papad (1.5) + Curd (0.75 cup)",
                        "Fish Curry (0.75 cup) + Rice (1.5 cup) + Veg Poriyal (0.75 bowl)",
                        "Lemon Rice (0.75 cup) + Coconut Chutney (0.375 grams) + Curd (0.75 cup)",
                        "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (0.75 bowl)",
                        "Chicken Chettinad (0.75 cup) + Rice (0.75 cup) + Cucumber Raita (0.75 cup)"
                    ],
                    'dinner': [
                        "Pesarattu (1.5) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
                        "Curd Rice (0.75 cup) + Pickle (0.75 tablespoon) + Papad (1.5)",
                        "Vegetable Biryani (0.75 cup) + Raita (1.5 cup)",
                        "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (1.5)",
                        "Egg Curry (0.75 cup) + Rice (1.5 cup) + Spinach Poriyal (0.75 bowl)"
                    ]
                },
                '5': {
                    'breakfast': [
                        "Dosa (0.75) + chutney (37.5 grams) + banana (1.5)",
                        "Idli (1.5) + Sambar (0.375 cup) + Coconut Chutney (37.5 grams)",
                        "Upma (0.375 cup) + Curd (0.375 cup) + Papaya (0.75 slice)",
                        "Pongal (0.375 cup) + Coconut Chutney (37.5 grams) + Orange (0.75)",
                        "Masala Dosa (0.75) + Sambar (0.375 cup) + Mango (0.75 slice)"
                    ],
                    'snack1': [
                        "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
                        "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
                        "Granola Bar (0.75) + Orange (0.75)",
                        "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
                        "Smoothie (0.75 cup) + Banana (0.75)"
                    ],
                    'lunch': [
                        "Sambar Rice (0.375 cup) + Papad (0.75) + Curd (0.375 cup)",
                        "Fish Curry (0.375 cup) + Rice (0.75 cup) + Veg Poriyal (0.375 bowl)",
                        "Lemon Rice (0.375 cup) + Coconut Chutney (37.5 grams) + Curd (0.375 cup)",
                        "Rasam (0.75 cup) + Rice (0.75 cup) + Beetroot Thoran (0.375 bowl)",
                        "Chicken Chettinad (0.375 cup) + Rice (0.375 cup) + Cucumber Raita (0.375 cup)"
                    ],
                    'snack2': [
                        "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
                        "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
                        "Granola Bar (0.75) + Orange (0.75)",
                        "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
                        "Smoothie (0.75 cup) + Banana (0.75)"
                    ],
                    'dinner': [
                        "Pesarattu (0.75) + Coconut Chutney (37.5 grams) + Tomato Chutney (37.5 grams)",
                        "Curd Rice (0.375 cup) + Pickle (0.375 tablespoon) + Papad (0.75)",
                        "Vegetable Biryani (0.375 cup) + Raita (0.75 cup)",
                        "Avial (0.75 cup) + Rice (0.75 cup) + Appalam (0.75)",
                        "Egg Curry (0.375 cup) + Rice (0.75 cup) + Spinach Poriyal (0.375 bowl)"
                    ]
                }
            },
            'active': {
                '3': {
                    'breakfast': [
                        "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
                        "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
                        "Scrambled Eggs (3.5) + Whole Wheat Toast (2.5 slices)",
                        "Smoothie (Banana, Spinach, Almond Milk)",
                        "Avocado Toast (1.25 slice) + Poached Egg (1.25)"
                    ],
                    'lunch': [
                        "Grilled Chicken Salad + Quinoa (1.25 cup)",
                        "Turkey Sandwich on Whole Wheat + Carrot Sticks",
                        "Lentil Soup (1.25 cup) + Mixed Green Salad",
                        "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
                        "Vegetable Stir Fry + Tofu (1.25 cup)"
                    ],
                    'dinner': [
                        "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
                        "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
                        "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
                        "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
                        "Pasta with Marinara Sauce + Meatballs (3.5)"
                    ]
                },
                '4': {
                    'breakfast': [
                        "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
                        "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
                        "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
                        "Smoothie (Banana, Spinach, Almond Milk)",
                        "Avocado Toast (1 slice) + Boiled Egg (1)"
                    ],
                    'snack1': [
                        "Fruit Salad (1.25 cup) + Yogurt (0.75 cup)",
                        "Mixed Nuts (0.75/4 cup) + Apple (1)",
                        "Granola Bar (1.25) + Orange (1.25)",
                        "Vegetable Sticks (1.25 cup) + Hummus (0.75/4 cup)",
                        "Smoothie (1.25 cup) + Banana (1)"
                    ],
                    'lunch': [
                        "Grilled Chicken Salad + Quinoa (1 cup)",
                        "Turkey Sandwich on Whole Wheat + Celery Sticks",
                        "Lentil Soup (1 cup) + Mixed Green Salad",
                        "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
                        "Vegetable Stir Fry + Tofu (1 cup)"
                    ],
                    'dinner': [
                        "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
                        "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
                        "Beef Stir Fry + Mixed Vegetables (1 cup)",
                        "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
                        "Pasta with Marinara Sauce + Meatballs (2.5)"
                    ]
                },
                '5': {
                    'breakfast': [
                        "Oatmeal (0.75 cup) + Almonds (7) + Apple (0.75)",
                        "Greek Yogurt (0.75 cup) + Blueberries (0.5 cup)",
                        "Scrambled Eggs (2) + Whole Wheat Toast (1.5 slices)",
                        "Smoothie (Banana, Spinach, Almond Milk)",
                        "Avocado Toast (0.75 slice)"
                    ],
                    'snack1': [
                        "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
                        "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
                        "Granola Bar (0.75) + Orange (0.5)",
                        "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
                        "Smoothie (0.75 cup) + Banana (0.75)"
                    ],
                    'lunch': [
                        "Grilled Chicken Salad + Quinoa (0.75 cup)",
                        "Turkey Sandwich on Whole Wheat + Cucumber Slices",
                        "Lentil Soup (0.75 cup) + Mixed Green Salad",
                        "Salmon (0.75 fillet) + Brown Rice (0.75 cup) + Broccoli (0.75 cup)",
                        "Vegetable Stir Fry + Tofu (0.75 cup)"
                    ],
                    'snack2': [
                        "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
                        "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
                        "Granola Bar (0.75) + Orange (0.5)",
                        "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
                        "Smoothie (0.75 cup) + Banana (0.75)"
                    ],
                    'dinner': [
                        "Baked Cod (0.75 fillet) + Sweet Potato (0.75) + Asparagus (0.75 cup)",
                        "Chicken Breast (0.75) + Couscous (0.75 cup) + Green Beans (0.75 cup)",
                        "Beef Stir Fry + Mixed Vegetables (0.75 cup)",
                        "Quinoa Bowl + Black Beans (0.75 cup) + Corn (0.75 cup)",
                        "Pasta with Marinara Sauce + Meatballs (1.5)"
                    ]
                }
            }
        },

        '3000': {
            'north': {
                '3': {
                    'breakfast': [
                        "Aloo Paratha (4) + Curd (2 cup) + Mango Pickle (2 tablespoon)",
                        "Chole (2 cup) + Bhature (4) + Salad (2 bowl)",
                        "Paneer Tikka (400 grams) + Green Chutney (4 tablespoons) + Mixed Veg Raita (2 cup)",
                        "Rajma (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
                        "Dal Makhani (2 cup) + Naan (2) + Carrot Halwa (2 small serving)"
                    ],
                    'lunch': [
                        "Paneer Butter Masala (2 cup) + Naan (4)",
                        "Aloo Gobhi (2 cup) + Chapati (4) + Boondi Raita (2 cup)",
                        "Chicken Curry (2 cup) + Rice (2 cup) + Mixed Vegetable Salad (2 bowl)",
                        "Palak Paneer (2 cup) + Jeera Rice (2 cup)",
                        "Mutton Rogan Josh (2 cup) + Tandoori Roti (4)"
                    ],
                    'dinner': [
                        "Dal Tadka (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
                        "Baingan Bharta (2 cup) + Chapati (4)",
                        "Chicken Tikka (400 grams) + Mint Chutney (4 tablespoons) + Salad (2 bowl)",
                        "Paneer Bhurji (2 cup) + Paratha (4)",
                        "Kadhai Paneer (2 cup) + Jeera Rice (2 cup)"
                    ]
                },
                '4': {
                    'breakfast': [
                        "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
                        "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
                        "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
                        "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
                        "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
                    ],
                    'snack1': [
                        "Fruit Salad (2 cup) + Yogurt (1 cup)",
                        "Mixed Nuts (2/4 cup) + Apple (2)",
                        "Granola Bar (2) + Orange (2)",
                        "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
                        "Smoothie (2 cup) + Banana (2)"
                    ],
                    'lunch': [
                        "Paneer Butter Masala (1 cup) + Naan (2)",
                        "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
                        "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
                        "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
                        "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
                    ],
                    'dinner': [
                        "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
                        "Baingan Bharta (1 cup) + Chapati (2)",
                        "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
                        "Paneer Bhurji (1 cup) + Paratha (2)",
                        "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
                    ]
                },
                '5': {
                    'breakfast': [
                        "Aloo Paratha (1) + Curd (2/3 cup) + Mango Pickle (2/3 tablespoon)",
                        "Chole (2/3 cup) + Bhature (1.5) + Salad (2/3 bowl)",
                        "Paneer Tikka (133 grams) + Green Chutney (2/3 tablespoons) + Mixed Veg Raita (2/3 cup)",
                        "Rajma (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
                        "Dal Makhani (2/3 cup) + Naan (1.5) + Carrot Halwa (2/3 small serving)"
                    ],
                    'snack1': [
                        "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
                        "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
                        "Granola Bar (1.25) + Orange (1.25)",
                        "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
                        "Smoothie (1.25 cup) + Banana (1.25)"
                    ],
                    'lunch': [
                        "Paneer Butter Masala (2/3 cup) + Naan (1.25)",
                        "Aloo Gobhi (2/3 cup) + Chapati (1.25) + Boondi Raita (2/3 cup)",
                        "Chicken Curry (2/3 cup) + Rice (2/3 cup) + Mixed Vegetable Salad (2/3 bowl)",
                        "Palak Paneer (2/3 cup) + Jeera Rice (2/3 cup)",
                        "Mutton Rogan Josh (2/3 cup) + Tandoori Roti (1.25)"
                    ],
                    'snack2': [
                        "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
                        "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
                        "Granola Bar (1.25) + Orange (1.25)",
                        "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
                        "Smoothie (1.25 cup) + Banana (1.25)"
                    ],
                    'dinner': [
                        "Dal Tadka (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
                        "Baingan Bharta (2/3 cup) + Chapati (1.25)",
                        "Chicken Tikka (133 grams) + Mint Chutney (2/3 tablespoons) + Salad (2/3 bowl)",
                        "Paneer Bhurji (2/3 cup) + Paratha (1.25)",
                        "Kadhai Paneer (2/3 cup) + Jeera Rice (2/3 cup)"
                    ]
                }
            },
            'south': {
                '3': {
                    'breakfast': [
                        "Dosa (4) + chutney (100 grams) + banana (2)",
                        "Idli (6) + Sambar (2 cup) + Coconut Chutney (100 grams)",
                        "Upma (2 cup) + Curd (2 cup) + Papaya (2 slice)",
                        "Pongal (2 cup) + Coconut Chutney (100 grams) + Orange (2)",
                        "Masala Dosa (2) + Sambar (2 cup) + Mango (2 slice)"
                    ],
                    'lunch': [
                        "Sambar Rice (2 cup) + Papad (4) + Curd (2 cup)",
                        "Fish Curry (2 cup) + Rice (2 cup) + Veg Poriyal (2 bowl)",
                        "Lemon Rice (2 cup) + Coconut Chutney (100 grams) + Curd (2 cup)",
                        "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (2 bowl)",
                        "Chicken Chettinad (2 cup) + Rice (2 cup) + Cucumber Raita (2 cup)"
                    ],
                    'dinner': [
                        "Pesarattu (4) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
                        "Curd Rice (2 cup) + Pickle (2 tablespoon) + Papad (4)",
                        "Vegetable Biryani (2 cup) + Raita (2 cup)",
                        "Avial (2 cup) + Rice (2 cup) + Appalam (4)",
                        "Egg Curry (2 cup) + Rice (2 cup) + Spinach Poriyal (2 bowl)"
                    ]
                },
                '4': {
                    'breakfast': [
                        "Dosa (2) + chutney (100 grams) + banana (2)",
                        "Idli (4) + Sambar (1 cup) + Coconut Chutney (100 grams)",
                        "Upma (1 cup) + Curd (1 cup) + Papaya (2 slice)",
                        "Pongal (1 cup) + Coconut Chutney (100 grams) + Orange (2)",
                        "Masala Dosa (2) + Sambar (1 cup) + Mango (1 slice)"
                    ],
                    'snack1': [
                        "Fruit Salad (2 cup) + Yogurt (1 cup)",
                        "Mixed Nuts (2/4 cup) + Apple (2)",
                        "Granola Bar (2) + Orange (2)",
                        "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
                        "Smoothie (2 cup) + Banana (2)"
                    ],
                    'lunch': [
                        "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
                        "Fish Curry (1 cup) + Rice (2 cup) + Veg Poriyal (1 bowl)",
                        "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
                        "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (1 bowl)",
                        "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
                    ],
                    'dinner': [
                        "Pesarattu (2) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
                        "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
                        "Vegetable Biryani (1 cup) + Raita (2 cup)",
                        "Avial (2 cup) + Rice (2 cup) + Appalam (2)",
                        "Egg Curry (1 cup) + Rice (2 cup) + Spinach Poriyal (1 bowl)"
                    ]
                },
                '5': {
                    'breakfast': [
                        "Dosa (2) + chutney (50 grams) + banana (2)",
                        "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
                        "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
                        "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
                        "Masala Dosa (2) + Sambar (1/2 cup) + Mango (1 slice)"
                    ],
                    'snack1': [
                        "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
                        "Mixed Nuts (1/8 cup) + Apple (1)",
                        "Granola Bar (1) + Orange (1)",
                        "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
                        "Smoothie (1 cup) + Banana (1)"
                    ],
                    'lunch': [
                        "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
                        "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
                        "Lemon Rice (1/2 cup) + Coconut Chutney (50 grams) + Curd (1/2 cup)",
                        "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
                        "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
                    ],
                    'snack2': [
                        "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
                        "Mixed Nuts (1/8 cup) + Apple (1)",
                        "Granola Bar (1) + Orange (1)",
                        "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
                        "Smoothie (1 cup) + Banana (1)"
                    ],
                    'dinner': [
                        "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
                        "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
                        "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
                        "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
                        "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
                    ]
                }
            },
            'active': {
                '3': {
                    'breakfast': [
                        "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
                        "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
                        "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
                        "Smoothie (Banana, Spinach, Almond Milk)",
                        "Avocado Toast (1.5 slice) + Poached Egg (1.5)"
                    ],
                    'lunch': [
                        "Grilled Chicken Salad + Quinoa (1.5 cup)",
                        "Turkey Sandwich on Whole Wheat + Carrot Sticks",
                        "Lentil Soup (1.5 cup) + Mixed Green Salad",
                        "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
                        "Vegetable Stir Fry + Tofu (1.5 cup)"
                    ],
                    'dinner': [
                        "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
                        "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
                        "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
                        "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
                        "Pasta with Marinara Sauce + Meatballs (4)"
                    ]
                },
                '4': {
                    'breakfast': [
                        "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
                        "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
                        "Scrambled Eggs (3.25) + Whole Wheat Toast (2.25 slices)",
                        "Smoothie (Banana, Spinach, Almond Milk)",
                        "Avocado Toast (1.25 slice) + Boiled Egg (1.25)"
                    ],
                    'snack1': [
                        "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
                        "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
                        "Granola Bar (1.5) + Orange (1.5)",
                        "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
                        "Smoothie (1.5 cup) + Banana (1.5)"
                    ],
                    'lunch': [
                        "Grilled Chicken Salad + Quinoa (1.25 cup)",
                        "Turkey Sandwich on Whole Wheat + Celery Sticks",
                        "Lentil Soup (1.25 cup) + Mixed Green Salad",
                        "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
                        "Vegetable Stir Fry + Tofu (1.25 cup)"
                    ],
                    'dinner': [
                        "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
                        "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
                        "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
                        "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
                        "Pasta with Marinara Sauce + Meatballs (3)"
                    ]
                },
                '5': {
                    'breakfast': [
                        "Oatmeal (1 cup) + Almonds (8) + Apple (1)",
                        "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
                        "Scrambled Eggs (2.5) + Whole Wheat Toast (2 slices)",
                        "Smoothie (Banana, Spinach, Almond Milk)",
                        "Avocado Toast (1 slice)"
                    ],
                    'snack1': [
                        "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
                        "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
                        "Granola Bar (1.25) + Orange (1.25)",
                        "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
                        "Smoothie (1.25 cup) + Banana (1.25)"
                    ],
                    'lunch': [
                        "Grilled Chicken Salad + Quinoa (1 cup)",
                        "Turkey Sandwich on Whole Wheat + Cucumber Slices",
                        "Lentil Soup (1 cup) + Mixed Green Salad",
                        "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
                        "Vegetable Stir Fry + Tofu (1 cup)"
                    ],
                    'snack2': [
                        "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
                        "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
                        "Granola Bar (1.25) + Orange (1.25)",
                        "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
                        "Smoothie (1.25 cup) + Banana (1.25)"
                    ],
                    'dinner': [
                        "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
                        "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
                        "Beef Stir Fry + Mixed Vegetables (1 cup)",
                        "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
                        "Pasta with Marinara Sauce + Meatballs (2)"
                    ]
                }
            }
        },

        
        '3500': {
            'north': {
                '3': {
                    'breakfast': [
                        "Aloo Paratha (5) + Curd (2.5 cup) + Mango Pickle (2.5 tablespoon)",
                        "Chole (2.5 cup) + Bhature (5) + Salad (2.5 bowl)",
                        "Paneer Tikka (500 grams) + Green Chutney (5 tablespoons) + Mixed Veg Raita (2.5 cup)",
                        "Rajma (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
                        "Dal Makhani (2.5 cup) + Naan (2.5) + Carrot Halwa (2.5 small serving)"
                    ],
                    'lunch': [
                        "Paneer Butter Masala (2.5 cup) + Naan (5)",
                        "Aloo Gobhi (2.5 cup) + Chapati (5) + Boondi Raita (2.5 cup)",
                        "Chicken Curry (2.5 cup) + Rice (2.5 cup) + Mixed Vegetable Salad (2.5 bowl)",
                        "Palak Paneer (2.5 cup) + Jeera Rice (2.5 cup)",
                        "Mutton Rogan Josh (2.5 cup) + Tandoori Roti (5)"
                    ],
                    'dinner': [
                        "Dal Tadka (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
                        "Baingan Bharta (2.5 cup) + Chapati (5)",
                        "Chicken Tikka (500 grams) + Mint Chutney (5 tablespoons) + Salad (2.5 bowl)",
                        "Paneer Bhurji (2.5 cup) + Paratha (5)",
                        "Kadhai Paneer (2.5 cup) + Jeera Rice (2.5 cup)"
                    ]
                },
                '4': {
                    'breakfast': [
                        "Aloo Paratha (2.5) + Curd (1.25 cup) + Mango Pickle (1.25 tablespoon)",
                        "Chole (1.25 cup) + Bhature (2.5) + Salad (1.25 bowl)",
                        "Paneer Tikka (250 grams) + Green Chutney (2.5 tablespoons) + Mixed Veg Raita (1.25 cup)",
                        "Rajma (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
                        "Dal Makhani (1.25 cup) + Naan (1.25) + Carrot Halwa (1.25 small serving)"
                    ],
                    'snack1': [
                        "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
                        "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
                        "Granola Bar (2.5) + Orange (2.5)",
                        "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
                        "Smoothie (2.5 cup) + Banana (2.5)"
                    ],
                    'lunch': [
                        "Paneer Butter Masala (1.25 cup) + Naan (2.5)",
                        "Aloo Gobhi (1.25 cup) + Chapati (2.5) + Boondi Raita (1.25 cup)",
                        "Chicken Curry (1.25 cup) + Rice (1.25 cup) + Mixed Vegetable Salad (1.25 bowl)",
                        "Palak Paneer (1.25 cup) + Jeera Rice (1.25 cup)",
                        "Mutton Rogan Josh (1.25 cup) + Tandoori Roti (2.5)"
                    ],
                    'dinner': [
                        "Dal Tadka (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
                        "Baingan Bharta (1.25 cup) + Chapati (2.5)",
                        "Chicken Tikka (250 grams) + Mint Chutney (2.5 tablespoons) + Salad (1.25 bowl)",
                        "Paneer Bhurji (1.25 cup) + Paratha (2.5)",
                        "Kadhai Paneer (1.25 cup) + Jeera Rice (1.25 cup)"
                    ]
                },
                '5': {
                    'breakfast': [
                        "Aloo Paratha (1.25) + Curd (0.625 cup) + Mango Pickle (0.625 tablespoon)",
                        "Chole (0.625 cup) + Bhature (1.25) + Salad (0.625 bowl)",
                        "Paneer Tikka (125 grams) + Green Chutney (0.625 tablespoons) + Mixed Veg Raita (0.625 cup)",
                        "Rajma (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
                        "Dal Makhani (0.625 cup) + Naan (1.25) + Carrot Halwa (0.625 small serving)"
                    ],
                    'snack1': [
                        "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
                        "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
                        "Granola Bar (1.25) + Orange (1.25)",
                        "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
                        "Smoothie (1.25 cup) + Banana (1.25)"
                    ],
                    'lunch': [
                        "Paneer Butter Masala (0.625 cup) + Naan (1.25)",
                        "Aloo Gobhi (0.625 cup) + Chapati (1.25) + Boondi Raita (0.625 cup)",
                        "Chicken Curry (0.625 cup) + Rice (0.625 cup) + Mixed Vegetable Salad (0.625 bowl)",
                        "Palak Paneer (0.625 cup) + Jeera Rice (0.625 cup)",
                        "Mutton Rogan Josh (0.625 cup) + Tandoori Roti (1.25)"
                    ],
                    'snack2': [
                        "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
                        "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
                        "Granola Bar (1.25) + Orange (1.25)",
                        "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
                        "Smoothie (1.25 cup) + Banana (1.25)"
                    ],
                    'dinner': [
                        "Dal Tadka (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
                        "Baingan Bharta (0.625 cup) + Chapati (1.25)",
                        "Chicken Tikka (125 grams) + Mint Chutney (0.625 tablespoons) + Salad (0.625 bowl)",
                        "Paneer Bhurji (0.625 cup) + Paratha (1.25)",
                        "Kadhai Paneer (0.625 cup) + Jeera Rice (0.625 cup)"
                    ]
                }
            },
            'south': {
                '3': {
                    'breakfast': [
                        "Dosa (5) + chutney (125 grams) + banana (2.5)",
                        "Idli (7.5) + Sambar (2.5 cup) + Coconut Chutney (125 grams)",
                        "Upma (2.5 cup) + Curd (2.5 cup) + Papaya (2.5 slice)",
                        "Pongal (2.5 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
                        "Masala Dosa (2.5) + Sambar (2.5 cup) + Mango (2.5 slice)"
                    ],
                    'lunch': [
                        "Sambar Rice (2.5 cup) + Papad (5) + Curd (2.5 cup)",
                        "Fish Curry (2.5 cup) + Rice (2.5 cup) + Veg Poriyal (2.5 bowl)",
                        "Lemon Rice (2.5 cup) + Coconut Chutney (125 grams) + Curd (2.5 cup)",
                        "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (2.5 bowl)",
                        "Chicken Chettinad (2.5 cup) + Rice (2.5 cup) + Cucumber Raita (2.5 cup)"
                    ],
                    'dinner': [
                        "Pesarattu (5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
                        "Curd Rice (2.5 cup) + Pickle (2.5 tablespoon) + Papad (5)",
                        "Vegetable Biryani (2.5 cup) + Raita (2.5 cup)",
                        "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (5)",
                        "Egg Curry (2.5 cup) + Rice (2.5 cup) + Spinach Poriyal (2.5 bowl)"
                    ]
                },
                '4': {
                    'breakfast': [
                        "Dosa (2.5) + chutney (125 grams) + banana (2.5)",
                        "Idli (5) + Sambar (1.25 cup) + Coconut Chutney (125 grams)",
                        "Upma (1.25 cup) + Curd (1.25 cup) + Papaya (2.5 slice)",
                        "Pongal (1.25 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
                        "Masala Dosa (2.5) + Sambar (1.25 cup) + Mango (1.25 slice)"
                    ],
                    'snack1': [
                        "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
                        "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
                        "Granola Bar (2.5) + Orange (2.5)",
                        "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
                        "Smoothie (2.5 cup) + Banana (2.5)"
                    ],
                    'lunch': [
                        "Sambar Rice (1.25 cup) + Papad (2.5) + Curd (1.25 cup)",
                        "Fish Curry (1.25 cup) + Rice (2.5 cup) + Veg Poriyal (1.25 bowl)",
                        "Lemon Rice (1.25 cup) + Coconut Chutney (1.25 grams) + Curd (1.25 cup)",
                        "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (1.25 bowl)",
                        "Chicken Chettinad (1.25 cup) + Rice (1.25 cup) + Cucumber Raita (1.25 cup)"
                    ],
                    'dinner': [
                        "Pesarattu (2.5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
                        "Curd Rice (1.25 cup) + Pickle (1.25 tablespoon) + Papad (2.5)",
                        "Vegetable Biryani (1.25 cup) + Raita (2.5 cup)",
                        "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (2.5)",
                        "Egg Curry (1.25 cup) + Rice (2.5 cup) + Spinach Poriyal (1.25 bowl)"
                    ]
                },
                '5': {
                    'breakfast': [
                        "Dosa (1.25) + chutney (62.5 grams) + banana (1.25)",
                        "Idli (2.5) + Sambar (0.625 cup) + Coconut Chutney (62.5 grams)",
                        "Upma (0.625 cup) + Curd (0.625 cup) + Papaya (1.25 slice)",
                        "Pongal (0.625 cup) + Coconut Chutney (62.5 grams) + Orange (1.25)",
                        "Masala Dosa (1.25) + Sambar (0.625 cup) + Mango (1.25 slice)"
                    ],
                    'snack1': [
                        "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
                        "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
                        "Granola Bar (1.25) + Orange (1.25)",
                        "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
                        "Smoothie (1.25 cup) + Banana (1.25)"
                    ],
                    'lunch': [
                        "Sambar Rice (0.625 cup) + Papad (1.25) + Curd (0.625 cup)",
                        "Fish Curry (0.625 cup) + Rice (1.25 cup) + Veg Poriyal (0.625 bowl)",
                        "Lemon Rice (0.625 cup) + Coconut Chutney (62.5 grams) + Curd (0.625 cup)",
                        "Rasam (1.25 cup) + Rice (1.25 cup) + Beetroot Thoran (0.625 bowl)",
                        "Chicken Chettinad (0.625 cup) + Rice (0.625 cup) + Cucumber Raita (0.625 cup)"
                    ],
                    'snack2': [
                        "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
                        "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
                        "Granola Bar (1.25) + Orange (1.25)",
                        "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
                        "Smoothie (1.25 cup) + Banana (1.25)"
                    ],
                    'dinner': [
                        "Pesarattu (1.25) + Coconut Chutney (62.5 grams) + Tomato Chutney (62.5 grams)",
                        "Curd Rice (0.625 cup) + Pickle (0.625 tablespoon) + Papad (1.25)",
                        "Vegetable Biryani (0.625 cup) + Raita (1.25 cup)",
                        "Avial (1.25 cup) + Rice (1.25 cup) + Appalam (1.25)",
                        "Egg Curry (0.625 cup) + Rice (1.25 cup) + Spinach Poriyal (0.625 bowl)"
                    ]
                }
            },
            'active': {
                '3': {
                    'breakfast': [
                        "Oatmeal (1.75 cup) + Almonds (18) + Apple (1.75)",
                        "Greek Yogurt (1.75 cup) + Blueberries (1.25 cup)",
                        "Scrambled Eggs (5) + Whole Wheat Toast (3.75 slices)",
                        "Smoothie (Banana, Spinach, Almond Milk)",
                        "Avocado Toast (1.75 slice) + Poached Egg (1.75)"
                    ],
                    'lunch': [
                        "Grilled Chicken Salad + Quinoa (1.75 cup)",
                        "Turkey Sandwich on Whole Wheat + Carrot Sticks",
                        "Lentil Soup (1.75 cup) + Mixed Green Salad",
                        "Salmon (1.75 fillet) + Brown Rice (1.75 cup) + Broccoli (1.75 cup)",
                        "Vegetable Stir Fry + Tofu (1.75 cup)"
                    ],
                    'dinner': [
                        "Baked Cod (1.75 fillet) + Sweet Potato (1.75) + Asparagus (1.75 cup)",
                        "Chicken Breast (1.75) + Couscous (1.75 cup) + Green Beans (1.75 cup)",
                        "Beef Stir Fry + Mixed Vegetables (1.75 cup)",
                        "Quinoa Bowl + Black Beans (1.75 cup) + Corn (1.75 cup)",
                        "Pasta with Marinara Sauce + Meatballs (5)"
                    ]
                },
                '4': {
                    'breakfast': [
                        "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
                        "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
                        "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
                        "Smoothie (Banana, Spinach, Almond Milk)",
                        "Avocado Toast (1.5 slice) + Boiled Egg (1.5)"
                    ],
                    'snack1': [
                        "Fruit Salad (2 cup) + Yogurt (1.5 cup)",
                        "Mixed Nuts (2/4 cup) + Apple (2)",
                        "Granola Bar (2) + Orange (2)",
                        "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
                        "Smoothie (2 cup) + Banana (2)"
                    ],
                    'lunch': [
                        "Grilled Chicken Salad + Quinoa (1.5 cup)",
                        "Turkey Sandwich on Whole Wheat + Celery Sticks",
                        "Lentil Soup (1.5 cup) + Mixed Green Salad",
                        "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
                        "Vegetable Stir Fry + Tofu (1.5 cup)"
                    ],
                    'dinner': [
                        "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
                        "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
                        "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
                        "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
                        "Pasta with Marinara Sauce + Meatballs (4)"
                    ]
                },
                '5': {
                    'breakfast': [
                        "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
                        "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
                        "Scrambled Eggs (3) + Whole Wheat Toast (2.5 slices)",
                        "Smoothie (Banana, Spinach, Almond Milk)",
                        "Avocado Toast (1.25 slice)"
                    ],
                    'snack1': [
                        "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
                        "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
                        "Granola Bar (1.5) + Orange (1.5)",
                        "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
                        "Smoothie (1.5 cup) + Banana (1.5)"
                    ],
                    'lunch': [
                        "Grilled Chicken Salad + Quinoa (1.25 cup)",
                        "Turkey Sandwich on Whole Wheat + Cucumber Slices",
                        "Lentil Soup (1.25 cup) + Mixed Green Salad",
                        "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
                        "Vegetable Stir Fry + Tofu (1.25 cup)"
                    ],
                    'snack2': [
                        "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
                        "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
                        "Granola Bar (1.5) + Orange (1.5)",
                        "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
                        "Smoothie (1.5 cup) + Banana (1.5)"
                    ],
                    'dinner': [
                        "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
                        "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
                        "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
                        "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
                        "Pasta with Marinara Sauce + Meatballs (3)"
                    ]
                }
            }
        }
        // Add other calorie categories (2500, 3000, 3500) here...
    };

    return options[calorieCategory][type][numberOfMeals][meal].map(option => `<option value="${option}">${option}</option>`).join('');
}

function showLoadingPage() {
    document.querySelectorAll('.container > *').forEach(element => element.classList.add('hidden'));
    document.getElementById('loading-page').classList.remove('hidden');
    
    let countdown = 5;
    const countdownElement = document.getElementById('countdown');
    const progressBarFill = document.getElementById('progress-bar-fill');
    
    const countdownInterval = setInterval(() => {
        countdownElement.textContent = countdown;
        progressBarFill.style.width = `${(5 - countdown) * 20}%`;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            generatePlan();
            document.getElementById('loading-page').classList.add('hidden');
            document.getElementById('diet-plan').classList.remove('hidden');
            document.getElementById('explore-more').classList.remove('hidden');
        }
        countdown--;
    }, 1000);
}

function generatePlan(calorieOverride = null) {
    if (calorieOverride) {
        calorieCategory = calorieOverride;
        updateMealOptions();
    }

    const meals = document.getElementById('meals').value;

    const dietPlanDetails = document.getElementById('diet-plan-details');
    dietPlanDetails.innerHTML = `<h3>Category: ${calorieCategory} kcal</h3><h3>Meals: ${meals}</h3>`;

    const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
    if (meals == 4) {
        mealLabels.splice(1, 0, 'Snack');
    } else if (meals == 5) {
        mealLabels.splice(1, 0, 'Snack1');
        mealLabels.splice(3, 0, 'Snack2');
    }

    mealLabels.forEach(label => {
        let mealType = '';
        if (activityLevel === 'sedentary') {
            mealType = document.getElementById(`north-${label.toLowerCase()}-select`).value || document.getElementById(`south-${label.toLowerCase()}-select`).value;
        } else {
            mealType = document.getElementById(`active-${label.toLowerCase()}-select`).value;
        }
        dietPlanDetails.innerHTML += `<div class="meal animated"><h4>${label}</h4><p>${mealType}</p></div>`;
    });

    textAnimation();
}

function calculateCalories(height, weight, gender) {
    return (10 * weight) + (6.25 * height) - (5 * 25) + (gender === 'male' ? 5 : -161);
}

function showAdModal() {
    document.body.classList.add('modal-open');
    document.getElementById('ad-modal').classList.remove('hidden');
}

function downloadPlan() {
    const dietPlanDetails = document.getElementById('diet-plan-details').innerHTML;
    const blob = new Blob([dietPlanDetails], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'diet_plan.pdf';
    link.click();
    document.getElementById('ad-modal').classList.add('hidden');
    document.body.classList.remove('modal-open');
}

function textAnimation() {
    const elements = document.querySelectorAll('.animated');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 500);
    });
}

document.querySelectorAll('.meal-select').forEach(select => {
    select.addEventListener('change', (event) => {
        const selectedMeal = event.target.id.split('-')[1]; // breakfast, lunch, dinner, snack1, snack2
        const selectedType = event.target.id.split('-')[0]; // north, south, active
        const value = event.target.value;

        if (value) {
            if (selectedType === 'north') {
                document.getElementById(`south-${selectedMeal}-select`).disabled = true;
                document.getElementById(`active-${selectedMeal}-select`).disabled = true;
            } else if (selectedType === 'south') {
                document.getElementById(`north-${selectedMeal}-select`).disabled = true;
                document.getElementById(`active-${selectedMeal}-select`).disabled = true;
            } else if (selectedType === 'active') {
                document.getElementById(`north-${selectedMeal}-select`).disabled = true;
                document.getElementById(`south-${selectedMeal}-select`).disabled = true;
            }
        } else {
            if (selectedType === 'north') {
                document.getElementById(`south-${selectedMeal}-select`).disabled = false;
                document.getElementById(`active-${selectedMeal}-select`).disabled = false;
            } else if (selectedType === 'south') {
                document.getElementById(`north-${selectedMeal}-select`).disabled = false;
                document.getElementById(`active-${selectedMeal}-select`).disabled = false;
            } else if (selectedType === 'active') {
                document.getElementById(`north-${selectedMeal}-select`).disabled = false;
                document.getElementById(`south-${selectedMeal}-select`).disabled = false;
            }
        }
    });
});

// Ensure the modal is hidden initially
document.getElementById('ad-modal').classList.add('hidden');















// document.getElementById('sedentary').addEventListener('click', () => {
//     resetForm();
//     showForm('sedentary');
// });

// document.getElementById('active').addEventListener('click', () => {
//     resetForm();
//     showForm('active');
// });

// document.querySelectorAll('#height, #weight, #gender, #meals').forEach(input => {
//     input.addEventListener('input', () => {
//         if (isFormFilled()) {
//             calculateAndShowMeals();
//         }
//     });
// });

// document.getElementById('generate-plan').addEventListener('click', (e) => {
//     e.preventDefault();
//     showLoadingPage();
// });

// document.getElementById('download-plan').addEventListener('click', downloadPlan);

// document.getElementById('explore-2000').addEventListener('click', () => generatePlan('2000'));
// document.getElementById('explore-2500').addEventListener('click', () => generatePlan('2500'));
// document.getElementById('explore-3000').addEventListener('click', () => generatePlan('3000'));
// document.getElementById('explore-3500').addEventListener('click', () => generatePlan('3500'));

// let activityLevel = '';
// let maintenanceCalories = 0;
// let calorieCategory = '2000';

// function resetForm() {
//     document.getElementById('diet-form').reset();
//     document.getElementById('form-container').classList.add('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
//     document.getElementById('diet-plan').classList.add('hidden');
//     document.getElementById('explore-more').classList.add('hidden');
//     document.querySelectorAll('.meal-select').forEach(select => {
//         select.innerHTML = '';
//     });
// }

// function showForm(level) {
//     activityLevel = level;
//     document.getElementById('form-container').classList.remove('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
// }

// function isFormFilled() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;
//     const meals = document.getElementById('meals').value;
//     return height && weight && gender && meals;
// }

// function calculateAndShowMeals() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;

//     maintenanceCalories = calculateCalories(height, weight, gender);
//     if (maintenanceCalories < 2000) {
//         maintenanceCalories = 2000;
//     } else if (maintenanceCalories > 3500) {
//         maintenanceCalories = 3500;
//     }

//     if (maintenanceCalories > 3200) {
//         calorieCategory = '3500';
//     } else if (maintenanceCalories > 2700) {
//         calorieCategory = '3000';
//     } else if (maintenanceCalories > 2200) {
//         calorieCategory = '2500';
//     } else {
//         calorieCategory = '2000';
//     }

//     updateMealOptions();
//     document.getElementById('meal-options').classList.remove('hidden');
// }

// function updateMealOptions() {
//     const northBreakfastSelect = document.getElementById('north-breakfast-select');
//     const northSnack1Select = document.getElementById('north-snack1-select');
//     const northLunchSelect = document.getElementById('north-lunch-select');
//     const northSnack2Select = document.getElementById('north-snack2-select');
//     const northDinnerSelect = document.getElementById('north-dinner-select');

//     const southBreakfastSelect = document.getElementById('south-breakfast-select');
//     const southSnack1Select = document.getElementById('south-snack1-select');
//     const southLunchSelect = document.getElementById('south-lunch-select');
//     const southSnack2Select = document.getElementById('south-snack2-select');
//     const southDinnerSelect = document.getElementById('south-dinner-select');

//     const activeBreakfastSelect = document.getElementById('active-breakfast-select');
//     const activeSnack1Select = document.getElementById('active-snack1-select');
//     const activeLunchSelect = document.getElementById('active-lunch-select');
//     const activeSnack2Select = document.getElementById('active-snack2-select');
//     const activeDinnerSelect = document.getElementById('active-dinner-select');

//     const numberOfMeals = document.getElementById('meals').value;

//     if (activityLevel === 'sedentary') {
//         document.getElementById('north-indian').classList.remove('hidden');
//         document.getElementById('south-indian').classList.remove('hidden');

//         northBreakfastSelect.innerHTML = getOptions('north', 'breakfast', numberOfMeals);
//         northSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('north', 'snack1', numberOfMeals) : '';
//         northLunchSelect.innerHTML = getOptions('north', 'lunch', numberOfMeals);
//         northSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('north', 'snack2', numberOfMeals) : '';
//         northDinnerSelect.innerHTML = getOptions('north', 'dinner', numberOfMeals);

//         southBreakfastSelect.innerHTML = getOptions('south', 'breakfast', numberOfMeals);
//         southSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('south', 'snack1', numberOfMeals) : '';
//         southLunchSelect.innerHTML = getOptions('south', 'lunch', numberOfMeals);
//         southSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('south', 'snack2', numberOfMeals) : '';
//         southDinnerSelect.innerHTML = getOptions('south', 'dinner', numberOfMeals);

//         toggleVisibility(northSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(northSnack2Select, numberOfMeals == 5);
//         toggleVisibility(southSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(southSnack2Select, numberOfMeals == 5);
//     } else {
//         document.getElementById('active-meals').classList.remove('hidden');

//         activeBreakfastSelect.innerHTML = getOptions('active', 'breakfast', numberOfMeals);
//         activeSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('active', 'snack1', numberOfMeals) : '';
//         activeLunchSelect.innerHTML = getOptions('active', 'lunch', numberOfMeals);
//         activeSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('active', 'snack2', numberOfMeals) : '';
//         activeDinnerSelect.innerHTML = getOptions('active', 'dinner', numberOfMeals);

//         toggleVisibility(activeSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(activeSnack2Select, numberOfMeals == 5);
//     }

//     document.getElementById('generate-plan').classList.remove('hidden');
// }

// function toggleVisibility(element, isVisible) {
//     if (isVisible) {
//         element.classList.remove('hidden');
//         element.previousElementSibling.classList.remove('hidden');
//     } else {
//         element.classList.add('hidden');
//         element.previousElementSibling.classList.add('hidden');
//     }
// }

// function getOptions(type, meal, numberOfMeals) {
//     const options = {
//         '2000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (1/2 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/2 cup) + Bhature (1) + Salad (1/2 bowl)",
//                         "Paneer Tikka (100 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1/2 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/2 cup) + Naan (1)",
//                         "Aloo Gobhi (1/2 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/2 cup) + Rice (1/2 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1/2 cup) + Tandoori Roti (1)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/2 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/2 cup) + Chapati (1)",
//                         "Chicken Tikka (100 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/2 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/2 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1/2) + Curd (1/3 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/3 cup) + Bhature (1) + Salad (1/3 bowl)",
//                         "Paneer Tikka (50 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1/2 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1/2 cup) + Naan (1) + Carrot Halwa (1/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/3 cup) + Naan (1)",
//                         "Aloo Gobhi (1/3 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/3 cup) + Rice (1/3 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1/2 cup)",
//                         "Mutton Rogan Josh (1/3 cup) + Tandoori Roti (1)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/3 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/3 cup) + Chapati (1)",
//                         "Chicken Tikka (70 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/3 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/3 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (1)",
//                         "Idli (3) + Sambar (1 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (1 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (1 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (50 grams) + banana (1)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1/2 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (25 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (25 grams) + banana (1)",
//                         "Idli (1) + Sambar (1/3 cup) + Coconut Chutney (25 grams)",
//                         "Upma (1/3 cup) + Curd (1/3 cup) + Papaya (1 slice)",
//                         "Pongal (1/3 cup) + Coconut Chutney (25 grams) + Orange (1/2)",
//                         "Masala Dosa (1) + Sambar (1/3 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/3 cup) + Papad (1) + Curd (1/3 cup)",
//                         "Fish Curry (1/3 cup) + Rice (1/2 cup) + Veg Poriyal (1/3 bowl)",
//                         "Lemon Rice (1/3 cup) + Coconut Chutney (25 grams) + Curd (1/3 cup)",
//                         "Rasam (1 cup) + Rice (1/2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/3 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (25 grams) + Tomato Chutney (25 grams)",
//                         "Curd Rice (1/3 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/3 cup) + Raita (1 cup)",
//                         "Avial (1/2 cup) + Rice (1/2 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1/2 cup) + Spinach Poriyal (1/2 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (1/2 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Poached Egg (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (3/4 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (3/4 cup) + Blueberries (1/3 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (3/4 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (3/4 cup) + Mixed Green Salad",
//                         "Salmon (3/4 fillet) + Brown Rice (3/4 cup) + Broccoli (3/4 cup)",
//                         "Vegetable Stir Fry + Tofu (3/4 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (3/4 fillet) + Sweet Potato (3/4) + Asparagus (3/4 cup)",
//                         "Chicken Breast (3/4) + Couscous (3/4 cup) + Green Beans (3/4 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (3/4 cup)",
//                         "Quinoa Bowl + Black Beans (3/4 cup) + Corn (3/4 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1/2 cup) + Almonds (5) + Apple (1/2)",
//                         "Greek Yogurt (1/2 cup) + Blueberries (1/4 cup)",
//                         "Scrambled Eggs (1) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1/2 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1/2 cup) + Mixed Green Salad",
//                         "Salmon (1/2 fillet) + Brown Rice (1/2 cup) + Broccoli (1/2 cup)",
//                         "Vegetable Stir Fry + Tofu (1/2 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1/2 fillet) + Sweet Potato (1/2) + Asparagus (1/2 cup)",
//                         "Chicken Breast (1/2) + Couscous (1/2 cup) + Green Beans (1/2 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1/2 cup)",
//                         "Quinoa Bowl + Black Beans (1/2 cup) + Corn (1/2 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1)"
//                     ]
//                 }
//             }
//         },

//         '2500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (3) + Curd (1.5 cup) + Mango Pickle (1.5 tablespoon)",
//                         "Chole (1.5 cup) + Bhature (3) + Salad (1.5 bowl)",
//                         "Paneer Tikka (300 grams) + Green Chutney (3 tablespoons) + Mixed Veg Raita (1.5 cup)",
//                         "Rajma (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Dal Makhani (1.5 cup) + Naan (1.5) + Carrot Halwa (1.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.5 cup) + Naan (3)",
//                         "Aloo Gobhi (1.5 cup) + Chapati (3) + Boondi Raita (1.5 cup)",
//                         "Chicken Curry (1.5 cup) + Rice (1.5 cup) + Mixed Vegetable Salad (1.5 bowl)",
//                         "Palak Paneer (1.5 cup) + Jeera Rice (1.5 cup)",
//                         "Mutton Rogan Josh (1.5 cup) + Tandoori Roti (3)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Baingan Bharta (1.5 cup) + Chapati (3)",
//                         "Chicken Tikka (300 grams) + Mint Chutney (3 tablespoons) + Salad (1.5 bowl)",
//                         "Paneer Bhurji (1.5 cup) + Paratha (3)",
//                         "Kadhai Paneer (1.5 cup) + Jeera Rice (1.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1.5) + Curd (0.75 cup) + Mango Pickle (0.75 tablespoon)",
//                         "Chole (0.75 cup) + Bhature (1.5) + Salad (0.75 bowl)",
//                         "Paneer Tikka (150 grams) + Green Chutney (1.5 tablespoons) + Mixed Veg Raita (0.75 cup)",
//                         "Rajma (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Dal Makhani (0.75 cup) + Naan (0.75) + Carrot Halwa (0.75 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.75 cup) + Naan (1.5)",
//                         "Aloo Gobhi (0.75 cup) + Chapati (1.5) + Boondi Raita (0.75 cup)",
//                         "Chicken Curry (0.75 cup) + Rice (0.75 cup) + Mixed Vegetable Salad (0.75 bowl)",
//                         "Palak Paneer (0.75 cup) + Jeera Rice (0.75 cup)",
//                         "Mutton Rogan Josh (0.75 cup) + Tandoori Roti (1.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Baingan Bharta (0.75 cup) + Chapati (1.5)",
//                         "Chicken Tikka (150 grams) + Mint Chutney (1.5 tablespoons) + Salad (0.75 bowl)",
//                         "Paneer Bhurji (0.75 cup) + Paratha (1.5)",
//                         "Kadhai Paneer (0.75 cup) + Jeera Rice (0.75 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (0.75) + Curd (0.375 cup) + Mango Pickle (0.375 tablespoon)",
//                         "Chole (0.375 cup) + Bhature (0.75) + Salad (0.375 bowl)",
//                         "Paneer Tikka (75 grams) + Green Chutney (0.75 tablespoons) + Mixed Veg Raita (0.375 cup)",
//                         "Rajma (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Dal Makhani (0.375 cup) + Naan (0.75) + Carrot Halwa (0.375 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.375 cup) + Naan (0.75)",
//                         "Aloo Gobhi (0.375 cup) + Chapati (0.75) + Boondi Raita (0.375 cup)",
//                         "Chicken Curry (0.375 cup) + Rice (0.375 cup) + Mixed Vegetable Salad (0.375 bowl)",
//                         "Palak Paneer (0.375 cup) + Jeera Rice (0.375 cup)",
//                         "Mutton Rogan Josh (0.375 cup) + Tandoori Roti (0.75)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Baingan Bharta (0.375 cup) + Chapati (0.75)",
//                         "Chicken Tikka (75 grams) + Mint Chutney (0.75 tablespoons) + Salad (0.375 bowl)",
//                         "Paneer Bhurji (0.375 cup) + Paratha (0.75)",
//                         "Kadhai Paneer (0.375 cup) + Jeera Rice (0.375 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (3) + chutney (75 grams) + banana (1.5)",
//                         "Idli (4.5) + Sambar (1.5 cup) + Coconut Chutney (75 grams)",
//                         "Upma (1.5 cup) + Curd (1.5 cup) + Papaya (1.5 slice)",
//                         "Pongal (1.5 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (1.5 cup) + Mango (1.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.5 cup) + Papad (3) + Curd (1.5 cup)",
//                         "Fish Curry (1.5 cup) + Rice (1.5 cup) + Veg Poriyal (1.5 bowl)",
//                         "Lemon Rice (1.5 cup) + Coconut Chutney (75 grams) + Curd (1.5 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (1.5 bowl)",
//                         "Chicken Chettinad (1.5 cup) + Rice (1.5 cup) + Cucumber Raita (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (3) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (1.5 cup) + Pickle (1.5 tablespoon) + Papad (3)",
//                         "Vegetable Biryani (1.5 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (3)",
//                         "Egg Curry (1.5 cup) + Rice (1.5 cup) + Spinach Poriyal (1.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1.5) + chutney (75 grams) + banana (1.5)",
//                         "Idli (3) + Sambar (0.75 cup) + Coconut Chutney (75 grams)",
//                         "Upma (0.75 cup) + Curd (0.75 cup) + Papaya (1.5 slice)",
//                         "Pongal (0.75 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (0.75 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.75 cup) + Papad (1.5) + Curd (0.75 cup)",
//                         "Fish Curry (0.75 cup) + Rice (1.5 cup) + Veg Poriyal (0.75 bowl)",
//                         "Lemon Rice (0.75 cup) + Coconut Chutney (0.375 grams) + Curd (0.75 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (0.75 bowl)",
//                         "Chicken Chettinad (0.75 cup) + Rice (0.75 cup) + Cucumber Raita (0.75 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.5) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (0.75 cup) + Pickle (0.75 tablespoon) + Papad (1.5)",
//                         "Vegetable Biryani (0.75 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (1.5)",
//                         "Egg Curry (0.75 cup) + Rice (1.5 cup) + Spinach Poriyal (0.75 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (0.75) + chutney (37.5 grams) + banana (1.5)",
//                         "Idli (1.5) + Sambar (0.375 cup) + Coconut Chutney (37.5 grams)",
//                         "Upma (0.375 cup) + Curd (0.375 cup) + Papaya (0.75 slice)",
//                         "Pongal (0.375 cup) + Coconut Chutney (37.5 grams) + Orange (0.75)",
//                         "Masala Dosa (0.75) + Sambar (0.375 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.375 cup) + Papad (0.75) + Curd (0.375 cup)",
//                         "Fish Curry (0.375 cup) + Rice (0.75 cup) + Veg Poriyal (0.375 bowl)",
//                         "Lemon Rice (0.375 cup) + Coconut Chutney (37.5 grams) + Curd (0.375 cup)",
//                         "Rasam (0.75 cup) + Rice (0.75 cup) + Beetroot Thoran (0.375 bowl)",
//                         "Chicken Chettinad (0.375 cup) + Rice (0.375 cup) + Cucumber Raita (0.375 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (0.75) + Coconut Chutney (37.5 grams) + Tomato Chutney (37.5 grams)",
//                         "Curd Rice (0.375 cup) + Pickle (0.375 tablespoon) + Papad (0.75)",
//                         "Vegetable Biryani (0.375 cup) + Raita (0.75 cup)",
//                         "Avial (0.75 cup) + Rice (0.75 cup) + Appalam (0.75)",
//                         "Egg Curry (0.375 cup) + Rice (0.75 cup) + Spinach Poriyal (0.375 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.5) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Poached Egg (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3.5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (0.75/4 cup) + Apple (1)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2.5)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (0.75 cup) + Almonds (7) + Apple (0.75)",
//                         "Greek Yogurt (0.75 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (0.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (0.75 cup) + Mixed Green Salad",
//                         "Salmon (0.75 fillet) + Brown Rice (0.75 cup) + Broccoli (0.75 cup)",
//                         "Vegetable Stir Fry + Tofu (0.75 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (0.75 fillet) + Sweet Potato (0.75) + Asparagus (0.75 cup)",
//                         "Chicken Breast (0.75) + Couscous (0.75 cup) + Green Beans (0.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (0.75 cup)",
//                         "Quinoa Bowl + Black Beans (0.75 cup) + Corn (0.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1.5)"
//                     ]
//                 }
//             }
//         },

//         '3000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (4) + Curd (2 cup) + Mango Pickle (2 tablespoon)",
//                         "Chole (2 cup) + Bhature (4) + Salad (2 bowl)",
//                         "Paneer Tikka (400 grams) + Green Chutney (4 tablespoons) + Mixed Veg Raita (2 cup)",
//                         "Rajma (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Dal Makhani (2 cup) + Naan (2) + Carrot Halwa (2 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2 cup) + Naan (4)",
//                         "Aloo Gobhi (2 cup) + Chapati (4) + Boondi Raita (2 cup)",
//                         "Chicken Curry (2 cup) + Rice (2 cup) + Mixed Vegetable Salad (2 bowl)",
//                         "Palak Paneer (2 cup) + Jeera Rice (2 cup)",
//                         "Mutton Rogan Josh (2 cup) + Tandoori Roti (4)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Baingan Bharta (2 cup) + Chapati (4)",
//                         "Chicken Tikka (400 grams) + Mint Chutney (4 tablespoons) + Salad (2 bowl)",
//                         "Paneer Bhurji (2 cup) + Paratha (4)",
//                         "Kadhai Paneer (2 cup) + Jeera Rice (2 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (2/3 cup) + Mango Pickle (2/3 tablespoon)",
//                         "Chole (2/3 cup) + Bhature (1.5) + Salad (2/3 bowl)",
//                         "Paneer Tikka (133 grams) + Green Chutney (2/3 tablespoons) + Mixed Veg Raita (2/3 cup)",
//                         "Rajma (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Dal Makhani (2/3 cup) + Naan (1.5) + Carrot Halwa (2/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2/3 cup) + Naan (1.25)",
//                         "Aloo Gobhi (2/3 cup) + Chapati (1.25) + Boondi Raita (2/3 cup)",
//                         "Chicken Curry (2/3 cup) + Rice (2/3 cup) + Mixed Vegetable Salad (2/3 bowl)",
//                         "Palak Paneer (2/3 cup) + Jeera Rice (2/3 cup)",
//                         "Mutton Rogan Josh (2/3 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Baingan Bharta (2/3 cup) + Chapati (1.25)",
//                         "Chicken Tikka (133 grams) + Mint Chutney (2/3 tablespoons) + Salad (2/3 bowl)",
//                         "Paneer Bhurji (2/3 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (2/3 cup) + Jeera Rice (2/3 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (4) + chutney (100 grams) + banana (2)",
//                         "Idli (6) + Sambar (2 cup) + Coconut Chutney (100 grams)",
//                         "Upma (2 cup) + Curd (2 cup) + Papaya (2 slice)",
//                         "Pongal (2 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (2 cup) + Mango (2 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2 cup) + Papad (4) + Curd (2 cup)",
//                         "Fish Curry (2 cup) + Rice (2 cup) + Veg Poriyal (2 bowl)",
//                         "Lemon Rice (2 cup) + Coconut Chutney (100 grams) + Curd (2 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (2 bowl)",
//                         "Chicken Chettinad (2 cup) + Rice (2 cup) + Cucumber Raita (2 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (4) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (2 cup) + Pickle (2 tablespoon) + Papad (4)",
//                         "Vegetable Biryani (2 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (4)",
//                         "Egg Curry (2 cup) + Rice (2 cup) + Spinach Poriyal (2 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (100 grams) + banana (2)",
//                         "Idli (4) + Sambar (1 cup) + Coconut Chutney (100 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (2 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (2 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (2 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (2)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (2) + Sambar (1/2 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (50 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Poached Egg (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.25) + Whole Wheat Toast (2.25 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Boiled Egg (1.25)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2.5) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 }
//             }
//         },

        
//         '3500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (5) + Curd (2.5 cup) + Mango Pickle (2.5 tablespoon)",
//                         "Chole (2.5 cup) + Bhature (5) + Salad (2.5 bowl)",
//                         "Paneer Tikka (500 grams) + Green Chutney (5 tablespoons) + Mixed Veg Raita (2.5 cup)",
//                         "Rajma (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Dal Makhani (2.5 cup) + Naan (2.5) + Carrot Halwa (2.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2.5 cup) + Naan (5)",
//                         "Aloo Gobhi (2.5 cup) + Chapati (5) + Boondi Raita (2.5 cup)",
//                         "Chicken Curry (2.5 cup) + Rice (2.5 cup) + Mixed Vegetable Salad (2.5 bowl)",
//                         "Palak Paneer (2.5 cup) + Jeera Rice (2.5 cup)",
//                         "Mutton Rogan Josh (2.5 cup) + Tandoori Roti (5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Baingan Bharta (2.5 cup) + Chapati (5)",
//                         "Chicken Tikka (500 grams) + Mint Chutney (5 tablespoons) + Salad (2.5 bowl)",
//                         "Paneer Bhurji (2.5 cup) + Paratha (5)",
//                         "Kadhai Paneer (2.5 cup) + Jeera Rice (2.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2.5) + Curd (1.25 cup) + Mango Pickle (1.25 tablespoon)",
//                         "Chole (1.25 cup) + Bhature (2.5) + Salad (1.25 bowl)",
//                         "Paneer Tikka (250 grams) + Green Chutney (2.5 tablespoons) + Mixed Veg Raita (1.25 cup)",
//                         "Rajma (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Dal Makhani (1.25 cup) + Naan (1.25) + Carrot Halwa (1.25 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.25 cup) + Naan (2.5)",
//                         "Aloo Gobhi (1.25 cup) + Chapati (2.5) + Boondi Raita (1.25 cup)",
//                         "Chicken Curry (1.25 cup) + Rice (1.25 cup) + Mixed Vegetable Salad (1.25 bowl)",
//                         "Palak Paneer (1.25 cup) + Jeera Rice (1.25 cup)",
//                         "Mutton Rogan Josh (1.25 cup) + Tandoori Roti (2.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Baingan Bharta (1.25 cup) + Chapati (2.5)",
//                         "Chicken Tikka (250 grams) + Mint Chutney (2.5 tablespoons) + Salad (1.25 bowl)",
//                         "Paneer Bhurji (1.25 cup) + Paratha (2.5)",
//                         "Kadhai Paneer (1.25 cup) + Jeera Rice (1.25 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1.25) + Curd (0.625 cup) + Mango Pickle (0.625 tablespoon)",
//                         "Chole (0.625 cup) + Bhature (1.25) + Salad (0.625 bowl)",
//                         "Paneer Tikka (125 grams) + Green Chutney (0.625 tablespoons) + Mixed Veg Raita (0.625 cup)",
//                         "Rajma (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Dal Makhani (0.625 cup) + Naan (1.25) + Carrot Halwa (0.625 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.625 cup) + Naan (1.25)",
//                         "Aloo Gobhi (0.625 cup) + Chapati (1.25) + Boondi Raita (0.625 cup)",
//                         "Chicken Curry (0.625 cup) + Rice (0.625 cup) + Mixed Vegetable Salad (0.625 bowl)",
//                         "Palak Paneer (0.625 cup) + Jeera Rice (0.625 cup)",
//                         "Mutton Rogan Josh (0.625 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Baingan Bharta (0.625 cup) + Chapati (1.25)",
//                         "Chicken Tikka (125 grams) + Mint Chutney (0.625 tablespoons) + Salad (0.625 bowl)",
//                         "Paneer Bhurji (0.625 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (0.625 cup) + Jeera Rice (0.625 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (7.5) + Sambar (2.5 cup) + Coconut Chutney (125 grams)",
//                         "Upma (2.5 cup) + Curd (2.5 cup) + Papaya (2.5 slice)",
//                         "Pongal (2.5 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (2.5 cup) + Mango (2.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2.5 cup) + Papad (5) + Curd (2.5 cup)",
//                         "Fish Curry (2.5 cup) + Rice (2.5 cup) + Veg Poriyal (2.5 bowl)",
//                         "Lemon Rice (2.5 cup) + Coconut Chutney (125 grams) + Curd (2.5 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (2.5 bowl)",
//                         "Chicken Chettinad (2.5 cup) + Rice (2.5 cup) + Cucumber Raita (2.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (2.5 cup) + Pickle (2.5 tablespoon) + Papad (5)",
//                         "Vegetable Biryani (2.5 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (5)",
//                         "Egg Curry (2.5 cup) + Rice (2.5 cup) + Spinach Poriyal (2.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2.5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (5) + Sambar (1.25 cup) + Coconut Chutney (125 grams)",
//                         "Upma (1.25 cup) + Curd (1.25 cup) + Papaya (2.5 slice)",
//                         "Pongal (1.25 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (1.25 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.25 cup) + Papad (2.5) + Curd (1.25 cup)",
//                         "Fish Curry (1.25 cup) + Rice (2.5 cup) + Veg Poriyal (1.25 bowl)",
//                         "Lemon Rice (1.25 cup) + Coconut Chutney (1.25 grams) + Curd (1.25 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (1.25 bowl)",
//                         "Chicken Chettinad (1.25 cup) + Rice (1.25 cup) + Cucumber Raita (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2.5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (1.25 cup) + Pickle (1.25 tablespoon) + Papad (2.5)",
//                         "Vegetable Biryani (1.25 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (2.5)",
//                         "Egg Curry (1.25 cup) + Rice (2.5 cup) + Spinach Poriyal (1.25 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1.25) + chutney (62.5 grams) + banana (1.25)",
//                         "Idli (2.5) + Sambar (0.625 cup) + Coconut Chutney (62.5 grams)",
//                         "Upma (0.625 cup) + Curd (0.625 cup) + Papaya (1.25 slice)",
//                         "Pongal (0.625 cup) + Coconut Chutney (62.5 grams) + Orange (1.25)",
//                         "Masala Dosa (1.25) + Sambar (0.625 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.625 cup) + Papad (1.25) + Curd (0.625 cup)",
//                         "Fish Curry (0.625 cup) + Rice (1.25 cup) + Veg Poriyal (0.625 bowl)",
//                         "Lemon Rice (0.625 cup) + Coconut Chutney (62.5 grams) + Curd (0.625 cup)",
//                         "Rasam (1.25 cup) + Rice (1.25 cup) + Beetroot Thoran (0.625 bowl)",
//                         "Chicken Chettinad (0.625 cup) + Rice (0.625 cup) + Cucumber Raita (0.625 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.25) + Coconut Chutney (62.5 grams) + Tomato Chutney (62.5 grams)",
//                         "Curd Rice (0.625 cup) + Pickle (0.625 tablespoon) + Papad (1.25)",
//                         "Vegetable Biryani (0.625 cup) + Raita (1.25 cup)",
//                         "Avial (1.25 cup) + Rice (1.25 cup) + Appalam (1.25)",
//                         "Egg Curry (0.625 cup) + Rice (1.25 cup) + Spinach Poriyal (0.625 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.75 cup) + Almonds (18) + Apple (1.75)",
//                         "Greek Yogurt (1.75 cup) + Blueberries (1.25 cup)",
//                         "Scrambled Eggs (5) + Whole Wheat Toast (3.75 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.75 slice) + Poached Egg (1.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.75 cup) + Mixed Green Salad",
//                         "Salmon (1.75 fillet) + Brown Rice (1.75 cup) + Broccoli (1.75 cup)",
//                         "Vegetable Stir Fry + Tofu (1.75 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.75 fillet) + Sweet Potato (1.75) + Asparagus (1.75 cup)",
//                         "Chicken Breast (1.75) + Couscous (1.75 cup) + Green Beans (1.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.75 cup)",
//                         "Quinoa Bowl + Black Beans (1.75 cup) + Corn (1.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Boiled Egg (1.5)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1.5 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 }
//             }
//         }
//     };

//     return options[calorieCategory][type][numberOfMeals][meal].map(option => `<option value="${option}">${option}</option>`).join('');
// }

// function showLoadingPage() {
//     document.querySelectorAll('.container > *').forEach(element => element.classList.add('hidden'));
//     document.getElementById('loading-page').classList.remove('hidden');
    
//     let countdown = 5;
//     const countdownElement = document.getElementById('countdown');
//     const progressBarFill = document.getElementById('progress-bar-fill');
    
//     const countdownInterval = setInterval(() => {
//         countdownElement.textContent = countdown;
//         progressBarFill.style.width = `${(5 - countdown) * 20}%`;
//         if (countdown === 0) {
//             clearInterval(countdownInterval);
//             generatePlan();
//             document.getElementById('loading-page').classList.add('hidden');
//             document.getElementById('diet-plan').classList.remove('hidden');
//             document.getElementById('explore-more').classList.remove('hidden');
//         }
//         countdown--;
//     }, 1000);
// }

// function generatePlan(calorieOverride = null) {
//     if (calorieOverride) {
//         calorieCategory = calorieOverride;
//         updateMealOptions();
//     }

//     const meals = document.getElementById('meals').value;

//     const dietPlanDetails = document.getElementById('diet-plan-details');
//     dietPlanDetails.innerHTML = `<h3>Category: ${calorieCategory} kcal</h3><h3>Meals: ${meals}</h3>`;

//     const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
//     if (meals == 4) {
//         mealLabels.splice(1, 0, 'Snack');
//     } else if (meals == 5) {
//         mealLabels.splice(1, 0, 'Snack1');
//         mealLabels.splice(3, 0, 'Snack2');
//     }

//     mealLabels.forEach(label => {
//         let mealType = '';
//         if (activityLevel === 'sedentary') {
//             mealType = document.getElementById(`north-${label.toLowerCase()}-select`).value || document.getElementById(`south-${label.toLowerCase()}-select`).value;
//         } else {
//             mealType = document.getElementById(`active-${label.toLowerCase()}-select`).value;
//         }
//         dietPlanDetails.innerHTML += `<div class="meal animated"><h4>${label}</h4><p>${mealType}</p></div>`;
//     });

//     textAnimation();
// }

// function calculateCalories(height, weight, gender) {
//     return (10 * weight) + (6.25 * height) - (5 * 25) + (gender === 'male' ? 5 : -161);
// }

// function downloadPlan() {
//     const dietPlanDetails = document.getElementById('diet-plan-details').innerHTML;
//     const blob = new Blob([dietPlanDetails], { type: 'text/html' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'diet_plan.html';
//     link.click();
// }

// function textAnimation() {
//     const elements = document.querySelectorAll('.animated');
//     elements.forEach((element, index) => {
//         setTimeout(() => {
//             element.classList.add('visible');
//         }, index * 500);
//     });
// }

// document.querySelectorAll('.meal-select').forEach(select => {
//     select.addEventListener('change', (event) => {
//         const selectedMeal = event.target.id.split('-')[1]; // breakfast, lunch, dinner, snack1, snack2
//         const selectedType = event.target.id.split('-')[0]; // north, south, active
//         const value = event.target.value;

//         if (value) {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//             }
//         } else {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//             }
//         }
//     });
// });



// document.getElementById('sedentary').addEventListener('click', () => {
//     resetForm();
//     showForm('sedentary');
// });

// document.getElementById('active').addEventListener('click', () => {
//     resetForm();
//     showForm('active');
// });

// document.querySelectorAll('#height, #weight, #gender, #meals').forEach(input => {
//     input.addEventListener('input', () => {
//         if (isFormFilled()) {
//             calculateAndShowMeals();
//         }
//     });
// });

// document.getElementById('generate-plan').addEventListener('click', (e) => {
//     e.preventDefault();
//     showLoadingPage();
// });

// document.getElementById('download-plan').addEventListener('click', downloadPlan);

// document.getElementById('explore-2000').addEventListener('click', () => generatePlan('2000'));
// document.getElementById('explore-2500').addEventListener('click', () => generatePlan('2500'));
// document.getElementById('explore-3000').addEventListener('click', () => generatePlan('3000'));
// document.getElementById('explore-3500').addEventListener('click', () => generatePlan('3500'));

// let activityLevel = '';
// let maintenanceCalories = 0;
// let calorieCategory = '2000';

// function resetForm() {
//     document.getElementById('diet-form').reset();
//     document.getElementById('form-container').classList.add('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
//     document.getElementById('diet-plan').classList.add('hidden');
//     document.getElementById('explore-more').classList.add('hidden');
//     document.querySelectorAll('.meal-select').forEach(select => {
//         select.innerHTML = '';
//     });
// }

// function showForm(level) {
//     activityLevel = level;
//     document.getElementById('form-container').classList.remove('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
// }

// function isFormFilled() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;
//     const meals = document.getElementById('meals').value;
//     return height && weight && gender && meals;
// }

// function calculateAndShowMeals() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;

//     maintenanceCalories = calculateCalories(height, weight, gender);
//     if (maintenanceCalories < 2000) {
//         maintenanceCalories = 2000;
//     } else if (maintenanceCalories > 3500) {
//         maintenanceCalories = 3500;
//     }

//     if (maintenanceCalories > 3200) {
//         calorieCategory = '3500';
//     } else if (maintenanceCalories > 2700) {
//         calorieCategory = '3000';
//     } else if (maintenanceCalories > 2200) {
//         calorieCategory = '2500';
//     } else {
//         calorieCategory = '2000';
//     }

//     updateMealOptions();
//     document.getElementById('meal-options').classList.remove('hidden');
// }

// function updateMealOptions() {
//     const northBreakfastSelect = document.getElementById('north-breakfast-select');
//     const northSnack1Select = document.getElementById('north-snack1-select');
//     const northLunchSelect = document.getElementById('north-lunch-select');
//     const northSnack2Select = document.getElementById('north-snack2-select');
//     const northDinnerSelect = document.getElementById('north-dinner-select');

//     const southBreakfastSelect = document.getElementById('south-breakfast-select');
//     const southSnack1Select = document.getElementById('south-snack1-select');
//     const southLunchSelect = document.getElementById('south-lunch-select');
//     const southSnack2Select = document.getElementById('south-snack2-select');
//     const southDinnerSelect = document.getElementById('south-dinner-select');

//     const activeBreakfastSelect = document.getElementById('active-breakfast-select');
//     const activeSnack1Select = document.getElementById('active-snack1-select');
//     const activeLunchSelect = document.getElementById('active-lunch-select');
//     const activeSnack2Select = document.getElementById('active-snack2-select');
//     const activeDinnerSelect = document.getElementById('active-dinner-select');

//     const numberOfMeals = document.getElementById('meals').value;

//     if (activityLevel === 'sedentary') {
//         document.getElementById('north-indian').classList.remove('hidden');
//         document.getElementById('south-indian').classList.remove('hidden');

//         northBreakfastSelect.innerHTML = getOptions('north', 'breakfast', numberOfMeals);
//         northSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('north', 'snack1', numberOfMeals) : '';
//         northLunchSelect.innerHTML = getOptions('north', 'lunch', numberOfMeals);
//         northSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('north', 'snack2', numberOfMeals) : '';
//         northDinnerSelect.innerHTML = getOptions('north', 'dinner', numberOfMeals);

//         southBreakfastSelect.innerHTML = getOptions('south', 'breakfast', numberOfMeals);
//         southSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('south', 'snack1', numberOfMeals) : '';
//         southLunchSelect.innerHTML = getOptions('south', 'lunch', numberOfMeals);
//         southSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('south', 'snack2', numberOfMeals) : '';
//         southDinnerSelect.innerHTML = getOptions('south', 'dinner', numberOfMeals);

//         toggleVisibility(northSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(northSnack2Select, numberOfMeals == 5);
//         toggleVisibility(southSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(southSnack2Select, numberOfMeals == 5);
//     } else {
//         document.getElementById('active-meals').classList.remove('hidden');

//         activeBreakfastSelect.innerHTML = getOptions('active', 'breakfast', numberOfMeals);
//         activeSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('active', 'snack1', numberOfMeals) : '';
//         activeLunchSelect.innerHTML = getOptions('active', 'lunch', numberOfMeals);
//         activeSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('active', 'snack2', numberOfMeals) : '';
//         activeDinnerSelect.innerHTML = getOptions('active', 'dinner', numberOfMeals);

//         toggleVisibility(activeSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(activeSnack2Select, numberOfMeals == 5);
//     }

//     document.getElementById('generate-plan').classList.remove('hidden');
// }

// function toggleVisibility(element, isVisible) {
//     if (isVisible) {
//         element.classList.remove('hidden');
//         element.previousElementSibling.classList.remove('hidden');
//     } else {
//         element.classList.add('hidden');
//         element.previousElementSibling.classList.add('hidden');
//     }
// }

// function getOptions(type, meal, numberOfMeals) {
//     const options = {
//         '2000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (1/2 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/2 cup) + Bhature (1) + Salad (1/2 bowl)",
//                         "Paneer Tikka (100 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1/2 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/2 cup) + Naan (1)",
//                         "Aloo Gobhi (1/2 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/2 cup) + Rice (1/2 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1/2 cup) + Tandoori Roti (1)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/2 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/2 cup) + Chapati (1)",
//                         "Chicken Tikka (100 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/2 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/2 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1/2) + Curd (1/3 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/3 cup) + Bhature (1) + Salad (1/3 bowl)",
//                         "Paneer Tikka (50 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1/2 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1/2 cup) + Naan (1) + Carrot Halwa (1/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/3 cup) + Naan (1)",
//                         "Aloo Gobhi (1/3 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/3 cup) + Rice (1/3 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1/2 cup)",
//                         "Mutton Rogan Josh (1/3 cup) + Tandoori Roti (1)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/3 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/3 cup) + Chapati (1)",
//                         "Chicken Tikka (70 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/3 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/3 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (1)",
//                         "Idli (3) + Sambar (1 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (1 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (1 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (50 grams) + banana (1)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1/2 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (25 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (25 grams) + banana (1)",
//                         "Idli (1) + Sambar (1/3 cup) + Coconut Chutney (25 grams)",
//                         "Upma (1/3 cup) + Curd (1/3 cup) + Papaya (1 slice)",
//                         "Pongal (1/3 cup) + Coconut Chutney (25 grams) + Orange (1/2)",
//                         "Masala Dosa (1) + Sambar (1/3 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/3 cup) + Papad (1) + Curd (1/3 cup)",
//                         "Fish Curry (1/3 cup) + Rice (1/2 cup) + Veg Poriyal (1/3 bowl)",
//                         "Lemon Rice (1/3 cup) + Coconut Chutney (25 grams) + Curd (1/3 cup)",
//                         "Rasam (1 cup) + Rice (1/2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/3 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (25 grams) + Tomato Chutney (25 grams)",
//                         "Curd Rice (1/3 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/3 cup) + Raita (1 cup)",
//                         "Avial (1/2 cup) + Rice (1/2 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1/2 cup) + Spinach Poriyal (1/2 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (1/2 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Poached Egg (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (3/4 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (3/4 cup) + Blueberries (1/3 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (3/4 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (3/4 cup) + Mixed Green Salad",
//                         "Salmon (3/4 fillet) + Brown Rice (3/4 cup) + Broccoli (3/4 cup)",
//                         "Vegetable Stir Fry + Tofu (3/4 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (3/4 fillet) + Sweet Potato (3/4) + Asparagus (3/4 cup)",
//                         "Chicken Breast (3/4) + Couscous (3/4 cup) + Green Beans (3/4 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (3/4 cup)",
//                         "Quinoa Bowl + Black Beans (3/4 cup) + Corn (3/4 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1/2 cup) + Almonds (5) + Apple (1/2)",
//                         "Greek Yogurt (1/2 cup) + Blueberries (1/4 cup)",
//                         "Scrambled Eggs (1) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1/2 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1/2 cup) + Mixed Green Salad",
//                         "Salmon (1/2 fillet) + Brown Rice (1/2 cup) + Broccoli (1/2 cup)",
//                         "Vegetable Stir Fry + Tofu (1/2 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1/2 fillet) + Sweet Potato (1/2) + Asparagus (1/2 cup)",
//                         "Chicken Breast (1/2) + Couscous (1/2 cup) + Green Beans (1/2 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1/2 cup)",
//                         "Quinoa Bowl + Black Beans (1/2 cup) + Corn (1/2 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1)"
//                     ]
//                 }
//             }
//         },

//         '2500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (3) + Curd (1.5 cup) + Mango Pickle (1.5 tablespoon)",
//                         "Chole (1.5 cup) + Bhature (3) + Salad (1.5 bowl)",
//                         "Paneer Tikka (300 grams) + Green Chutney (3 tablespoons) + Mixed Veg Raita (1.5 cup)",
//                         "Rajma (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Dal Makhani (1.5 cup) + Naan (1.5) + Carrot Halwa (1.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.5 cup) + Naan (3)",
//                         "Aloo Gobhi (1.5 cup) + Chapati (3) + Boondi Raita (1.5 cup)",
//                         "Chicken Curry (1.5 cup) + Rice (1.5 cup) + Mixed Vegetable Salad (1.5 bowl)",
//                         "Palak Paneer (1.5 cup) + Jeera Rice (1.5 cup)",
//                         "Mutton Rogan Josh (1.5 cup) + Tandoori Roti (3)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Baingan Bharta (1.5 cup) + Chapati (3)",
//                         "Chicken Tikka (300 grams) + Mint Chutney (3 tablespoons) + Salad (1.5 bowl)",
//                         "Paneer Bhurji (1.5 cup) + Paratha (3)",
//                         "Kadhai Paneer (1.5 cup) + Jeera Rice (1.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1.5) + Curd (0.75 cup) + Mango Pickle (0.75 tablespoon)",
//                         "Chole (0.75 cup) + Bhature (1.5) + Salad (0.75 bowl)",
//                         "Paneer Tikka (150 grams) + Green Chutney (1.5 tablespoons) + Mixed Veg Raita (0.75 cup)",
//                         "Rajma (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Dal Makhani (0.75 cup) + Naan (0.75) + Carrot Halwa (0.75 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.75 cup) + Naan (1.5)",
//                         "Aloo Gobhi (0.75 cup) + Chapati (1.5) + Boondi Raita (0.75 cup)",
//                         "Chicken Curry (0.75 cup) + Rice (0.75 cup) + Mixed Vegetable Salad (0.75 bowl)",
//                         "Palak Paneer (0.75 cup) + Jeera Rice (0.75 cup)",
//                         "Mutton Rogan Josh (0.75 cup) + Tandoori Roti (1.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Baingan Bharta (0.75 cup) + Chapati (1.5)",
//                         "Chicken Tikka (150 grams) + Mint Chutney (1.5 tablespoons) + Salad (0.75 bowl)",
//                         "Paneer Bhurji (0.75 cup) + Paratha (1.5)",
//                         "Kadhai Paneer (0.75 cup) + Jeera Rice (0.75 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (0.75) + Curd (0.375 cup) + Mango Pickle (0.375 tablespoon)",
//                         "Chole (0.375 cup) + Bhature (0.75) + Salad (0.375 bowl)",
//                         "Paneer Tikka (75 grams) + Green Chutney (0.75 tablespoons) + Mixed Veg Raita (0.375 cup)",
//                         "Rajma (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Dal Makhani (0.375 cup) + Naan (0.75) + Carrot Halwa (0.375 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.375 cup) + Naan (0.75)",
//                         "Aloo Gobhi (0.375 cup) + Chapati (0.75) + Boondi Raita (0.375 cup)",
//                         "Chicken Curry (0.375 cup) + Rice (0.375 cup) + Mixed Vegetable Salad (0.375 bowl)",
//                         "Palak Paneer (0.375 cup) + Jeera Rice (0.375 cup)",
//                         "Mutton Rogan Josh (0.375 cup) + Tandoori Roti (0.75)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Baingan Bharta (0.375 cup) + Chapati (0.75)",
//                         "Chicken Tikka (75 grams) + Mint Chutney (0.75 tablespoons) + Salad (0.375 bowl)",
//                         "Paneer Bhurji (0.375 cup) + Paratha (0.75)",
//                         "Kadhai Paneer (0.375 cup) + Jeera Rice (0.375 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (3) + chutney (75 grams) + banana (1.5)",
//                         "Idli (4.5) + Sambar (1.5 cup) + Coconut Chutney (75 grams)",
//                         "Upma (1.5 cup) + Curd (1.5 cup) + Papaya (1.5 slice)",
//                         "Pongal (1.5 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (1.5 cup) + Mango (1.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.5 cup) + Papad (3) + Curd (1.5 cup)",
//                         "Fish Curry (1.5 cup) + Rice (1.5 cup) + Veg Poriyal (1.5 bowl)",
//                         "Lemon Rice (1.5 cup) + Coconut Chutney (75 grams) + Curd (1.5 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (1.5 bowl)",
//                         "Chicken Chettinad (1.5 cup) + Rice (1.5 cup) + Cucumber Raita (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (3) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (1.5 cup) + Pickle (1.5 tablespoon) + Papad (3)",
//                         "Vegetable Biryani (1.5 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (3)",
//                         "Egg Curry (1.5 cup) + Rice (1.5 cup) + Spinach Poriyal (1.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1.5) + chutney (75 grams) + banana (1.5)",
//                         "Idli (3) + Sambar (0.75 cup) + Coconut Chutney (75 grams)",
//                         "Upma (0.75 cup) + Curd (0.75 cup) + Papaya (1.5 slice)",
//                         "Pongal (0.75 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (0.75 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.75 cup) + Papad (1.5) + Curd (0.75 cup)",
//                         "Fish Curry (0.75 cup) + Rice (1.5 cup) + Veg Poriyal (0.75 bowl)",
//                         "Lemon Rice (0.75 cup) + Coconut Chutney (0.375 grams) + Curd (0.75 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (0.75 bowl)",
//                         "Chicken Chettinad (0.75 cup) + Rice (0.75 cup) + Cucumber Raita (0.75 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.5) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (0.75 cup) + Pickle (0.75 tablespoon) + Papad (1.5)",
//                         "Vegetable Biryani (0.75 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (1.5)",
//                         "Egg Curry (0.75 cup) + Rice (1.5 cup) + Spinach Poriyal (0.75 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (0.75) + chutney (37.5 grams) + banana (1.5)",
//                         "Idli (1.5) + Sambar (0.375 cup) + Coconut Chutney (37.5 grams)",
//                         "Upma (0.375 cup) + Curd (0.375 cup) + Papaya (0.75 slice)",
//                         "Pongal (0.375 cup) + Coconut Chutney (37.5 grams) + Orange (0.75)",
//                         "Masala Dosa (0.75) + Sambar (0.375 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.375 cup) + Papad (0.75) + Curd (0.375 cup)",
//                         "Fish Curry (0.375 cup) + Rice (0.75 cup) + Veg Poriyal (0.375 bowl)",
//                         "Lemon Rice (0.375 cup) + Coconut Chutney (37.5 grams) + Curd (0.375 cup)",
//                         "Rasam (0.75 cup) + Rice (0.75 cup) + Beetroot Thoran (0.375 bowl)",
//                         "Chicken Chettinad (0.375 cup) + Rice (0.375 cup) + Cucumber Raita (0.375 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (0.75) + Coconut Chutney (37.5 grams) + Tomato Chutney (37.5 grams)",
//                         "Curd Rice (0.375 cup) + Pickle (0.375 tablespoon) + Papad (0.75)",
//                         "Vegetable Biryani (0.375 cup) + Raita (0.75 cup)",
//                         "Avial (0.75 cup) + Rice (0.75 cup) + Appalam (0.75)",
//                         "Egg Curry (0.375 cup) + Rice (0.75 cup) + Spinach Poriyal (0.375 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.5) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Poached Egg (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3.5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (0.75/4 cup) + Apple (1)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2.5)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (0.75 cup) + Almonds (7) + Apple (0.75)",
//                         "Greek Yogurt (0.75 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (0.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (0.75 cup) + Mixed Green Salad",
//                         "Salmon (0.75 fillet) + Brown Rice (0.75 cup) + Broccoli (0.75 cup)",
//                         "Vegetable Stir Fry + Tofu (0.75 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (0.75 fillet) + Sweet Potato (0.75) + Asparagus (0.75 cup)",
//                         "Chicken Breast (0.75) + Couscous (0.75 cup) + Green Beans (0.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (0.75 cup)",
//                         "Quinoa Bowl + Black Beans (0.75 cup) + Corn (0.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1.5)"
//                     ]
//                 }
//             }
//         },

//         '3000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (4) + Curd (2 cup) + Mango Pickle (2 tablespoon)",
//                         "Chole (2 cup) + Bhature (4) + Salad (2 bowl)",
//                         "Paneer Tikka (400 grams) + Green Chutney (4 tablespoons) + Mixed Veg Raita (2 cup)",
//                         "Rajma (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Dal Makhani (2 cup) + Naan (2) + Carrot Halwa (2 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2 cup) + Naan (4)",
//                         "Aloo Gobhi (2 cup) + Chapati (4) + Boondi Raita (2 cup)",
//                         "Chicken Curry (2 cup) + Rice (2 cup) + Mixed Vegetable Salad (2 bowl)",
//                         "Palak Paneer (2 cup) + Jeera Rice (2 cup)",
//                         "Mutton Rogan Josh (2 cup) + Tandoori Roti (4)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Baingan Bharta (2 cup) + Chapati (4)",
//                         "Chicken Tikka (400 grams) + Mint Chutney (4 tablespoons) + Salad (2 bowl)",
//                         "Paneer Bhurji (2 cup) + Paratha (4)",
//                         "Kadhai Paneer (2 cup) + Jeera Rice (2 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (2/3 cup) + Mango Pickle (2/3 tablespoon)",
//                         "Chole (2/3 cup) + Bhature (1.5) + Salad (2/3 bowl)",
//                         "Paneer Tikka (133 grams) + Green Chutney (2/3 tablespoons) + Mixed Veg Raita (2/3 cup)",
//                         "Rajma (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Dal Makhani (2/3 cup) + Naan (1.5) + Carrot Halwa (2/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2/3 cup) + Naan (1.25)",
//                         "Aloo Gobhi (2/3 cup) + Chapati (1.25) + Boondi Raita (2/3 cup)",
//                         "Chicken Curry (2/3 cup) + Rice (2/3 cup) + Mixed Vegetable Salad (2/3 bowl)",
//                         "Palak Paneer (2/3 cup) + Jeera Rice (2/3 cup)",
//                         "Mutton Rogan Josh (2/3 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Baingan Bharta (2/3 cup) + Chapati (1.25)",
//                         "Chicken Tikka (133 grams) + Mint Chutney (2/3 tablespoons) + Salad (2/3 bowl)",
//                         "Paneer Bhurji (2/3 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (2/3 cup) + Jeera Rice (2/3 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (4) + chutney (100 grams) + banana (2)",
//                         "Idli (6) + Sambar (2 cup) + Coconut Chutney (100 grams)",
//                         "Upma (2 cup) + Curd (2 cup) + Papaya (2 slice)",
//                         "Pongal (2 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (2 cup) + Mango (2 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2 cup) + Papad (4) + Curd (2 cup)",
//                         "Fish Curry (2 cup) + Rice (2 cup) + Veg Poriyal (2 bowl)",
//                         "Lemon Rice (2 cup) + Coconut Chutney (100 grams) + Curd (2 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (2 bowl)",
//                         "Chicken Chettinad (2 cup) + Rice (2 cup) + Cucumber Raita (2 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (4) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (2 cup) + Pickle (2 tablespoon) + Papad (4)",
//                         "Vegetable Biryani (2 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (4)",
//                         "Egg Curry (2 cup) + Rice (2 cup) + Spinach Poriyal (2 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (100 grams) + banana (2)",
//                         "Idli (4) + Sambar (1 cup) + Coconut Chutney (100 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (2 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (2 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (2 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (2)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (2) + Sambar (1/2 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (50 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Poached Egg (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.25) + Whole Wheat Toast (2.25 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Boiled Egg (1.25)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2.5) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 }
//             }
//         },

        
//         '3500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (5) + Curd (2.5 cup) + Mango Pickle (2.5 tablespoon)",
//                         "Chole (2.5 cup) + Bhature (5) + Salad (2.5 bowl)",
//                         "Paneer Tikka (500 grams) + Green Chutney (5 tablespoons) + Mixed Veg Raita (2.5 cup)",
//                         "Rajma (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Dal Makhani (2.5 cup) + Naan (2.5) + Carrot Halwa (2.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2.5 cup) + Naan (5)",
//                         "Aloo Gobhi (2.5 cup) + Chapati (5) + Boondi Raita (2.5 cup)",
//                         "Chicken Curry (2.5 cup) + Rice (2.5 cup) + Mixed Vegetable Salad (2.5 bowl)",
//                         "Palak Paneer (2.5 cup) + Jeera Rice (2.5 cup)",
//                         "Mutton Rogan Josh (2.5 cup) + Tandoori Roti (5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Baingan Bharta (2.5 cup) + Chapati (5)",
//                         "Chicken Tikka (500 grams) + Mint Chutney (5 tablespoons) + Salad (2.5 bowl)",
//                         "Paneer Bhurji (2.5 cup) + Paratha (5)",
//                         "Kadhai Paneer (2.5 cup) + Jeera Rice (2.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2.5) + Curd (1.25 cup) + Mango Pickle (1.25 tablespoon)",
//                         "Chole (1.25 cup) + Bhature (2.5) + Salad (1.25 bowl)",
//                         "Paneer Tikka (250 grams) + Green Chutney (2.5 tablespoons) + Mixed Veg Raita (1.25 cup)",
//                         "Rajma (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Dal Makhani (1.25 cup) + Naan (1.25) + Carrot Halwa (1.25 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.25 cup) + Naan (2.5)",
//                         "Aloo Gobhi (1.25 cup) + Chapati (2.5) + Boondi Raita (1.25 cup)",
//                         "Chicken Curry (1.25 cup) + Rice (1.25 cup) + Mixed Vegetable Salad (1.25 bowl)",
//                         "Palak Paneer (1.25 cup) + Jeera Rice (1.25 cup)",
//                         "Mutton Rogan Josh (1.25 cup) + Tandoori Roti (2.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Baingan Bharta (1.25 cup) + Chapati (2.5)",
//                         "Chicken Tikka (250 grams) + Mint Chutney (2.5 tablespoons) + Salad (1.25 bowl)",
//                         "Paneer Bhurji (1.25 cup) + Paratha (2.5)",
//                         "Kadhai Paneer (1.25 cup) + Jeera Rice (1.25 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1.25) + Curd (0.625 cup) + Mango Pickle (0.625 tablespoon)",
//                         "Chole (0.625 cup) + Bhature (1.25) + Salad (0.625 bowl)",
//                         "Paneer Tikka (125 grams) + Green Chutney (0.625 tablespoons) + Mixed Veg Raita (0.625 cup)",
//                         "Rajma (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Dal Makhani (0.625 cup) + Naan (1.25) + Carrot Halwa (0.625 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.625 cup) + Naan (1.25)",
//                         "Aloo Gobhi (0.625 cup) + Chapati (1.25) + Boondi Raita (0.625 cup)",
//                         "Chicken Curry (0.625 cup) + Rice (0.625 cup) + Mixed Vegetable Salad (0.625 bowl)",
//                         "Palak Paneer (0.625 cup) + Jeera Rice (0.625 cup)",
//                         "Mutton Rogan Josh (0.625 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Baingan Bharta (0.625 cup) + Chapati (1.25)",
//                         "Chicken Tikka (125 grams) + Mint Chutney (0.625 tablespoons) + Salad (0.625 bowl)",
//                         "Paneer Bhurji (0.625 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (0.625 cup) + Jeera Rice (0.625 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (7.5) + Sambar (2.5 cup) + Coconut Chutney (125 grams)",
//                         "Upma (2.5 cup) + Curd (2.5 cup) + Papaya (2.5 slice)",
//                         "Pongal (2.5 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (2.5 cup) + Mango (2.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2.5 cup) + Papad (5) + Curd (2.5 cup)",
//                         "Fish Curry (2.5 cup) + Rice (2.5 cup) + Veg Poriyal (2.5 bowl)",
//                         "Lemon Rice (2.5 cup) + Coconut Chutney (125 grams) + Curd (2.5 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (2.5 bowl)",
//                         "Chicken Chettinad (2.5 cup) + Rice (2.5 cup) + Cucumber Raita (2.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (2.5 cup) + Pickle (2.5 tablespoon) + Papad (5)",
//                         "Vegetable Biryani (2.5 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (5)",
//                         "Egg Curry (2.5 cup) + Rice (2.5 cup) + Spinach Poriyal (2.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2.5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (5) + Sambar (1.25 cup) + Coconut Chutney (125 grams)",
//                         "Upma (1.25 cup) + Curd (1.25 cup) + Papaya (2.5 slice)",
//                         "Pongal (1.25 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (1.25 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.25 cup) + Papad (2.5) + Curd (1.25 cup)",
//                         "Fish Curry (1.25 cup) + Rice (2.5 cup) + Veg Poriyal (1.25 bowl)",
//                         "Lemon Rice (1.25 cup) + Coconut Chutney (1.25 grams) + Curd (1.25 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (1.25 bowl)",
//                         "Chicken Chettinad (1.25 cup) + Rice (1.25 cup) + Cucumber Raita (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2.5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (1.25 cup) + Pickle (1.25 tablespoon) + Papad (2.5)",
//                         "Vegetable Biryani (1.25 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (2.5)",
//                         "Egg Curry (1.25 cup) + Rice (2.5 cup) + Spinach Poriyal (1.25 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1.25) + chutney (62.5 grams) + banana (1.25)",
//                         "Idli (2.5) + Sambar (0.625 cup) + Coconut Chutney (62.5 grams)",
//                         "Upma (0.625 cup) + Curd (0.625 cup) + Papaya (1.25 slice)",
//                         "Pongal (0.625 cup) + Coconut Chutney (62.5 grams) + Orange (1.25)",
//                         "Masala Dosa (1.25) + Sambar (0.625 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.625 cup) + Papad (1.25) + Curd (0.625 cup)",
//                         "Fish Curry (0.625 cup) + Rice (1.25 cup) + Veg Poriyal (0.625 bowl)",
//                         "Lemon Rice (0.625 cup) + Coconut Chutney (62.5 grams) + Curd (0.625 cup)",
//                         "Rasam (1.25 cup) + Rice (1.25 cup) + Beetroot Thoran (0.625 bowl)",
//                         "Chicken Chettinad (0.625 cup) + Rice (0.625 cup) + Cucumber Raita (0.625 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.25) + Coconut Chutney (62.5 grams) + Tomato Chutney (62.5 grams)",
//                         "Curd Rice (0.625 cup) + Pickle (0.625 tablespoon) + Papad (1.25)",
//                         "Vegetable Biryani (0.625 cup) + Raita (1.25 cup)",
//                         "Avial (1.25 cup) + Rice (1.25 cup) + Appalam (1.25)",
//                         "Egg Curry (0.625 cup) + Rice (1.25 cup) + Spinach Poriyal (0.625 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.75 cup) + Almonds (18) + Apple (1.75)",
//                         "Greek Yogurt (1.75 cup) + Blueberries (1.25 cup)",
//                         "Scrambled Eggs (5) + Whole Wheat Toast (3.75 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.75 slice) + Poached Egg (1.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.75 cup) + Mixed Green Salad",
//                         "Salmon (1.75 fillet) + Brown Rice (1.75 cup) + Broccoli (1.75 cup)",
//                         "Vegetable Stir Fry + Tofu (1.75 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.75 fillet) + Sweet Potato (1.75) + Asparagus (1.75 cup)",
//                         "Chicken Breast (1.75) + Couscous (1.75 cup) + Green Beans (1.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.75 cup)",
//                         "Quinoa Bowl + Black Beans (1.75 cup) + Corn (1.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Boiled Egg (1.5)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1.5 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 }
//             }
//         }
//     };

//     return options[calorieCategory][type][numberOfMeals][meal].map(option => `<option value="${option}">${option}</option>`).join('');
// }

// function showLoadingPage() {
//     document.querySelectorAll('.container > div').forEach(div => div.classList.add('hidden'));
//     document.getElementById('loading-page').classList.remove('hidden');
    
//     let countdown = 5;
//     const countdownElement = document.getElementById('countdown');
//     const progressBarFill = document.getElementById('progress-bar-fill');
    
//     const countdownInterval = setInterval(() => {
//         countdownElement.textContent = countdown;
//         progressBarFill.style.width = `${(5 - countdown) * 20}%`;
//         if (countdown === 0) {
//             clearInterval(countdownInterval);
//             generatePlan();
//             document.getElementById('loading-page').classList.add('hidden');
//             document.getElementById('diet-plan').classList.remove('hidden');
//             document.getElementById('explore-more').classList.remove('hidden');
//         }
//         countdown--;
//     }, 1000);
// }

// function generatePlan(calorieOverride = null) {
//     if (calorieOverride) {
//         calorieCategory = calorieOverride;
//         updateMealOptions();
//     }

//     const meals = document.getElementById('meals').value;

//     const dietPlanDetails = document.getElementById('diet-plan-details');
//     dietPlanDetails.innerHTML = `<h3>Category: ${calorieCategory} kcal</h3><h3>Meals: ${meals}</h3>`;

//     const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
//     if (meals == 4) {
//         mealLabels.splice(1, 0, 'Snack');
//     } else if (meals == 5) {
//         mealLabels.splice(1, 0, 'Snack1');
//         mealLabels.splice(3, 0, 'Snack2');
//     }

//     mealLabels.forEach(label => {
//         let mealType = '';
//         if (activityLevel === 'sedentary') {
//             mealType = document.getElementById(`north-${label.toLowerCase()}-select`).value || document.getElementById(`south-${label.toLowerCase()}-select`).value;
//         } else {
//             mealType = document.getElementById(`active-${label.toLowerCase()}-select`).value;
//         }
//         dietPlanDetails.innerHTML += `<div class="meal animated"><h4>${label}</h4><p>${mealType}</p></div>`;
//     });

//     textAnimation();
// }

// function calculateCalories(height, weight, gender) {
//     return (10 * weight) + (6.25 * height) - (5 * 25) + (gender === 'male' ? 5 : -161);
// }

// function downloadPlan() {
//     const dietPlanDetails = document.getElementById('diet-plan-details').innerHTML;
//     const blob = new Blob([dietPlanDetails], { type: 'text/html' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'diet_plan.html';
//     link.click();
// }

// function textAnimation() {
//     const elements = document.querySelectorAll('.animated');
//     elements.forEach((element, index) => {
//         setTimeout(() => {
//             element.classList.add('visible');
//         }, index * 500);
//     });
// }

// document.querySelectorAll('.meal-select').forEach(select => {
//     select.addEventListener('change', (event) => {
//         const selectedMeal = event.target.id.split('-')[1]; // breakfast, lunch, dinner, snack1, snack2
//         const selectedType = event.target.id.split('-')[0]; // north, south, active
//         const value = event.target.value;

//         if (value) {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//             }
//         } else {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//             }
//         }
//     });
// });




// document.getElementById('sedentary').addEventListener('click', () => {
//     resetForm();
//     showForm('sedentary');
// });

// document.getElementById('active').addEventListener('click', () => {
//     resetForm();
//     showForm('active');
// });

// document.querySelectorAll('#height, #weight, #gender, #meals').forEach(input => {
//     input.addEventListener('input', () => {
//         if (isFormFilled()) {
//             calculateAndShowMeals();
//         }
//     });
// });

// document.getElementById('generate-plan').addEventListener('click', (e) => {
//     e.preventDefault();
//     showLoadingPage();
// });

// document.getElementById('download-plan').addEventListener('click', downloadPlan);

// document.getElementById('explore-2000').addEventListener('click', () => generatePlan('2000'));
// document.getElementById('explore-2500').addEventListener('click', () => generatePlan('2500'));
// document.getElementById('explore-3000').addEventListener('click', () => generatePlan('3000'));
// document.getElementById('explore-3500').addEventListener('click', () => generatePlan('3500'));

// let activityLevel = '';
// let maintenanceCalories = 0;
// let calorieCategory = '2000';

// function resetForm() {
//     document.getElementById('diet-form').reset();
//     document.getElementById('form-container').classList.add('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
//     document.getElementById('diet-plan').classList.add('hidden');
//     document.getElementById('explore-more').classList.add('hidden');
//     document.querySelectorAll('.meal-select').forEach(select => {
//         select.innerHTML = '';
//     });
// }

// function showForm(level) {
//     activityLevel = level;
//     document.getElementById('form-container').classList.remove('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
// }

// function isFormFilled() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;
//     const meals = document.getElementById('meals').value;
//     return height && weight && gender && meals;
// }

// function calculateAndShowMeals() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;

//     maintenanceCalories = calculateCalories(height, weight, gender);
//     if (maintenanceCalories < 2000) {
//         maintenanceCalories = 2000;
//     } else if (maintenanceCalories > 3500) {
//         maintenanceCalories = 3500;
//     }

//     if (maintenanceCalories > 3200) {
//         calorieCategory = '3500';
//     } else if (maintenanceCalories > 2700) {
//         calorieCategory = '3000';
//     } else if (maintenanceCalories > 2200) {
//         calorieCategory = '2500';
//     } else {
//         calorieCategory = '2000';
//     }

//     updateMealOptions();
//     document.getElementById('meal-options').classList.remove('hidden');
// }

// function updateMealOptions() {
//     const northBreakfastSelect = document.getElementById('north-breakfast-select');
//     const northSnack1Select = document.getElementById('north-snack1-select');
//     const northLunchSelect = document.getElementById('north-lunch-select');
//     const northSnack2Select = document.getElementById('north-snack2-select');
//     const northDinnerSelect = document.getElementById('north-dinner-select');

//     const southBreakfastSelect = document.getElementById('south-breakfast-select');
//     const southSnack1Select = document.getElementById('south-snack1-select');
//     const southLunchSelect = document.getElementById('south-lunch-select');
//     const southSnack2Select = document.getElementById('south-snack2-select');
//     const southDinnerSelect = document.getElementById('south-dinner-select');

//     const activeBreakfastSelect = document.getElementById('active-breakfast-select');
//     const activeSnack1Select = document.getElementById('active-snack1-select');
//     const activeLunchSelect = document.getElementById('active-lunch-select');
//     const activeSnack2Select = document.getElementById('active-snack2-select');
//     const activeDinnerSelect = document.getElementById('active-dinner-select');

//     const numberOfMeals = document.getElementById('meals').value;

//     if (activityLevel === 'sedentary') {
//         document.getElementById('north-indian').classList.remove('hidden');
//         document.getElementById('south-indian').classList.remove('hidden');

//         northBreakfastSelect.innerHTML = getOptions('north', 'breakfast', numberOfMeals);
//         northSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('north', 'snack1', numberOfMeals) : '';
//         northLunchSelect.innerHTML = getOptions('north', 'lunch', numberOfMeals);
//         northSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('north', 'snack2', numberOfMeals) : '';
//         northDinnerSelect.innerHTML = getOptions('north', 'dinner', numberOfMeals);

//         southBreakfastSelect.innerHTML = getOptions('south', 'breakfast', numberOfMeals);
//         southSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('south', 'snack1', numberOfMeals) : '';
//         southLunchSelect.innerHTML = getOptions('south', 'lunch', numberOfMeals);
//         southSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('south', 'snack2', numberOfMeals) : '';
//         southDinnerSelect.innerHTML = getOptions('south', 'dinner', numberOfMeals);

//         toggleVisibility(northSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(northSnack2Select, numberOfMeals == 5);
//         toggleVisibility(southSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(southSnack2Select, numberOfMeals == 5);
//     } else {
//         document.getElementById('active-meals').classList.remove('hidden');

//         activeBreakfastSelect.innerHTML = getOptions('active', 'breakfast', numberOfMeals);
//         activeSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('active', 'snack1', numberOfMeals) : '';
//         activeLunchSelect.innerHTML = getOptions('active', 'lunch', numberOfMeals);
//         activeSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('active', 'snack2', numberOfMeals) : '';
//         activeDinnerSelect.innerHTML = getOptions('active', 'dinner', numberOfMeals);

//         toggleVisibility(activeSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(activeSnack2Select, numberOfMeals == 5);
//     }

//     document.getElementById('generate-plan').classList.remove('hidden');
// }

// function toggleVisibility(element, isVisible) {
//     if (isVisible) {
//         element.classList.remove('hidden');
//         element.previousElementSibling.classList.remove('hidden');
//     } else {
//         element.classList.add('hidden');
//         element.previousElementSibling.classList.add('hidden');
//     }
// }

// function getOptions(type, meal, numberOfMeals) {
//     const options = {
//         '2000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (1/2 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/2 cup) + Bhature (1) + Salad (1/2 bowl)",
//                         "Paneer Tikka (100 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1/2 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/2 cup) + Naan (1)",
//                         "Aloo Gobhi (1/2 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/2 cup) + Rice (1/2 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1/2 cup) + Tandoori Roti (1)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/2 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/2 cup) + Chapati (1)",
//                         "Chicken Tikka (100 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/2 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/2 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1/2) + Curd (1/3 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/3 cup) + Bhature (1) + Salad (1/3 bowl)",
//                         "Paneer Tikka (50 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1/2 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1/2 cup) + Naan (1) + Carrot Halwa (1/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/3 cup) + Naan (1)",
//                         "Aloo Gobhi (1/3 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/3 cup) + Rice (1/3 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1/2 cup)",
//                         "Mutton Rogan Josh (1/3 cup) + Tandoori Roti (1)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/3 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/3 cup) + Chapati (1)",
//                         "Chicken Tikka (70 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/3 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/3 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (1)",
//                         "Idli (3) + Sambar (1 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (1 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (1 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (50 grams) + banana (1)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1/2 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (25 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (25 grams) + banana (1)",
//                         "Idli (1) + Sambar (1/3 cup) + Coconut Chutney (25 grams)",
//                         "Upma (1/3 cup) + Curd (1/3 cup) + Papaya (1 slice)",
//                         "Pongal (1/3 cup) + Coconut Chutney (25 grams) + Orange (1/2)",
//                         "Masala Dosa (1) + Sambar (1/3 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/3 cup) + Papad (1) + Curd (1/3 cup)",
//                         "Fish Curry (1/3 cup) + Rice (1/2 cup) + Veg Poriyal (1/3 bowl)",
//                         "Lemon Rice (1/3 cup) + Coconut Chutney (25 grams) + Curd (1/3 cup)",
//                         "Rasam (1 cup) + Rice (1/2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/3 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (25 grams) + Tomato Chutney (25 grams)",
//                         "Curd Rice (1/3 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/3 cup) + Raita (1 cup)",
//                         "Avial (1/2 cup) + Rice (1/2 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1/2 cup) + Spinach Poriyal (1/2 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (1/2 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Poached Egg (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (3/4 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (3/4 cup) + Blueberries (1/3 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (3/4 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (3/4 cup) + Mixed Green Salad",
//                         "Salmon (3/4 fillet) + Brown Rice (3/4 cup) + Broccoli (3/4 cup)",
//                         "Vegetable Stir Fry + Tofu (3/4 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (3/4 fillet) + Sweet Potato (3/4) + Asparagus (3/4 cup)",
//                         "Chicken Breast (3/4) + Couscous (3/4 cup) + Green Beans (3/4 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (3/4 cup)",
//                         "Quinoa Bowl + Black Beans (3/4 cup) + Corn (3/4 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1/2 cup) + Almonds (5) + Apple (1/2)",
//                         "Greek Yogurt (1/2 cup) + Blueberries (1/4 cup)",
//                         "Scrambled Eggs (1) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1/2 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1/2 cup) + Mixed Green Salad",
//                         "Salmon (1/2 fillet) + Brown Rice (1/2 cup) + Broccoli (1/2 cup)",
//                         "Vegetable Stir Fry + Tofu (1/2 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1/2 fillet) + Sweet Potato (1/2) + Asparagus (1/2 cup)",
//                         "Chicken Breast (1/2) + Couscous (1/2 cup) + Green Beans (1/2 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1/2 cup)",
//                         "Quinoa Bowl + Black Beans (1/2 cup) + Corn (1/2 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1)"
//                     ]
//                 }
//             }
//         },

//         '2500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (3) + Curd (1.5 cup) + Mango Pickle (1.5 tablespoon)",
//                         "Chole (1.5 cup) + Bhature (3) + Salad (1.5 bowl)",
//                         "Paneer Tikka (300 grams) + Green Chutney (3 tablespoons) + Mixed Veg Raita (1.5 cup)",
//                         "Rajma (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Dal Makhani (1.5 cup) + Naan (1.5) + Carrot Halwa (1.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.5 cup) + Naan (3)",
//                         "Aloo Gobhi (1.5 cup) + Chapati (3) + Boondi Raita (1.5 cup)",
//                         "Chicken Curry (1.5 cup) + Rice (1.5 cup) + Mixed Vegetable Salad (1.5 bowl)",
//                         "Palak Paneer (1.5 cup) + Jeera Rice (1.5 cup)",
//                         "Mutton Rogan Josh (1.5 cup) + Tandoori Roti (3)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Baingan Bharta (1.5 cup) + Chapati (3)",
//                         "Chicken Tikka (300 grams) + Mint Chutney (3 tablespoons) + Salad (1.5 bowl)",
//                         "Paneer Bhurji (1.5 cup) + Paratha (3)",
//                         "Kadhai Paneer (1.5 cup) + Jeera Rice (1.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1.5) + Curd (0.75 cup) + Mango Pickle (0.75 tablespoon)",
//                         "Chole (0.75 cup) + Bhature (1.5) + Salad (0.75 bowl)",
//                         "Paneer Tikka (150 grams) + Green Chutney (1.5 tablespoons) + Mixed Veg Raita (0.75 cup)",
//                         "Rajma (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Dal Makhani (0.75 cup) + Naan (0.75) + Carrot Halwa (0.75 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.75 cup) + Naan (1.5)",
//                         "Aloo Gobhi (0.75 cup) + Chapati (1.5) + Boondi Raita (0.75 cup)",
//                         "Chicken Curry (0.75 cup) + Rice (0.75 cup) + Mixed Vegetable Salad (0.75 bowl)",
//                         "Palak Paneer (0.75 cup) + Jeera Rice (0.75 cup)",
//                         "Mutton Rogan Josh (0.75 cup) + Tandoori Roti (1.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Baingan Bharta (0.75 cup) + Chapati (1.5)",
//                         "Chicken Tikka (150 grams) + Mint Chutney (1.5 tablespoons) + Salad (0.75 bowl)",
//                         "Paneer Bhurji (0.75 cup) + Paratha (1.5)",
//                         "Kadhai Paneer (0.75 cup) + Jeera Rice (0.75 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (0.75) + Curd (0.375 cup) + Mango Pickle (0.375 tablespoon)",
//                         "Chole (0.375 cup) + Bhature (0.75) + Salad (0.375 bowl)",
//                         "Paneer Tikka (75 grams) + Green Chutney (0.75 tablespoons) + Mixed Veg Raita (0.375 cup)",
//                         "Rajma (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Dal Makhani (0.375 cup) + Naan (0.75) + Carrot Halwa (0.375 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.375 cup) + Naan (0.75)",
//                         "Aloo Gobhi (0.375 cup) + Chapati (0.75) + Boondi Raita (0.375 cup)",
//                         "Chicken Curry (0.375 cup) + Rice (0.375 cup) + Mixed Vegetable Salad (0.375 bowl)",
//                         "Palak Paneer (0.375 cup) + Jeera Rice (0.375 cup)",
//                         "Mutton Rogan Josh (0.375 cup) + Tandoori Roti (0.75)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Baingan Bharta (0.375 cup) + Chapati (0.75)",
//                         "Chicken Tikka (75 grams) + Mint Chutney (0.75 tablespoons) + Salad (0.375 bowl)",
//                         "Paneer Bhurji (0.375 cup) + Paratha (0.75)",
//                         "Kadhai Paneer (0.375 cup) + Jeera Rice (0.375 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (3) + chutney (75 grams) + banana (1.5)",
//                         "Idli (4.5) + Sambar (1.5 cup) + Coconut Chutney (75 grams)",
//                         "Upma (1.5 cup) + Curd (1.5 cup) + Papaya (1.5 slice)",
//                         "Pongal (1.5 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (1.5 cup) + Mango (1.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.5 cup) + Papad (3) + Curd (1.5 cup)",
//                         "Fish Curry (1.5 cup) + Rice (1.5 cup) + Veg Poriyal (1.5 bowl)",
//                         "Lemon Rice (1.5 cup) + Coconut Chutney (75 grams) + Curd (1.5 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (1.5 bowl)",
//                         "Chicken Chettinad (1.5 cup) + Rice (1.5 cup) + Cucumber Raita (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (3) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (1.5 cup) + Pickle (1.5 tablespoon) + Papad (3)",
//                         "Vegetable Biryani (1.5 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (3)",
//                         "Egg Curry (1.5 cup) + Rice (1.5 cup) + Spinach Poriyal (1.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1.5) + chutney (75 grams) + banana (1.5)",
//                         "Idli (3) + Sambar (0.75 cup) + Coconut Chutney (75 grams)",
//                         "Upma (0.75 cup) + Curd (0.75 cup) + Papaya (1.5 slice)",
//                         "Pongal (0.75 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (0.75 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.75 cup) + Papad (1.5) + Curd (0.75 cup)",
//                         "Fish Curry (0.75 cup) + Rice (1.5 cup) + Veg Poriyal (0.75 bowl)",
//                         "Lemon Rice (0.75 cup) + Coconut Chutney (0.375 grams) + Curd (0.75 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (0.75 bowl)",
//                         "Chicken Chettinad (0.75 cup) + Rice (0.75 cup) + Cucumber Raita (0.75 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.5) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (0.75 cup) + Pickle (0.75 tablespoon) + Papad (1.5)",
//                         "Vegetable Biryani (0.75 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (1.5)",
//                         "Egg Curry (0.75 cup) + Rice (1.5 cup) + Spinach Poriyal (0.75 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (0.75) + chutney (37.5 grams) + banana (1.5)",
//                         "Idli (1.5) + Sambar (0.375 cup) + Coconut Chutney (37.5 grams)",
//                         "Upma (0.375 cup) + Curd (0.375 cup) + Papaya (0.75 slice)",
//                         "Pongal (0.375 cup) + Coconut Chutney (37.5 grams) + Orange (0.75)",
//                         "Masala Dosa (0.75) + Sambar (0.375 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.375 cup) + Papad (0.75) + Curd (0.375 cup)",
//                         "Fish Curry (0.375 cup) + Rice (0.75 cup) + Veg Poriyal (0.375 bowl)",
//                         "Lemon Rice (0.375 cup) + Coconut Chutney (37.5 grams) + Curd (0.375 cup)",
//                         "Rasam (0.75 cup) + Rice (0.75 cup) + Beetroot Thoran (0.375 bowl)",
//                         "Chicken Chettinad (0.375 cup) + Rice (0.375 cup) + Cucumber Raita (0.375 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (0.75) + Coconut Chutney (37.5 grams) + Tomato Chutney (37.5 grams)",
//                         "Curd Rice (0.375 cup) + Pickle (0.375 tablespoon) + Papad (0.75)",
//                         "Vegetable Biryani (0.375 cup) + Raita (0.75 cup)",
//                         "Avial (0.75 cup) + Rice (0.75 cup) + Appalam (0.75)",
//                         "Egg Curry (0.375 cup) + Rice (0.75 cup) + Spinach Poriyal (0.375 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.5) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Poached Egg (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3.5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (0.75/4 cup) + Apple (1)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2.5)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (0.75 cup) + Almonds (7) + Apple (0.75)",
//                         "Greek Yogurt (0.75 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (0.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (0.75 cup) + Mixed Green Salad",
//                         "Salmon (0.75 fillet) + Brown Rice (0.75 cup) + Broccoli (0.75 cup)",
//                         "Vegetable Stir Fry + Tofu (0.75 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (0.75 fillet) + Sweet Potato (0.75) + Asparagus (0.75 cup)",
//                         "Chicken Breast (0.75) + Couscous (0.75 cup) + Green Beans (0.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (0.75 cup)",
//                         "Quinoa Bowl + Black Beans (0.75 cup) + Corn (0.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1.5)"
//                     ]
//                 }
//             }
//         },

//         '3000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (4) + Curd (2 cup) + Mango Pickle (2 tablespoon)",
//                         "Chole (2 cup) + Bhature (4) + Salad (2 bowl)",
//                         "Paneer Tikka (400 grams) + Green Chutney (4 tablespoons) + Mixed Veg Raita (2 cup)",
//                         "Rajma (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Dal Makhani (2 cup) + Naan (2) + Carrot Halwa (2 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2 cup) + Naan (4)",
//                         "Aloo Gobhi (2 cup) + Chapati (4) + Boondi Raita (2 cup)",
//                         "Chicken Curry (2 cup) + Rice (2 cup) + Mixed Vegetable Salad (2 bowl)",
//                         "Palak Paneer (2 cup) + Jeera Rice (2 cup)",
//                         "Mutton Rogan Josh (2 cup) + Tandoori Roti (4)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Baingan Bharta (2 cup) + Chapati (4)",
//                         "Chicken Tikka (400 grams) + Mint Chutney (4 tablespoons) + Salad (2 bowl)",
//                         "Paneer Bhurji (2 cup) + Paratha (4)",
//                         "Kadhai Paneer (2 cup) + Jeera Rice (2 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (2/3 cup) + Mango Pickle (2/3 tablespoon)",
//                         "Chole (2/3 cup) + Bhature (1.5) + Salad (2/3 bowl)",
//                         "Paneer Tikka (133 grams) + Green Chutney (2/3 tablespoons) + Mixed Veg Raita (2/3 cup)",
//                         "Rajma (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Dal Makhani (2/3 cup) + Naan (1.5) + Carrot Halwa (2/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2/3 cup) + Naan (1.25)",
//                         "Aloo Gobhi (2/3 cup) + Chapati (1.25) + Boondi Raita (2/3 cup)",
//                         "Chicken Curry (2/3 cup) + Rice (2/3 cup) + Mixed Vegetable Salad (2/3 bowl)",
//                         "Palak Paneer (2/3 cup) + Jeera Rice (2/3 cup)",
//                         "Mutton Rogan Josh (2/3 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Baingan Bharta (2/3 cup) + Chapati (1.25)",
//                         "Chicken Tikka (133 grams) + Mint Chutney (2/3 tablespoons) + Salad (2/3 bowl)",
//                         "Paneer Bhurji (2/3 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (2/3 cup) + Jeera Rice (2/3 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (4) + chutney (100 grams) + banana (2)",
//                         "Idli (6) + Sambar (2 cup) + Coconut Chutney (100 grams)",
//                         "Upma (2 cup) + Curd (2 cup) + Papaya (2 slice)",
//                         "Pongal (2 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (2 cup) + Mango (2 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2 cup) + Papad (4) + Curd (2 cup)",
//                         "Fish Curry (2 cup) + Rice (2 cup) + Veg Poriyal (2 bowl)",
//                         "Lemon Rice (2 cup) + Coconut Chutney (100 grams) + Curd (2 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (2 bowl)",
//                         "Chicken Chettinad (2 cup) + Rice (2 cup) + Cucumber Raita (2 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (4) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (2 cup) + Pickle (2 tablespoon) + Papad (4)",
//                         "Vegetable Biryani (2 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (4)",
//                         "Egg Curry (2 cup) + Rice (2 cup) + Spinach Poriyal (2 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (100 grams) + banana (2)",
//                         "Idli (4) + Sambar (1 cup) + Coconut Chutney (100 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (2 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (2 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (2 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (2)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (2) + Sambar (1/2 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (50 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Poached Egg (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.25) + Whole Wheat Toast (2.25 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Boiled Egg (1.25)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2.5) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 }
//             }
//         },

        
//         '3500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (5) + Curd (2.5 cup) + Mango Pickle (2.5 tablespoon)",
//                         "Chole (2.5 cup) + Bhature (5) + Salad (2.5 bowl)",
//                         "Paneer Tikka (500 grams) + Green Chutney (5 tablespoons) + Mixed Veg Raita (2.5 cup)",
//                         "Rajma (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Dal Makhani (2.5 cup) + Naan (2.5) + Carrot Halwa (2.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2.5 cup) + Naan (5)",
//                         "Aloo Gobhi (2.5 cup) + Chapati (5) + Boondi Raita (2.5 cup)",
//                         "Chicken Curry (2.5 cup) + Rice (2.5 cup) + Mixed Vegetable Salad (2.5 bowl)",
//                         "Palak Paneer (2.5 cup) + Jeera Rice (2.5 cup)",
//                         "Mutton Rogan Josh (2.5 cup) + Tandoori Roti (5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Baingan Bharta (2.5 cup) + Chapati (5)",
//                         "Chicken Tikka (500 grams) + Mint Chutney (5 tablespoons) + Salad (2.5 bowl)",
//                         "Paneer Bhurji (2.5 cup) + Paratha (5)",
//                         "Kadhai Paneer (2.5 cup) + Jeera Rice (2.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2.5) + Curd (1.25 cup) + Mango Pickle (1.25 tablespoon)",
//                         "Chole (1.25 cup) + Bhature (2.5) + Salad (1.25 bowl)",
//                         "Paneer Tikka (250 grams) + Green Chutney (2.5 tablespoons) + Mixed Veg Raita (1.25 cup)",
//                         "Rajma (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Dal Makhani (1.25 cup) + Naan (1.25) + Carrot Halwa (1.25 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.25 cup) + Naan (2.5)",
//                         "Aloo Gobhi (1.25 cup) + Chapati (2.5) + Boondi Raita (1.25 cup)",
//                         "Chicken Curry (1.25 cup) + Rice (1.25 cup) + Mixed Vegetable Salad (1.25 bowl)",
//                         "Palak Paneer (1.25 cup) + Jeera Rice (1.25 cup)",
//                         "Mutton Rogan Josh (1.25 cup) + Tandoori Roti (2.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Baingan Bharta (1.25 cup) + Chapati (2.5)",
//                         "Chicken Tikka (250 grams) + Mint Chutney (2.5 tablespoons) + Salad (1.25 bowl)",
//                         "Paneer Bhurji (1.25 cup) + Paratha (2.5)",
//                         "Kadhai Paneer (1.25 cup) + Jeera Rice (1.25 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1.25) + Curd (0.625 cup) + Mango Pickle (0.625 tablespoon)",
//                         "Chole (0.625 cup) + Bhature (1.25) + Salad (0.625 bowl)",
//                         "Paneer Tikka (125 grams) + Green Chutney (0.625 tablespoons) + Mixed Veg Raita (0.625 cup)",
//                         "Rajma (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Dal Makhani (0.625 cup) + Naan (1.25) + Carrot Halwa (0.625 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.625 cup) + Naan (1.25)",
//                         "Aloo Gobhi (0.625 cup) + Chapati (1.25) + Boondi Raita (0.625 cup)",
//                         "Chicken Curry (0.625 cup) + Rice (0.625 cup) + Mixed Vegetable Salad (0.625 bowl)",
//                         "Palak Paneer (0.625 cup) + Jeera Rice (0.625 cup)",
//                         "Mutton Rogan Josh (0.625 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Baingan Bharta (0.625 cup) + Chapati (1.25)",
//                         "Chicken Tikka (125 grams) + Mint Chutney (0.625 tablespoons) + Salad (0.625 bowl)",
//                         "Paneer Bhurji (0.625 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (0.625 cup) + Jeera Rice (0.625 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (7.5) + Sambar (2.5 cup) + Coconut Chutney (125 grams)",
//                         "Upma (2.5 cup) + Curd (2.5 cup) + Papaya (2.5 slice)",
//                         "Pongal (2.5 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (2.5 cup) + Mango (2.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2.5 cup) + Papad (5) + Curd (2.5 cup)",
//                         "Fish Curry (2.5 cup) + Rice (2.5 cup) + Veg Poriyal (2.5 bowl)",
//                         "Lemon Rice (2.5 cup) + Coconut Chutney (125 grams) + Curd (2.5 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (2.5 bowl)",
//                         "Chicken Chettinad (2.5 cup) + Rice (2.5 cup) + Cucumber Raita (2.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (2.5 cup) + Pickle (2.5 tablespoon) + Papad (5)",
//                         "Vegetable Biryani (2.5 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (5)",
//                         "Egg Curry (2.5 cup) + Rice (2.5 cup) + Spinach Poriyal (2.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2.5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (5) + Sambar (1.25 cup) + Coconut Chutney (125 grams)",
//                         "Upma (1.25 cup) + Curd (1.25 cup) + Papaya (2.5 slice)",
//                         "Pongal (1.25 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (1.25 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.25 cup) + Papad (2.5) + Curd (1.25 cup)",
//                         "Fish Curry (1.25 cup) + Rice (2.5 cup) + Veg Poriyal (1.25 bowl)",
//                         "Lemon Rice (1.25 cup) + Coconut Chutney (1.25 grams) + Curd (1.25 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (1.25 bowl)",
//                         "Chicken Chettinad (1.25 cup) + Rice (1.25 cup) + Cucumber Raita (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2.5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (1.25 cup) + Pickle (1.25 tablespoon) + Papad (2.5)",
//                         "Vegetable Biryani (1.25 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (2.5)",
//                         "Egg Curry (1.25 cup) + Rice (2.5 cup) + Spinach Poriyal (1.25 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1.25) + chutney (62.5 grams) + banana (1.25)",
//                         "Idli (2.5) + Sambar (0.625 cup) + Coconut Chutney (62.5 grams)",
//                         "Upma (0.625 cup) + Curd (0.625 cup) + Papaya (1.25 slice)",
//                         "Pongal (0.625 cup) + Coconut Chutney (62.5 grams) + Orange (1.25)",
//                         "Masala Dosa (1.25) + Sambar (0.625 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.625 cup) + Papad (1.25) + Curd (0.625 cup)",
//                         "Fish Curry (0.625 cup) + Rice (1.25 cup) + Veg Poriyal (0.625 bowl)",
//                         "Lemon Rice (0.625 cup) + Coconut Chutney (62.5 grams) + Curd (0.625 cup)",
//                         "Rasam (1.25 cup) + Rice (1.25 cup) + Beetroot Thoran (0.625 bowl)",
//                         "Chicken Chettinad (0.625 cup) + Rice (0.625 cup) + Cucumber Raita (0.625 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.25) + Coconut Chutney (62.5 grams) + Tomato Chutney (62.5 grams)",
//                         "Curd Rice (0.625 cup) + Pickle (0.625 tablespoon) + Papad (1.25)",
//                         "Vegetable Biryani (0.625 cup) + Raita (1.25 cup)",
//                         "Avial (1.25 cup) + Rice (1.25 cup) + Appalam (1.25)",
//                         "Egg Curry (0.625 cup) + Rice (1.25 cup) + Spinach Poriyal (0.625 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.75 cup) + Almonds (18) + Apple (1.75)",
//                         "Greek Yogurt (1.75 cup) + Blueberries (1.25 cup)",
//                         "Scrambled Eggs (5) + Whole Wheat Toast (3.75 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.75 slice) + Poached Egg (1.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.75 cup) + Mixed Green Salad",
//                         "Salmon (1.75 fillet) + Brown Rice (1.75 cup) + Broccoli (1.75 cup)",
//                         "Vegetable Stir Fry + Tofu (1.75 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.75 fillet) + Sweet Potato (1.75) + Asparagus (1.75 cup)",
//                         "Chicken Breast (1.75) + Couscous (1.75 cup) + Green Beans (1.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.75 cup)",
//                         "Quinoa Bowl + Black Beans (1.75 cup) + Corn (1.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Boiled Egg (1.5)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1.5 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 }
//             }
//         }
//     };

//     return options[calorieCategory][type][numberOfMeals][meal].map(option => `<option value="${option}">${option}</option>`).join('');
// }

// function showLoadingPage() {
//     document.querySelectorAll('.container > div').forEach(div => div.classList.add('hidden'));
//     document.getElementById('loading-page').classList.remove('hidden');
    
//     let countdown = 5;
//     const countdownElement = document.getElementById('countdown');
//     const progressBarFill = document.getElementById('progress-bar-fill');
    
//     const countdownInterval = setInterval(() => {
//         countdownElement.textContent = countdown;
//         progressBarFill.style.width = `${(5 - countdown) * 20}%`;
//         if (countdown === 0) {
//             clearInterval(countdownInterval);
//             generatePlan();
//             document.getElementById('loading-page').classList.add('hidden');
//             document.getElementById('diet-plan').classList.remove('hidden');
//         }
//         countdown--;
//     }, 1000);
// }

// function generatePlan(calorieOverride = null) {
//     if (calorieOverride) {
//         calorieCategory = calorieOverride;
//         updateMealOptions();
//     }

//     const meals = document.getElementById('meals').value;

//     const dietPlanDetails = document.getElementById('diet-plan-details');
//     dietPlanDetails.innerHTML = `<h3>Category: ${calorieCategory} kcal</h3><h3>Meals: ${meals}</h3>`;

//     const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
//     if (meals == 4) {
//         mealLabels.splice(1, 0, 'Snack');
//     } else if (meals == 5) {
//         mealLabels.splice(1, 0, 'Snack1');
//         mealLabels.splice(3, 0, 'Snack2');
//     }

//     mealLabels.forEach(label => {
//         let mealType = '';
//         if (activityLevel === 'sedentary') {
//             mealType = document.getElementById(`north-${label.toLowerCase()}-select`).value || document.getElementById(`south-${label.toLowerCase()}-select`).value;
//         } else {
//             mealType = document.getElementById(`active-${label.toLowerCase()}-select`).value;
//         }
//         dietPlanDetails.innerHTML += `<div class="meal"><h4>${label}</h4><p>${mealType}</p></div>`;
//     });

//     document.getElementById('explore-more').classList.remove('hidden');
// }

// function calculateCalories(height, weight, gender) {
//     return (10 * weight) + (6.25 * height) - (5 * 25) + (gender === 'male' ? 5 : -161);
// }

// function downloadPlan() {
//     const dietPlanDetails = document.getElementById('diet-plan-details').innerHTML;
//     const blob = new Blob([dietPlanDetails], { type: 'text/html' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'diet_plan.html';
//     link.click();
// }

// document.querySelectorAll('.meal-select').forEach(select => {
//     select.addEventListener('change', (event) => {
//         const selectedMeal = event.target.id.split('-')[1]; // breakfast, lunch, dinner, snack1, snack2
//         const selectedType = event.target.id.split('-')[0]; // north, south, active
//         const value = event.target.value;

//         if (value) {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//             }
//         } else {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//             }
//         }
//     });
// });



// document.getElementById('sedentary').addEventListener('click', () => {
//     resetForm();
//     showForm('sedentary');
// });

// document.getElementById('active').addEventListener('click', () => {
//     resetForm();
//     showForm('active');
// });

// document.querySelectorAll('#height, #weight, #gender, #meals').forEach(input => {
//     input.addEventListener('input', () => {
//         if (isFormFilled()) {
//             calculateAndShowMeals();
//         }
//     });
// });

// document.getElementById('generate-plan').addEventListener('click', (e) => {
//     e.preventDefault();
//     showLoadingPage();
// });

// document.getElementById('download-plan').addEventListener('click', downloadPlan);

// document.getElementById('explore-2000').addEventListener('click', () => generatePlan('2000'));
// document.getElementById('explore-2500').addEventListener('click', () => generatePlan('2500'));
// document.getElementById('explore-3000').addEventListener('click', () => generatePlan('3000'));
// document.getElementById('explore-3500').addEventListener('click', () => generatePlan('3500'));

// let activityLevel = '';
// let maintenanceCalories = 0;
// let calorieCategory = '2000';

// function resetForm() {
//     document.getElementById('diet-form').reset();
//     document.getElementById('form-container').classList.add('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
//     document.getElementById('diet-plan').classList.add('hidden');
//     document.getElementById('explore-more').classList.add('hidden');
//     document.querySelectorAll('.meal-select').forEach(select => {
//         select.innerHTML = '';
//     });
// }

// function showForm(level) {
//     activityLevel = level;
//     document.getElementById('form-container').classList.remove('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
// }

// function isFormFilled() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;
//     const meals = document.getElementById('meals').value;
//     return height && weight && gender && meals;
// }

// function calculateAndShowMeals() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;

//     maintenanceCalories = calculateCalories(height, weight, gender);
//     if (maintenanceCalories < 2000) {
//         maintenanceCalories = 2000;
//     } else if (maintenanceCalories > 3500) {
//         maintenanceCalories = 3500;
//     }

//     if (maintenanceCalories > 3200) {
//         calorieCategory = '3500';
//     } else if (maintenanceCalories > 2700) {
//         calorieCategory = '3000';
//     } else if (maintenanceCalories > 2200) {
//         calorieCategory = '2500';
//     } else {
//         calorieCategory = '2000';
//     }

//     updateMealOptions();
//     document.getElementById('meal-options').classList.remove('hidden');
// }

// function updateMealOptions() {
//     const northBreakfastSelect = document.getElementById('north-breakfast-select');
//     const northSnack1Select = document.getElementById('north-snack1-select');
//     const northLunchSelect = document.getElementById('north-lunch-select');
//     const northSnack2Select = document.getElementById('north-snack2-select');
//     const northDinnerSelect = document.getElementById('north-dinner-select');

//     const southBreakfastSelect = document.getElementById('south-breakfast-select');
//     const southSnack1Select = document.getElementById('south-snack1-select');
//     const southLunchSelect = document.getElementById('south-lunch-select');
//     const southSnack2Select = document.getElementById('south-snack2-select');
//     const southDinnerSelect = document.getElementById('south-dinner-select');

//     const activeBreakfastSelect = document.getElementById('active-breakfast-select');
//     const activeSnack1Select = document.getElementById('active-snack1-select');
//     const activeLunchSelect = document.getElementById('active-lunch-select');
//     const activeSnack2Select = document.getElementById('active-snack2-select');
//     const activeDinnerSelect = document.getElementById('active-dinner-select');

//     const numberOfMeals = document.getElementById('meals').value;

//     if (activityLevel === 'sedentary') {
//         document.getElementById('north-indian').classList.remove('hidden');
//         document.getElementById('south-indian').classList.remove('hidden');

//         northBreakfastSelect.innerHTML = getOptions('north', 'breakfast', numberOfMeals);
//         northSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('north', 'snack1', numberOfMeals) : '';
//         northLunchSelect.innerHTML = getOptions('north', 'lunch', numberOfMeals);
//         northSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('north', 'snack2', numberOfMeals) : '';
//         northDinnerSelect.innerHTML = getOptions('north', 'dinner', numberOfMeals);

//         southBreakfastSelect.innerHTML = getOptions('south', 'breakfast', numberOfMeals);
//         southSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('south', 'snack1', numberOfMeals) : '';
//         southLunchSelect.innerHTML = getOptions('south', 'lunch', numberOfMeals);
//         southSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('south', 'snack2', numberOfMeals) : '';
//         southDinnerSelect.innerHTML = getOptions('south', 'dinner', numberOfMeals);

//         toggleVisibility(northSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(northSnack2Select, numberOfMeals == 5);
//         toggleVisibility(southSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(southSnack2Select, numberOfMeals == 5);
//     } else {
//         document.getElementById('active-meals').classList.remove('hidden');

//         activeBreakfastSelect.innerHTML = getOptions('active', 'breakfast', numberOfMeals);
//         activeSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('active', 'snack1', numberOfMeals) : '';
//         activeLunchSelect.innerHTML = getOptions('active', 'lunch', numberOfMeals);
//         activeSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('active', 'snack2', numberOfMeals) : '';
//         activeDinnerSelect.innerHTML = getOptions('active', 'dinner', numberOfMeals);

//         toggleVisibility(activeSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(activeSnack2Select, numberOfMeals == 5);
//     }

//     document.getElementById('generate-plan').classList.remove('hidden');
// }

// function toggleVisibility(element, isVisible) {
//     if (isVisible) {
//         element.classList.remove('hidden');
//         element.previousElementSibling.classList.remove('hidden');
//     } else {
//         element.classList.add('hidden');
//         element.previousElementSibling.classList.add('hidden');
//     }
// }

// function getOptions(type, meal, numberOfMeals) {
//     const options = {
//         '2000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (1/2 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/2 cup) + Bhature (1) + Salad (1/2 bowl)",
//                         "Paneer Tikka (100 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1/2 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/2 cup) + Naan (1)",
//                         "Aloo Gobhi (1/2 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/2 cup) + Rice (1/2 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1/2 cup) + Tandoori Roti (1)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/2 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/2 cup) + Chapati (1)",
//                         "Chicken Tikka (100 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/2 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/2 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1/2) + Curd (1/3 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/3 cup) + Bhature (1) + Salad (1/3 bowl)",
//                         "Paneer Tikka (50 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1/2 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1/2 cup) + Naan (1) + Carrot Halwa (1/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/3 cup) + Naan (1)",
//                         "Aloo Gobhi (1/3 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/3 cup) + Rice (1/3 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1/2 cup)",
//                         "Mutton Rogan Josh (1/3 cup) + Tandoori Roti (1)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/3 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/3 cup) + Chapati (1)",
//                         "Chicken Tikka (70 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/3 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/3 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (1)",
//                         "Idli (3) + Sambar (1 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (1 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (1 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (50 grams) + banana (1)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1/2 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (25 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (25 grams) + banana (1)",
//                         "Idli (1) + Sambar (1/3 cup) + Coconut Chutney (25 grams)",
//                         "Upma (1/3 cup) + Curd (1/3 cup) + Papaya (1 slice)",
//                         "Pongal (1/3 cup) + Coconut Chutney (25 grams) + Orange (1/2)",
//                         "Masala Dosa (1) + Sambar (1/3 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/3 cup) + Papad (1) + Curd (1/3 cup)",
//                         "Fish Curry (1/3 cup) + Rice (1/2 cup) + Veg Poriyal (1/3 bowl)",
//                         "Lemon Rice (1/3 cup) + Coconut Chutney (25 grams) + Curd (1/3 cup)",
//                         "Rasam (1 cup) + Rice (1/2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/3 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (25 grams) + Tomato Chutney (25 grams)",
//                         "Curd Rice (1/3 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/3 cup) + Raita (1 cup)",
//                         "Avial (1/2 cup) + Rice (1/2 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1/2 cup) + Spinach Poriyal (1/2 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (1/2 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Poached Egg (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (3/4 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (3/4 cup) + Blueberries (1/3 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (3/4 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (3/4 cup) + Mixed Green Salad",
//                         "Salmon (3/4 fillet) + Brown Rice (3/4 cup) + Broccoli (3/4 cup)",
//                         "Vegetable Stir Fry + Tofu (3/4 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (3/4 fillet) + Sweet Potato (3/4) + Asparagus (3/4 cup)",
//                         "Chicken Breast (3/4) + Couscous (3/4 cup) + Green Beans (3/4 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (3/4 cup)",
//                         "Quinoa Bowl + Black Beans (3/4 cup) + Corn (3/4 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1/2 cup) + Almonds (5) + Apple (1/2)",
//                         "Greek Yogurt (1/2 cup) + Blueberries (1/4 cup)",
//                         "Scrambled Eggs (1) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1/2 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1/2 cup) + Mixed Green Salad",
//                         "Salmon (1/2 fillet) + Brown Rice (1/2 cup) + Broccoli (1/2 cup)",
//                         "Vegetable Stir Fry + Tofu (1/2 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1/2 fillet) + Sweet Potato (1/2) + Asparagus (1/2 cup)",
//                         "Chicken Breast (1/2) + Couscous (1/2 cup) + Green Beans (1/2 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1/2 cup)",
//                         "Quinoa Bowl + Black Beans (1/2 cup) + Corn (1/2 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1)"
//                     ]
//                 }
//             }
//         },

//         '2500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (3) + Curd (1.5 cup) + Mango Pickle (1.5 tablespoon)",
//                         "Chole (1.5 cup) + Bhature (3) + Salad (1.5 bowl)",
//                         "Paneer Tikka (300 grams) + Green Chutney (3 tablespoons) + Mixed Veg Raita (1.5 cup)",
//                         "Rajma (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Dal Makhani (1.5 cup) + Naan (1.5) + Carrot Halwa (1.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.5 cup) + Naan (3)",
//                         "Aloo Gobhi (1.5 cup) + Chapati (3) + Boondi Raita (1.5 cup)",
//                         "Chicken Curry (1.5 cup) + Rice (1.5 cup) + Mixed Vegetable Salad (1.5 bowl)",
//                         "Palak Paneer (1.5 cup) + Jeera Rice (1.5 cup)",
//                         "Mutton Rogan Josh (1.5 cup) + Tandoori Roti (3)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Baingan Bharta (1.5 cup) + Chapati (3)",
//                         "Chicken Tikka (300 grams) + Mint Chutney (3 tablespoons) + Salad (1.5 bowl)",
//                         "Paneer Bhurji (1.5 cup) + Paratha (3)",
//                         "Kadhai Paneer (1.5 cup) + Jeera Rice (1.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1.5) + Curd (0.75 cup) + Mango Pickle (0.75 tablespoon)",
//                         "Chole (0.75 cup) + Bhature (1.5) + Salad (0.75 bowl)",
//                         "Paneer Tikka (150 grams) + Green Chutney (1.5 tablespoons) + Mixed Veg Raita (0.75 cup)",
//                         "Rajma (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Dal Makhani (0.75 cup) + Naan (0.75) + Carrot Halwa (0.75 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.75 cup) + Naan (1.5)",
//                         "Aloo Gobhi (0.75 cup) + Chapati (1.5) + Boondi Raita (0.75 cup)",
//                         "Chicken Curry (0.75 cup) + Rice (0.75 cup) + Mixed Vegetable Salad (0.75 bowl)",
//                         "Palak Paneer (0.75 cup) + Jeera Rice (0.75 cup)",
//                         "Mutton Rogan Josh (0.75 cup) + Tandoori Roti (1.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Baingan Bharta (0.75 cup) + Chapati (1.5)",
//                         "Chicken Tikka (150 grams) + Mint Chutney (1.5 tablespoons) + Salad (0.75 bowl)",
//                         "Paneer Bhurji (0.75 cup) + Paratha (1.5)",
//                         "Kadhai Paneer (0.75 cup) + Jeera Rice (0.75 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (0.75) + Curd (0.375 cup) + Mango Pickle (0.375 tablespoon)",
//                         "Chole (0.375 cup) + Bhature (0.75) + Salad (0.375 bowl)",
//                         "Paneer Tikka (75 grams) + Green Chutney (0.75 tablespoons) + Mixed Veg Raita (0.375 cup)",
//                         "Rajma (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Dal Makhani (0.375 cup) + Naan (0.75) + Carrot Halwa (0.375 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.375 cup) + Naan (0.75)",
//                         "Aloo Gobhi (0.375 cup) + Chapati (0.75) + Boondi Raita (0.375 cup)",
//                         "Chicken Curry (0.375 cup) + Rice (0.375 cup) + Mixed Vegetable Salad (0.375 bowl)",
//                         "Palak Paneer (0.375 cup) + Jeera Rice (0.375 cup)",
//                         "Mutton Rogan Josh (0.375 cup) + Tandoori Roti (0.75)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Baingan Bharta (0.375 cup) + Chapati (0.75)",
//                         "Chicken Tikka (75 grams) + Mint Chutney (0.75 tablespoons) + Salad (0.375 bowl)",
//                         "Paneer Bhurji (0.375 cup) + Paratha (0.75)",
//                         "Kadhai Paneer (0.375 cup) + Jeera Rice (0.375 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (3) + chutney (75 grams) + banana (1.5)",
//                         "Idli (4.5) + Sambar (1.5 cup) + Coconut Chutney (75 grams)",
//                         "Upma (1.5 cup) + Curd (1.5 cup) + Papaya (1.5 slice)",
//                         "Pongal (1.5 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (1.5 cup) + Mango (1.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.5 cup) + Papad (3) + Curd (1.5 cup)",
//                         "Fish Curry (1.5 cup) + Rice (1.5 cup) + Veg Poriyal (1.5 bowl)",
//                         "Lemon Rice (1.5 cup) + Coconut Chutney (75 grams) + Curd (1.5 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (1.5 bowl)",
//                         "Chicken Chettinad (1.5 cup) + Rice (1.5 cup) + Cucumber Raita (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (3) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (1.5 cup) + Pickle (1.5 tablespoon) + Papad (3)",
//                         "Vegetable Biryani (1.5 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (3)",
//                         "Egg Curry (1.5 cup) + Rice (1.5 cup) + Spinach Poriyal (1.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1.5) + chutney (75 grams) + banana (1.5)",
//                         "Idli (3) + Sambar (0.75 cup) + Coconut Chutney (75 grams)",
//                         "Upma (0.75 cup) + Curd (0.75 cup) + Papaya (1.5 slice)",
//                         "Pongal (0.75 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (0.75 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.75 cup) + Papad (1.5) + Curd (0.75 cup)",
//                         "Fish Curry (0.75 cup) + Rice (1.5 cup) + Veg Poriyal (0.75 bowl)",
//                         "Lemon Rice (0.75 cup) + Coconut Chutney (0.375 grams) + Curd (0.75 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (0.75 bowl)",
//                         "Chicken Chettinad (0.75 cup) + Rice (0.75 cup) + Cucumber Raita (0.75 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.5) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (0.75 cup) + Pickle (0.75 tablespoon) + Papad (1.5)",
//                         "Vegetable Biryani (0.75 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (1.5)",
//                         "Egg Curry (0.75 cup) + Rice (1.5 cup) + Spinach Poriyal (0.75 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (0.75) + chutney (37.5 grams) + banana (1.5)",
//                         "Idli (1.5) + Sambar (0.375 cup) + Coconut Chutney (37.5 grams)",
//                         "Upma (0.375 cup) + Curd (0.375 cup) + Papaya (0.75 slice)",
//                         "Pongal (0.375 cup) + Coconut Chutney (37.5 grams) + Orange (0.75)",
//                         "Masala Dosa (0.75) + Sambar (0.375 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.375 cup) + Papad (0.75) + Curd (0.375 cup)",
//                         "Fish Curry (0.375 cup) + Rice (0.75 cup) + Veg Poriyal (0.375 bowl)",
//                         "Lemon Rice (0.375 cup) + Coconut Chutney (37.5 grams) + Curd (0.375 cup)",
//                         "Rasam (0.75 cup) + Rice (0.75 cup) + Beetroot Thoran (0.375 bowl)",
//                         "Chicken Chettinad (0.375 cup) + Rice (0.375 cup) + Cucumber Raita (0.375 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (0.75) + Coconut Chutney (37.5 grams) + Tomato Chutney (37.5 grams)",
//                         "Curd Rice (0.375 cup) + Pickle (0.375 tablespoon) + Papad (0.75)",
//                         "Vegetable Biryani (0.375 cup) + Raita (0.75 cup)",
//                         "Avial (0.75 cup) + Rice (0.75 cup) + Appalam (0.75)",
//                         "Egg Curry (0.375 cup) + Rice (0.75 cup) + Spinach Poriyal (0.375 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.5) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Poached Egg (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3.5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (0.75/4 cup) + Apple (1)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2.5)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (0.75 cup) + Almonds (7) + Apple (0.75)",
//                         "Greek Yogurt (0.75 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (0.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (0.75 cup) + Mixed Green Salad",
//                         "Salmon (0.75 fillet) + Brown Rice (0.75 cup) + Broccoli (0.75 cup)",
//                         "Vegetable Stir Fry + Tofu (0.75 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (0.75 fillet) + Sweet Potato (0.75) + Asparagus (0.75 cup)",
//                         "Chicken Breast (0.75) + Couscous (0.75 cup) + Green Beans (0.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (0.75 cup)",
//                         "Quinoa Bowl + Black Beans (0.75 cup) + Corn (0.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1.5)"
//                     ]
//                 }
//             }
//         },

//         '3000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (4) + Curd (2 cup) + Mango Pickle (2 tablespoon)",
//                         "Chole (2 cup) + Bhature (4) + Salad (2 bowl)",
//                         "Paneer Tikka (400 grams) + Green Chutney (4 tablespoons) + Mixed Veg Raita (2 cup)",
//                         "Rajma (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Dal Makhani (2 cup) + Naan (2) + Carrot Halwa (2 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2 cup) + Naan (4)",
//                         "Aloo Gobhi (2 cup) + Chapati (4) + Boondi Raita (2 cup)",
//                         "Chicken Curry (2 cup) + Rice (2 cup) + Mixed Vegetable Salad (2 bowl)",
//                         "Palak Paneer (2 cup) + Jeera Rice (2 cup)",
//                         "Mutton Rogan Josh (2 cup) + Tandoori Roti (4)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Baingan Bharta (2 cup) + Chapati (4)",
//                         "Chicken Tikka (400 grams) + Mint Chutney (4 tablespoons) + Salad (2 bowl)",
//                         "Paneer Bhurji (2 cup) + Paratha (4)",
//                         "Kadhai Paneer (2 cup) + Jeera Rice (2 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (2/3 cup) + Mango Pickle (2/3 tablespoon)",
//                         "Chole (2/3 cup) + Bhature (1.5) + Salad (2/3 bowl)",
//                         "Paneer Tikka (133 grams) + Green Chutney (2/3 tablespoons) + Mixed Veg Raita (2/3 cup)",
//                         "Rajma (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Dal Makhani (2/3 cup) + Naan (1.5) + Carrot Halwa (2/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2/3 cup) + Naan (1.25)",
//                         "Aloo Gobhi (2/3 cup) + Chapati (1.25) + Boondi Raita (2/3 cup)",
//                         "Chicken Curry (2/3 cup) + Rice (2/3 cup) + Mixed Vegetable Salad (2/3 bowl)",
//                         "Palak Paneer (2/3 cup) + Jeera Rice (2/3 cup)",
//                         "Mutton Rogan Josh (2/3 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Baingan Bharta (2/3 cup) + Chapati (1.25)",
//                         "Chicken Tikka (133 grams) + Mint Chutney (2/3 tablespoons) + Salad (2/3 bowl)",
//                         "Paneer Bhurji (2/3 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (2/3 cup) + Jeera Rice (2/3 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (4) + chutney (100 grams) + banana (2)",
//                         "Idli (6) + Sambar (2 cup) + Coconut Chutney (100 grams)",
//                         "Upma (2 cup) + Curd (2 cup) + Papaya (2 slice)",
//                         "Pongal (2 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (2 cup) + Mango (2 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2 cup) + Papad (4) + Curd (2 cup)",
//                         "Fish Curry (2 cup) + Rice (2 cup) + Veg Poriyal (2 bowl)",
//                         "Lemon Rice (2 cup) + Coconut Chutney (100 grams) + Curd (2 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (2 bowl)",
//                         "Chicken Chettinad (2 cup) + Rice (2 cup) + Cucumber Raita (2 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (4) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (2 cup) + Pickle (2 tablespoon) + Papad (4)",
//                         "Vegetable Biryani (2 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (4)",
//                         "Egg Curry (2 cup) + Rice (2 cup) + Spinach Poriyal (2 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (100 grams) + banana (2)",
//                         "Idli (4) + Sambar (1 cup) + Coconut Chutney (100 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (2 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (2 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (2 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (2)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (2) + Sambar (1/2 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (50 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Poached Egg (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.25) + Whole Wheat Toast (2.25 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Boiled Egg (1.25)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2.5) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 }
//             }
//         },

        
//         '3500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (5) + Curd (2.5 cup) + Mango Pickle (2.5 tablespoon)",
//                         "Chole (2.5 cup) + Bhature (5) + Salad (2.5 bowl)",
//                         "Paneer Tikka (500 grams) + Green Chutney (5 tablespoons) + Mixed Veg Raita (2.5 cup)",
//                         "Rajma (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Dal Makhani (2.5 cup) + Naan (2.5) + Carrot Halwa (2.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2.5 cup) + Naan (5)",
//                         "Aloo Gobhi (2.5 cup) + Chapati (5) + Boondi Raita (2.5 cup)",
//                         "Chicken Curry (2.5 cup) + Rice (2.5 cup) + Mixed Vegetable Salad (2.5 bowl)",
//                         "Palak Paneer (2.5 cup) + Jeera Rice (2.5 cup)",
//                         "Mutton Rogan Josh (2.5 cup) + Tandoori Roti (5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Baingan Bharta (2.5 cup) + Chapati (5)",
//                         "Chicken Tikka (500 grams) + Mint Chutney (5 tablespoons) + Salad (2.5 bowl)",
//                         "Paneer Bhurji (2.5 cup) + Paratha (5)",
//                         "Kadhai Paneer (2.5 cup) + Jeera Rice (2.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2.5) + Curd (1.25 cup) + Mango Pickle (1.25 tablespoon)",
//                         "Chole (1.25 cup) + Bhature (2.5) + Salad (1.25 bowl)",
//                         "Paneer Tikka (250 grams) + Green Chutney (2.5 tablespoons) + Mixed Veg Raita (1.25 cup)",
//                         "Rajma (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Dal Makhani (1.25 cup) + Naan (1.25) + Carrot Halwa (1.25 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.25 cup) + Naan (2.5)",
//                         "Aloo Gobhi (1.25 cup) + Chapati (2.5) + Boondi Raita (1.25 cup)",
//                         "Chicken Curry (1.25 cup) + Rice (1.25 cup) + Mixed Vegetable Salad (1.25 bowl)",
//                         "Palak Paneer (1.25 cup) + Jeera Rice (1.25 cup)",
//                         "Mutton Rogan Josh (1.25 cup) + Tandoori Roti (2.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Baingan Bharta (1.25 cup) + Chapati (2.5)",
//                         "Chicken Tikka (250 grams) + Mint Chutney (2.5 tablespoons) + Salad (1.25 bowl)",
//                         "Paneer Bhurji (1.25 cup) + Paratha (2.5)",
//                         "Kadhai Paneer (1.25 cup) + Jeera Rice (1.25 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1.25) + Curd (0.625 cup) + Mango Pickle (0.625 tablespoon)",
//                         "Chole (0.625 cup) + Bhature (1.25) + Salad (0.625 bowl)",
//                         "Paneer Tikka (125 grams) + Green Chutney (0.625 tablespoons) + Mixed Veg Raita (0.625 cup)",
//                         "Rajma (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Dal Makhani (0.625 cup) + Naan (1.25) + Carrot Halwa (0.625 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.625 cup) + Naan (1.25)",
//                         "Aloo Gobhi (0.625 cup) + Chapati (1.25) + Boondi Raita (0.625 cup)",
//                         "Chicken Curry (0.625 cup) + Rice (0.625 cup) + Mixed Vegetable Salad (0.625 bowl)",
//                         "Palak Paneer (0.625 cup) + Jeera Rice (0.625 cup)",
//                         "Mutton Rogan Josh (0.625 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Baingan Bharta (0.625 cup) + Chapati (1.25)",
//                         "Chicken Tikka (125 grams) + Mint Chutney (0.625 tablespoons) + Salad (0.625 bowl)",
//                         "Paneer Bhurji (0.625 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (0.625 cup) + Jeera Rice (0.625 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (7.5) + Sambar (2.5 cup) + Coconut Chutney (125 grams)",
//                         "Upma (2.5 cup) + Curd (2.5 cup) + Papaya (2.5 slice)",
//                         "Pongal (2.5 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (2.5 cup) + Mango (2.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2.5 cup) + Papad (5) + Curd (2.5 cup)",
//                         "Fish Curry (2.5 cup) + Rice (2.5 cup) + Veg Poriyal (2.5 bowl)",
//                         "Lemon Rice (2.5 cup) + Coconut Chutney (125 grams) + Curd (2.5 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (2.5 bowl)",
//                         "Chicken Chettinad (2.5 cup) + Rice (2.5 cup) + Cucumber Raita (2.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (2.5 cup) + Pickle (2.5 tablespoon) + Papad (5)",
//                         "Vegetable Biryani (2.5 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (5)",
//                         "Egg Curry (2.5 cup) + Rice (2.5 cup) + Spinach Poriyal (2.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2.5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (5) + Sambar (1.25 cup) + Coconut Chutney (125 grams)",
//                         "Upma (1.25 cup) + Curd (1.25 cup) + Papaya (2.5 slice)",
//                         "Pongal (1.25 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (1.25 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.25 cup) + Papad (2.5) + Curd (1.25 cup)",
//                         "Fish Curry (1.25 cup) + Rice (2.5 cup) + Veg Poriyal (1.25 bowl)",
//                         "Lemon Rice (1.25 cup) + Coconut Chutney (1.25 grams) + Curd (1.25 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (1.25 bowl)",
//                         "Chicken Chettinad (1.25 cup) + Rice (1.25 cup) + Cucumber Raita (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2.5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (1.25 cup) + Pickle (1.25 tablespoon) + Papad (2.5)",
//                         "Vegetable Biryani (1.25 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (2.5)",
//                         "Egg Curry (1.25 cup) + Rice (2.5 cup) + Spinach Poriyal (1.25 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1.25) + chutney (62.5 grams) + banana (1.25)",
//                         "Idli (2.5) + Sambar (0.625 cup) + Coconut Chutney (62.5 grams)",
//                         "Upma (0.625 cup) + Curd (0.625 cup) + Papaya (1.25 slice)",
//                         "Pongal (0.625 cup) + Coconut Chutney (62.5 grams) + Orange (1.25)",
//                         "Masala Dosa (1.25) + Sambar (0.625 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.625 cup) + Papad (1.25) + Curd (0.625 cup)",
//                         "Fish Curry (0.625 cup) + Rice (1.25 cup) + Veg Poriyal (0.625 bowl)",
//                         "Lemon Rice (0.625 cup) + Coconut Chutney (62.5 grams) + Curd (0.625 cup)",
//                         "Rasam (1.25 cup) + Rice (1.25 cup) + Beetroot Thoran (0.625 bowl)",
//                         "Chicken Chettinad (0.625 cup) + Rice (0.625 cup) + Cucumber Raita (0.625 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.25) + Coconut Chutney (62.5 grams) + Tomato Chutney (62.5 grams)",
//                         "Curd Rice (0.625 cup) + Pickle (0.625 tablespoon) + Papad (1.25)",
//                         "Vegetable Biryani (0.625 cup) + Raita (1.25 cup)",
//                         "Avial (1.25 cup) + Rice (1.25 cup) + Appalam (1.25)",
//                         "Egg Curry (0.625 cup) + Rice (1.25 cup) + Spinach Poriyal (0.625 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.75 cup) + Almonds (18) + Apple (1.75)",
//                         "Greek Yogurt (1.75 cup) + Blueberries (1.25 cup)",
//                         "Scrambled Eggs (5) + Whole Wheat Toast (3.75 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.75 slice) + Poached Egg (1.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.75 cup) + Mixed Green Salad",
//                         "Salmon (1.75 fillet) + Brown Rice (1.75 cup) + Broccoli (1.75 cup)",
//                         "Vegetable Stir Fry + Tofu (1.75 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.75 fillet) + Sweet Potato (1.75) + Asparagus (1.75 cup)",
//                         "Chicken Breast (1.75) + Couscous (1.75 cup) + Green Beans (1.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.75 cup)",
//                         "Quinoa Bowl + Black Beans (1.75 cup) + Corn (1.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Boiled Egg (1.5)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1.5 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 }
//             }
//         }
//     };

//     return options[calorieCategory][type][numberOfMeals][meal].map(option => `<option value="${option}">${option}</option>`).join('');
// }

// function showLoadingPage() {
//     document.getElementById('form-container').classList.add('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('loading-page').classList.remove('hidden');
    
//     let countdown = 5;
//     const countdownElement = document.getElementById('countdown');
//     const progressBarFill = document.getElementById('progress-bar-fill');
    
//     const countdownInterval = setInterval(() => {
//         countdownElement.textContent = countdown;
//         progressBarFill.style.width = `${(5 - countdown) * 20}%`;
//         if (countdown === 0) {
//             clearInterval(countdownInterval);
//             generatePlan();
//             document.getElementById('loading-page').classList.add('hidden');
//             document.getElementById('diet-plan').classList.remove('hidden');
//         }
//         countdown--;
//     }, 1000);
// }

// function generatePlan(calorieOverride = null) {
//     if (calorieOverride) {
//         calorieCategory = calorieOverride;
//         updateMealOptions();
//     }

//     const meals = document.getElementById('meals').value;

//     const dietPlanDetails = document.getElementById('diet-plan-details');
//     dietPlanDetails.innerHTML = `<p>Category: ${calorieCategory} kcal</p><p>Meals: ${meals}</p>`;

//     const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
//     if (meals == 4) {
//         mealLabels.splice(1, 0, 'Snack');
//     } else if (meals == 5) {
//         mealLabels.splice(1, 0, 'Snack1');
//         mealLabels.splice(3, 0, 'Snack2');
//     }

//     mealLabels.forEach(label => {
//         let mealType = '';
//         if (activityLevel === 'sedentary') {
//             mealType = document.getElementById(`north-${label.toLowerCase()}-select`).value || document.getElementById(`south-${label.toLowerCase()}-select`).value;
//         } else {
//             mealType = document.getElementById(`active-${label.toLowerCase()}-select`).value;
//         }
//         dietPlanDetails.innerHTML += `<p>${label}: ${mealType}</p>`;
//     });

//     document.getElementById('explore-more').classList.remove('hidden');
// }

// function calculateCalories(height, weight, gender) {
//     return (10 * weight) + (6.25 * height) - (5 * 25) + (gender === 'male' ? 5 : -161);
// }

// function downloadPlan() {
//     const dietPlanDetails = document.getElementById('diet-plan-details').innerHTML;
//     const blob = new Blob([dietPlanDetails], { type: 'text/html' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'diet_plan.html';
//     link.click();
// }

// document.querySelectorAll('.meal-select').forEach(select => {
//     select.addEventListener('change', (event) => {
//         const selectedMeal = event.target.id.split('-')[1]; // breakfast, lunch, dinner, snack1, snack2
//         const selectedType = event.target.id.split('-')[0]; // north, south, active
//         const value = event.target.value;

//         if (value) {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//             }
//         } else {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//             }
//         }
//     });
// });






// document.getElementById('sedentary').addEventListener('click', () => {
//     resetForm();
//     showForm('sedentary');
// });

// document.getElementById('active').addEventListener('click', () => {
//     resetForm();
//     showForm('active');
// });

// document.querySelectorAll('#height, #weight, #gender, #meals').forEach(input => {
//     input.addEventListener('input', () => {
//         if (isFormFilled()) {
//             calculateAndShowMeals();
//         }
//     });
// });

// document.getElementById('generate-plan').addEventListener('click', (e) => {
//     e.preventDefault();
//     generatePlan();
// });

// let activityLevel = '';
// let maintenanceCalories = 0;
// let calorieCategory = '2000';

// function resetForm() {
//     document.getElementById('diet-form').reset();
//     document.getElementById('form-container').classList.add('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
//     document.getElementById('diet-plan').classList.add('hidden');
//     document.getElementById('explore-more').classList.add('hidden');
//     document.querySelectorAll('.meal-select').forEach(select => {
//         select.innerHTML = '';
//     });
// }

// function showForm(level) {
//     activityLevel = level;
//     document.getElementById('form-container').classList.remove('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
// }

// function isFormFilled() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;
//     const meals = document.getElementById('meals').value;
//     return height && weight && gender && meals;
// }

// function calculateAndShowMeals() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;

//     maintenanceCalories = calculateCalories(height, weight, gender);
//     if (maintenanceCalories < 2000) {
//         maintenanceCalories = 2000;
//     } else if (maintenanceCalories > 3500) {
//         maintenanceCalories = 3500;
//     }

//     if (maintenanceCalories > 3200) {
//         calorieCategory = '3500';
//     } else if (maintenanceCalories > 2700) {
//         calorieCategory = '3000';
//     } else if (maintenanceCalories > 2200) {
//         calorieCategory = '2500';
//     } else {
//         calorieCategory = '2000';
//     }

//     updateMealOptions();
//     document.getElementById('meal-options').classList.remove('hidden');
// }

// function updateMealOptions() {
//     const northBreakfastSelect = document.getElementById('north-breakfast-select');
//     const northSnack1Select = document.getElementById('north-snack1-select');
//     const northLunchSelect = document.getElementById('north-lunch-select');
//     const northSnack2Select = document.getElementById('north-snack2-select');
//     const northDinnerSelect = document.getElementById('north-dinner-select');

//     const southBreakfastSelect = document.getElementById('south-breakfast-select');
//     const southSnack1Select = document.getElementById('south-snack1-select');
//     const southLunchSelect = document.getElementById('south-lunch-select');
//     const southSnack2Select = document.getElementById('south-snack2-select');
//     const southDinnerSelect = document.getElementById('south-dinner-select');

//     const activeBreakfastSelect = document.getElementById('active-breakfast-select');
//     const activeSnack1Select = document.getElementById('active-snack1-select');
//     const activeLunchSelect = document.getElementById('active-lunch-select');
//     const activeSnack2Select = document.getElementById('active-snack2-select');
//     const activeDinnerSelect = document.getElementById('active-dinner-select');

//     const numberOfMeals = document.getElementById('meals').value;

//     if (activityLevel === 'sedentary') {
//         document.getElementById('north-indian').classList.remove('hidden');
//         document.getElementById('south-indian').classList.remove('hidden');

//         northBreakfastSelect.innerHTML = getOptions('north', 'breakfast', numberOfMeals);
//         northSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('north', 'snack1', numberOfMeals) : '';
//         northLunchSelect.innerHTML = getOptions('north', 'lunch', numberOfMeals);
//         northSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('north', 'snack2', numberOfMeals) : '';
//         northDinnerSelect.innerHTML = getOptions('north', 'dinner', numberOfMeals);

//         southBreakfastSelect.innerHTML = getOptions('south', 'breakfast', numberOfMeals);
//         southSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('south', 'snack1', numberOfMeals) : '';
//         southLunchSelect.innerHTML = getOptions('south', 'lunch', numberOfMeals);
//         southSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('south', 'snack2', numberOfMeals) : '';
//         southDinnerSelect.innerHTML = getOptions('south', 'dinner', numberOfMeals);

//         toggleVisibility(northSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(northSnack2Select, numberOfMeals == 5);
//         toggleVisibility(southSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(southSnack2Select, numberOfMeals == 5);
//     } else {
//         document.getElementById('active-meals').classList.remove('hidden');

//         activeBreakfastSelect.innerHTML = getOptions('active', 'breakfast', numberOfMeals);
//         activeSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('active', 'snack1', numberOfMeals) : '';
//         activeLunchSelect.innerHTML = getOptions('active', 'lunch', numberOfMeals);
//         activeSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('active', 'snack2', numberOfMeals) : '';
//         activeDinnerSelect.innerHTML = getOptions('active', 'dinner', numberOfMeals);

//         toggleVisibility(activeSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(activeSnack2Select, numberOfMeals == 5);
//     }

//     document.getElementById('generate-plan').classList.remove('hidden');
// }

// function toggleVisibility(element, isVisible) {
//     if (isVisible) {
//         element.classList.remove('hidden');
//         element.previousElementSibling.classList.remove('hidden');
//     } else {
//         element.classList.add('hidden');
//         element.previousElementSibling.classList.add('hidden');
//     }
// }

// function getOptions(type, meal, numberOfMeals) {
//     const options = {
//         '2000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (1/2 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/2 cup) + Bhature (1) + Salad (1/2 bowl)",
//                         "Paneer Tikka (100 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1/2 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/2 cup) + Naan (1)",
//                         "Aloo Gobhi (1/2 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/2 cup) + Rice (1/2 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1/2 cup) + Tandoori Roti (1)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/2 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/2 cup) + Chapati (1)",
//                         "Chicken Tikka (100 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/2 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/2 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1/2) + Curd (1/3 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/3 cup) + Bhature (1) + Salad (1/3 bowl)",
//                         "Paneer Tikka (50 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1/2 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1/2 cup) + Naan (1) + Carrot Halwa (1/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/3 cup) + Naan (1)",
//                         "Aloo Gobhi (1/3 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/3 cup) + Rice (1/3 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1/2 cup)",
//                         "Mutton Rogan Josh (1/3 cup) + Tandoori Roti (1)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/3 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/3 cup) + Chapati (1)",
//                         "Chicken Tikka (70 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/3 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/3 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (1)",
//                         "Idli (3) + Sambar (1 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (1 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (1 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (50 grams) + banana (1)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1/2 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (25 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (25 grams) + banana (1)",
//                         "Idli (1) + Sambar (1/3 cup) + Coconut Chutney (25 grams)",
//                         "Upma (1/3 cup) + Curd (1/3 cup) + Papaya (1 slice)",
//                         "Pongal (1/3 cup) + Coconut Chutney (25 grams) + Orange (1/2)",
//                         "Masala Dosa (1) + Sambar (1/3 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/3 cup) + Papad (1) + Curd (1/3 cup)",
//                         "Fish Curry (1/3 cup) + Rice (1/2 cup) + Veg Poriyal (1/3 bowl)",
//                         "Lemon Rice (1/3 cup) + Coconut Chutney (25 grams) + Curd (1/3 cup)",
//                         "Rasam (1 cup) + Rice (1/2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/3 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (25 grams) + Tomato Chutney (25 grams)",
//                         "Curd Rice (1/3 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/3 cup) + Raita (1 cup)",
//                         "Avial (1/2 cup) + Rice (1/2 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1/2 cup) + Spinach Poriyal (1/2 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (1/2 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Poached Egg (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (3/4 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (3/4 cup) + Blueberries (1/3 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (3/4 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (3/4 cup) + Mixed Green Salad",
//                         "Salmon (3/4 fillet) + Brown Rice (3/4 cup) + Broccoli (3/4 cup)",
//                         "Vegetable Stir Fry + Tofu (3/4 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (3/4 fillet) + Sweet Potato (3/4) + Asparagus (3/4 cup)",
//                         "Chicken Breast (3/4) + Couscous (3/4 cup) + Green Beans (3/4 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (3/4 cup)",
//                         "Quinoa Bowl + Black Beans (3/4 cup) + Corn (3/4 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1/2 cup) + Almonds (5) + Apple (1/2)",
//                         "Greek Yogurt (1/2 cup) + Blueberries (1/4 cup)",
//                         "Scrambled Eggs (1) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1/2 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1/2 cup) + Mixed Green Salad",
//                         "Salmon (1/2 fillet) + Brown Rice (1/2 cup) + Broccoli (1/2 cup)",
//                         "Vegetable Stir Fry + Tofu (1/2 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1/2 fillet) + Sweet Potato (1/2) + Asparagus (1/2 cup)",
//                         "Chicken Breast (1/2) + Couscous (1/2 cup) + Green Beans (1/2 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1/2 cup)",
//                         "Quinoa Bowl + Black Beans (1/2 cup) + Corn (1/2 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1)"
//                     ]
//                 }
//             }
//         },

//         '2500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (3) + Curd (1.5 cup) + Mango Pickle (1.5 tablespoon)",
//                         "Chole (1.5 cup) + Bhature (3) + Salad (1.5 bowl)",
//                         "Paneer Tikka (300 grams) + Green Chutney (3 tablespoons) + Mixed Veg Raita (1.5 cup)",
//                         "Rajma (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Dal Makhani (1.5 cup) + Naan (1.5) + Carrot Halwa (1.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.5 cup) + Naan (3)",
//                         "Aloo Gobhi (1.5 cup) + Chapati (3) + Boondi Raita (1.5 cup)",
//                         "Chicken Curry (1.5 cup) + Rice (1.5 cup) + Mixed Vegetable Salad (1.5 bowl)",
//                         "Palak Paneer (1.5 cup) + Jeera Rice (1.5 cup)",
//                         "Mutton Rogan Josh (1.5 cup) + Tandoori Roti (3)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Baingan Bharta (1.5 cup) + Chapati (3)",
//                         "Chicken Tikka (300 grams) + Mint Chutney (3 tablespoons) + Salad (1.5 bowl)",
//                         "Paneer Bhurji (1.5 cup) + Paratha (3)",
//                         "Kadhai Paneer (1.5 cup) + Jeera Rice (1.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1.5) + Curd (0.75 cup) + Mango Pickle (0.75 tablespoon)",
//                         "Chole (0.75 cup) + Bhature (1.5) + Salad (0.75 bowl)",
//                         "Paneer Tikka (150 grams) + Green Chutney (1.5 tablespoons) + Mixed Veg Raita (0.75 cup)",
//                         "Rajma (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Dal Makhani (0.75 cup) + Naan (0.75) + Carrot Halwa (0.75 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.75 cup) + Naan (1.5)",
//                         "Aloo Gobhi (0.75 cup) + Chapati (1.5) + Boondi Raita (0.75 cup)",
//                         "Chicken Curry (0.75 cup) + Rice (0.75 cup) + Mixed Vegetable Salad (0.75 bowl)",
//                         "Palak Paneer (0.75 cup) + Jeera Rice (0.75 cup)",
//                         "Mutton Rogan Josh (0.75 cup) + Tandoori Roti (1.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Baingan Bharta (0.75 cup) + Chapati (1.5)",
//                         "Chicken Tikka (150 grams) + Mint Chutney (1.5 tablespoons) + Salad (0.75 bowl)",
//                         "Paneer Bhurji (0.75 cup) + Paratha (1.5)",
//                         "Kadhai Paneer (0.75 cup) + Jeera Rice (0.75 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (0.75) + Curd (0.375 cup) + Mango Pickle (0.375 tablespoon)",
//                         "Chole (0.375 cup) + Bhature (0.75) + Salad (0.375 bowl)",
//                         "Paneer Tikka (75 grams) + Green Chutney (0.75 tablespoons) + Mixed Veg Raita (0.375 cup)",
//                         "Rajma (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Dal Makhani (0.375 cup) + Naan (0.75) + Carrot Halwa (0.375 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.375 cup) + Naan (0.75)",
//                         "Aloo Gobhi (0.375 cup) + Chapati (0.75) + Boondi Raita (0.375 cup)",
//                         "Chicken Curry (0.375 cup) + Rice (0.375 cup) + Mixed Vegetable Salad (0.375 bowl)",
//                         "Palak Paneer (0.375 cup) + Jeera Rice (0.375 cup)",
//                         "Mutton Rogan Josh (0.375 cup) + Tandoori Roti (0.75)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Baingan Bharta (0.375 cup) + Chapati (0.75)",
//                         "Chicken Tikka (75 grams) + Mint Chutney (0.75 tablespoons) + Salad (0.375 bowl)",
//                         "Paneer Bhurji (0.375 cup) + Paratha (0.75)",
//                         "Kadhai Paneer (0.375 cup) + Jeera Rice (0.375 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (3) + chutney (75 grams) + banana (1.5)",
//                         "Idli (4.5) + Sambar (1.5 cup) + Coconut Chutney (75 grams)",
//                         "Upma (1.5 cup) + Curd (1.5 cup) + Papaya (1.5 slice)",
//                         "Pongal (1.5 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (1.5 cup) + Mango (1.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.5 cup) + Papad (3) + Curd (1.5 cup)",
//                         "Fish Curry (1.5 cup) + Rice (1.5 cup) + Veg Poriyal (1.5 bowl)",
//                         "Lemon Rice (1.5 cup) + Coconut Chutney (75 grams) + Curd (1.5 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (1.5 bowl)",
//                         "Chicken Chettinad (1.5 cup) + Rice (1.5 cup) + Cucumber Raita (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (3) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (1.5 cup) + Pickle (1.5 tablespoon) + Papad (3)",
//                         "Vegetable Biryani (1.5 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (3)",
//                         "Egg Curry (1.5 cup) + Rice (1.5 cup) + Spinach Poriyal (1.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1.5) + chutney (75 grams) + banana (1.5)",
//                         "Idli (3) + Sambar (0.75 cup) + Coconut Chutney (75 grams)",
//                         "Upma (0.75 cup) + Curd (0.75 cup) + Papaya (1.5 slice)",
//                         "Pongal (0.75 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (0.75 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.75 cup) + Papad (1.5) + Curd (0.75 cup)",
//                         "Fish Curry (0.75 cup) + Rice (1.5 cup) + Veg Poriyal (0.75 bowl)",
//                         "Lemon Rice (0.75 cup) + Coconut Chutney (0.375 grams) + Curd (0.75 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (0.75 bowl)",
//                         "Chicken Chettinad (0.75 cup) + Rice (0.75 cup) + Cucumber Raita (0.75 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.5) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (0.75 cup) + Pickle (0.75 tablespoon) + Papad (1.5)",
//                         "Vegetable Biryani (0.75 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (1.5)",
//                         "Egg Curry (0.75 cup) + Rice (1.5 cup) + Spinach Poriyal (0.75 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (0.75) + chutney (37.5 grams) + banana (1.5)",
//                         "Idli (1.5) + Sambar (0.375 cup) + Coconut Chutney (37.5 grams)",
//                         "Upma (0.375 cup) + Curd (0.375 cup) + Papaya (0.75 slice)",
//                         "Pongal (0.375 cup) + Coconut Chutney (37.5 grams) + Orange (0.75)",
//                         "Masala Dosa (0.75) + Sambar (0.375 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.375 cup) + Papad (0.75) + Curd (0.375 cup)",
//                         "Fish Curry (0.375 cup) + Rice (0.75 cup) + Veg Poriyal (0.375 bowl)",
//                         "Lemon Rice (0.375 cup) + Coconut Chutney (37.5 grams) + Curd (0.375 cup)",
//                         "Rasam (0.75 cup) + Rice (0.75 cup) + Beetroot Thoran (0.375 bowl)",
//                         "Chicken Chettinad (0.375 cup) + Rice (0.375 cup) + Cucumber Raita (0.375 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (0.75) + Coconut Chutney (37.5 grams) + Tomato Chutney (37.5 grams)",
//                         "Curd Rice (0.375 cup) + Pickle (0.375 tablespoon) + Papad (0.75)",
//                         "Vegetable Biryani (0.375 cup) + Raita (0.75 cup)",
//                         "Avial (0.75 cup) + Rice (0.75 cup) + Appalam (0.75)",
//                         "Egg Curry (0.375 cup) + Rice (0.75 cup) + Spinach Poriyal (0.375 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.5) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Poached Egg (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3.5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (0.75/4 cup) + Apple (1)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2.5)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (0.75 cup) + Almonds (7) + Apple (0.75)",
//                         "Greek Yogurt (0.75 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (0.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (0.75 cup) + Mixed Green Salad",
//                         "Salmon (0.75 fillet) + Brown Rice (0.75 cup) + Broccoli (0.75 cup)",
//                         "Vegetable Stir Fry + Tofu (0.75 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (0.75 fillet) + Sweet Potato (0.75) + Asparagus (0.75 cup)",
//                         "Chicken Breast (0.75) + Couscous (0.75 cup) + Green Beans (0.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (0.75 cup)",
//                         "Quinoa Bowl + Black Beans (0.75 cup) + Corn (0.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1.5)"
//                     ]
//                 }
//             }
//         },

//         '3000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (4) + Curd (2 cup) + Mango Pickle (2 tablespoon)",
//                         "Chole (2 cup) + Bhature (4) + Salad (2 bowl)",
//                         "Paneer Tikka (400 grams) + Green Chutney (4 tablespoons) + Mixed Veg Raita (2 cup)",
//                         "Rajma (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Dal Makhani (2 cup) + Naan (2) + Carrot Halwa (2 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2 cup) + Naan (4)",
//                         "Aloo Gobhi (2 cup) + Chapati (4) + Boondi Raita (2 cup)",
//                         "Chicken Curry (2 cup) + Rice (2 cup) + Mixed Vegetable Salad (2 bowl)",
//                         "Palak Paneer (2 cup) + Jeera Rice (2 cup)",
//                         "Mutton Rogan Josh (2 cup) + Tandoori Roti (4)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Baingan Bharta (2 cup) + Chapati (4)",
//                         "Chicken Tikka (400 grams) + Mint Chutney (4 tablespoons) + Salad (2 bowl)",
//                         "Paneer Bhurji (2 cup) + Paratha (4)",
//                         "Kadhai Paneer (2 cup) + Jeera Rice (2 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (2/3 cup) + Mango Pickle (2/3 tablespoon)",
//                         "Chole (2/3 cup) + Bhature (1.5) + Salad (2/3 bowl)",
//                         "Paneer Tikka (133 grams) + Green Chutney (2/3 tablespoons) + Mixed Veg Raita (2/3 cup)",
//                         "Rajma (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Dal Makhani (2/3 cup) + Naan (1.5) + Carrot Halwa (2/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2/3 cup) + Naan (1.25)",
//                         "Aloo Gobhi (2/3 cup) + Chapati (1.25) + Boondi Raita (2/3 cup)",
//                         "Chicken Curry (2/3 cup) + Rice (2/3 cup) + Mixed Vegetable Salad (2/3 bowl)",
//                         "Palak Paneer (2/3 cup) + Jeera Rice (2/3 cup)",
//                         "Mutton Rogan Josh (2/3 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Baingan Bharta (2/3 cup) + Chapati (1.25)",
//                         "Chicken Tikka (133 grams) + Mint Chutney (2/3 tablespoons) + Salad (2/3 bowl)",
//                         "Paneer Bhurji (2/3 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (2/3 cup) + Jeera Rice (2/3 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (4) + chutney (100 grams) + banana (2)",
//                         "Idli (6) + Sambar (2 cup) + Coconut Chutney (100 grams)",
//                         "Upma (2 cup) + Curd (2 cup) + Papaya (2 slice)",
//                         "Pongal (2 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (2 cup) + Mango (2 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2 cup) + Papad (4) + Curd (2 cup)",
//                         "Fish Curry (2 cup) + Rice (2 cup) + Veg Poriyal (2 bowl)",
//                         "Lemon Rice (2 cup) + Coconut Chutney (100 grams) + Curd (2 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (2 bowl)",
//                         "Chicken Chettinad (2 cup) + Rice (2 cup) + Cucumber Raita (2 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (4) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (2 cup) + Pickle (2 tablespoon) + Papad (4)",
//                         "Vegetable Biryani (2 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (4)",
//                         "Egg Curry (2 cup) + Rice (2 cup) + Spinach Poriyal (2 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (100 grams) + banana (2)",
//                         "Idli (4) + Sambar (1 cup) + Coconut Chutney (100 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (2 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (2 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (2 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (2)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (2) + Sambar (1/2 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (50 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Poached Egg (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.25) + Whole Wheat Toast (2.25 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Boiled Egg (1.25)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2.5) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 }
//             }
//         },

        
//         '3500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (5) + Curd (2.5 cup) + Mango Pickle (2.5 tablespoon)",
//                         "Chole (2.5 cup) + Bhature (5) + Salad (2.5 bowl)",
//                         "Paneer Tikka (500 grams) + Green Chutney (5 tablespoons) + Mixed Veg Raita (2.5 cup)",
//                         "Rajma (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Dal Makhani (2.5 cup) + Naan (2.5) + Carrot Halwa (2.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2.5 cup) + Naan (5)",
//                         "Aloo Gobhi (2.5 cup) + Chapati (5) + Boondi Raita (2.5 cup)",
//                         "Chicken Curry (2.5 cup) + Rice (2.5 cup) + Mixed Vegetable Salad (2.5 bowl)",
//                         "Palak Paneer (2.5 cup) + Jeera Rice (2.5 cup)",
//                         "Mutton Rogan Josh (2.5 cup) + Tandoori Roti (5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Baingan Bharta (2.5 cup) + Chapati (5)",
//                         "Chicken Tikka (500 grams) + Mint Chutney (5 tablespoons) + Salad (2.5 bowl)",
//                         "Paneer Bhurji (2.5 cup) + Paratha (5)",
//                         "Kadhai Paneer (2.5 cup) + Jeera Rice (2.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2.5) + Curd (1.25 cup) + Mango Pickle (1.25 tablespoon)",
//                         "Chole (1.25 cup) + Bhature (2.5) + Salad (1.25 bowl)",
//                         "Paneer Tikka (250 grams) + Green Chutney (2.5 tablespoons) + Mixed Veg Raita (1.25 cup)",
//                         "Rajma (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Dal Makhani (1.25 cup) + Naan (1.25) + Carrot Halwa (1.25 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.25 cup) + Naan (2.5)",
//                         "Aloo Gobhi (1.25 cup) + Chapati (2.5) + Boondi Raita (1.25 cup)",
//                         "Chicken Curry (1.25 cup) + Rice (1.25 cup) + Mixed Vegetable Salad (1.25 bowl)",
//                         "Palak Paneer (1.25 cup) + Jeera Rice (1.25 cup)",
//                         "Mutton Rogan Josh (1.25 cup) + Tandoori Roti (2.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Baingan Bharta (1.25 cup) + Chapati (2.5)",
//                         "Chicken Tikka (250 grams) + Mint Chutney (2.5 tablespoons) + Salad (1.25 bowl)",
//                         "Paneer Bhurji (1.25 cup) + Paratha (2.5)",
//                         "Kadhai Paneer (1.25 cup) + Jeera Rice (1.25 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1.25) + Curd (0.625 cup) + Mango Pickle (0.625 tablespoon)",
//                         "Chole (0.625 cup) + Bhature (1.25) + Salad (0.625 bowl)",
//                         "Paneer Tikka (125 grams) + Green Chutney (0.625 tablespoons) + Mixed Veg Raita (0.625 cup)",
//                         "Rajma (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Dal Makhani (0.625 cup) + Naan (1.25) + Carrot Halwa (0.625 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.625 cup) + Naan (1.25)",
//                         "Aloo Gobhi (0.625 cup) + Chapati (1.25) + Boondi Raita (0.625 cup)",
//                         "Chicken Curry (0.625 cup) + Rice (0.625 cup) + Mixed Vegetable Salad (0.625 bowl)",
//                         "Palak Paneer (0.625 cup) + Jeera Rice (0.625 cup)",
//                         "Mutton Rogan Josh (0.625 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Baingan Bharta (0.625 cup) + Chapati (1.25)",
//                         "Chicken Tikka (125 grams) + Mint Chutney (0.625 tablespoons) + Salad (0.625 bowl)",
//                         "Paneer Bhurji (0.625 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (0.625 cup) + Jeera Rice (0.625 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (7.5) + Sambar (2.5 cup) + Coconut Chutney (125 grams)",
//                         "Upma (2.5 cup) + Curd (2.5 cup) + Papaya (2.5 slice)",
//                         "Pongal (2.5 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (2.5 cup) + Mango (2.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2.5 cup) + Papad (5) + Curd (2.5 cup)",
//                         "Fish Curry (2.5 cup) + Rice (2.5 cup) + Veg Poriyal (2.5 bowl)",
//                         "Lemon Rice (2.5 cup) + Coconut Chutney (125 grams) + Curd (2.5 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (2.5 bowl)",
//                         "Chicken Chettinad (2.5 cup) + Rice (2.5 cup) + Cucumber Raita (2.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (2.5 cup) + Pickle (2.5 tablespoon) + Papad (5)",
//                         "Vegetable Biryani (2.5 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (5)",
//                         "Egg Curry (2.5 cup) + Rice (2.5 cup) + Spinach Poriyal (2.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2.5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (5) + Sambar (1.25 cup) + Coconut Chutney (125 grams)",
//                         "Upma (1.25 cup) + Curd (1.25 cup) + Papaya (2.5 slice)",
//                         "Pongal (1.25 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (1.25 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.25 cup) + Papad (2.5) + Curd (1.25 cup)",
//                         "Fish Curry (1.25 cup) + Rice (2.5 cup) + Veg Poriyal (1.25 bowl)",
//                         "Lemon Rice (1.25 cup) + Coconut Chutney (1.25 grams) + Curd (1.25 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (1.25 bowl)",
//                         "Chicken Chettinad (1.25 cup) + Rice (1.25 cup) + Cucumber Raita (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2.5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (1.25 cup) + Pickle (1.25 tablespoon) + Papad (2.5)",
//                         "Vegetable Biryani (1.25 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (2.5)",
//                         "Egg Curry (1.25 cup) + Rice (2.5 cup) + Spinach Poriyal (1.25 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1.25) + chutney (62.5 grams) + banana (1.25)",
//                         "Idli (2.5) + Sambar (0.625 cup) + Coconut Chutney (62.5 grams)",
//                         "Upma (0.625 cup) + Curd (0.625 cup) + Papaya (1.25 slice)",
//                         "Pongal (0.625 cup) + Coconut Chutney (62.5 grams) + Orange (1.25)",
//                         "Masala Dosa (1.25) + Sambar (0.625 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.625 cup) + Papad (1.25) + Curd (0.625 cup)",
//                         "Fish Curry (0.625 cup) + Rice (1.25 cup) + Veg Poriyal (0.625 bowl)",
//                         "Lemon Rice (0.625 cup) + Coconut Chutney (62.5 grams) + Curd (0.625 cup)",
//                         "Rasam (1.25 cup) + Rice (1.25 cup) + Beetroot Thoran (0.625 bowl)",
//                         "Chicken Chettinad (0.625 cup) + Rice (0.625 cup) + Cucumber Raita (0.625 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.25) + Coconut Chutney (62.5 grams) + Tomato Chutney (62.5 grams)",
//                         "Curd Rice (0.625 cup) + Pickle (0.625 tablespoon) + Papad (1.25)",
//                         "Vegetable Biryani (0.625 cup) + Raita (1.25 cup)",
//                         "Avial (1.25 cup) + Rice (1.25 cup) + Appalam (1.25)",
//                         "Egg Curry (0.625 cup) + Rice (1.25 cup) + Spinach Poriyal (0.625 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.75 cup) + Almonds (18) + Apple (1.75)",
//                         "Greek Yogurt (1.75 cup) + Blueberries (1.25 cup)",
//                         "Scrambled Eggs (5) + Whole Wheat Toast (3.75 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.75 slice) + Poached Egg (1.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.75 cup) + Mixed Green Salad",
//                         "Salmon (1.75 fillet) + Brown Rice (1.75 cup) + Broccoli (1.75 cup)",
//                         "Vegetable Stir Fry + Tofu (1.75 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.75 fillet) + Sweet Potato (1.75) + Asparagus (1.75 cup)",
//                         "Chicken Breast (1.75) + Couscous (1.75 cup) + Green Beans (1.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.75 cup)",
//                         "Quinoa Bowl + Black Beans (1.75 cup) + Corn (1.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Boiled Egg (1.5)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1.5 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 }
//             }
//         }
//     };

//     return options[calorieCategory][type][numberOfMeals][meal].map(option => `<option value="${option}">${option}</option>`).join('');
// }

// function generatePlan(calorieOverride = null) {
//     if (calorieOverride) {
//         calorieCategory = calorieOverride;
//         updateMealOptions();
//     }

//     const meals = document.getElementById('meals').value;

//     const dietPlanDetails = document.getElementById('diet-plan-details');
//     dietPlanDetails.innerHTML = `<p>Category: ${calorieCategory} kcal</p><p>Meals: ${meals}</p>`;

//     const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
//     if (meals == 4) {
//         mealLabels.splice(1, 0, 'Snack');
//     } else if (meals == 5) {
//         mealLabels.splice(1, 0, 'Snack1');
//         mealLabels.splice(3, 0, 'Snack2');
//     }

//     mealLabels.forEach(label => {
//         let mealType = '';
//         if (activityLevel === 'sedentary') {
//             mealType = document.getElementById(`north-${label.toLowerCase()}-select`).value || document.getElementById(`south-${label.toLowerCase()}-select`).value;
//         } else {
//             mealType = document.getElementById(`active-${label.toLowerCase()}-select`).value;
//         }
//         dietPlanDetails.innerHTML += `<p>${label}: ${mealType}</p>`;
//     });

//     document.getElementById('diet-plan').classList.remove('hidden');
//     document.getElementById('explore-more').classList.remove('hidden');
// }

// function calculateCalories(height, weight, gender) {
//     return (10 * weight) + (6.25 * height) - (5 * 25) + (gender === 'male' ? 5 : -161);
// }

// document.querySelectorAll('.meal-select').forEach(select => {
//     select.addEventListener('change', (event) => {
//         const selectedMeal = event.target.id.split('-')[1]; // breakfast, lunch, dinner, snack1, snack2
//         const selectedType = event.target.id.split('-')[0]; // north, south, active
//         const value = event.target.value;

//         if (value) {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//             }
//         } else {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//             }
//         }
//     });
// });

// document.getElementById('explore-2000').addEventListener('click', () => generatePlan('2000'));
// document.getElementById('explore-2500').addEventListener('click', () => generatePlan('2500'));
// document.getElementById('explore-3000').addEventListener('click', () => generatePlan('3000'));
// document.getElementById('explore-3500').addEventListener('click', () => generatePlan('3500'));




// document.getElementById('sedentary').addEventListener('click', () => {
//     showForm('sedentary');
// });

// document.getElementById('active').addEventListener('click', () => {
//     showForm('active');
// });

// document.querySelectorAll('#height, #weight, #gender, #meals').forEach(input => {
//     input.addEventListener('input', () => {
//         if (isFormFilled()) {
//             calculateAndShowMeals();
//         }
//     });
// });

// document.getElementById('generate-plan').addEventListener('click', (e) => {
//     e.preventDefault();
//     generatePlan();
// });

// let activityLevel = '';
// let maintenanceCalories = 0;
// let calorieCategory = '2000';

// function showForm(level) {
//     activityLevel = level;
//     document.getElementById('form-container').classList.remove('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
// }

// function isFormFilled() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;
//     const meals = document.getElementById('meals').value;
//     return height && weight && gender && meals;
// }

// function calculateAndShowMeals() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;

//     maintenanceCalories = calculateCalories(height, weight, gender);
//     if (maintenanceCalories < 2000) {
//         maintenanceCalories = 2000;
//     } else if (maintenanceCalories > 3500) {
//         maintenanceCalories = 3500;
//     }

//     if (maintenanceCalories > 3200) {
//         calorieCategory = '3500';
//     } else if (maintenanceCalories > 2700) {
//         calorieCategory = '3000';
//     } else if (maintenanceCalories > 2200) {
//         calorieCategory = '2500';
//     } else {
//         calorieCategory = '2000';
//     }

//     updateMealOptions();
//     document.getElementById('meal-options').classList.remove('hidden');
// }

// function updateMealOptions() {
//     const northBreakfastSelect = document.getElementById('north-breakfast-select');
//     const northSnack1Select = document.getElementById('north-snack1-select');
//     const northLunchSelect = document.getElementById('north-lunch-select');
//     const northSnack2Select = document.getElementById('north-snack2-select');
//     const northDinnerSelect = document.getElementById('north-dinner-select');

//     const southBreakfastSelect = document.getElementById('south-breakfast-select');
//     const southSnack1Select = document.getElementById('south-snack1-select');
//     const southLunchSelect = document.getElementById('south-lunch-select');
//     const southSnack2Select = document.getElementById('south-snack2-select');
//     const southDinnerSelect = document.getElementById('south-dinner-select');

//     const activeBreakfastSelect = document.getElementById('active-breakfast-select');
//     const activeSnack1Select = document.getElementById('active-snack1-select');
//     const activeLunchSelect = document.getElementById('active-lunch-select');
//     const activeSnack2Select = document.getElementById('active-snack2-select');
//     const activeDinnerSelect = document.getElementById('active-dinner-select');

//     const numberOfMeals = document.getElementById('meals').value;

//     if (activityLevel === 'sedentary') {
//         document.getElementById('north-indian').classList.remove('hidden');
//         document.getElementById('south-indian').classList.remove('hidden');

//         northBreakfastSelect.innerHTML = getOptions('north', 'breakfast', numberOfMeals);
//         northSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('north', 'snack1', numberOfMeals) : '';
//         northLunchSelect.innerHTML = getOptions('north', 'lunch', numberOfMeals);
//         northSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('north', 'snack2', numberOfMeals) : '';
//         northDinnerSelect.innerHTML = getOptions('north', 'dinner', numberOfMeals);

//         southBreakfastSelect.innerHTML = getOptions('south', 'breakfast', numberOfMeals);
//         southSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('south', 'snack1', numberOfMeals) : '';
//         southLunchSelect.innerHTML = getOptions('south', 'lunch', numberOfMeals);
//         southSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('south', 'snack2', numberOfMeals) : '';
//         southDinnerSelect.innerHTML = getOptions('south', 'dinner', numberOfMeals);

//         toggleVisibility(northSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(northSnack2Select, numberOfMeals == 5);
//         toggleVisibility(southSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(southSnack2Select, numberOfMeals == 5);
//     } else {
//         document.getElementById('active-meals').classList.remove('hidden');

//         activeBreakfastSelect.innerHTML = getOptions('active', 'breakfast', numberOfMeals);
//         activeSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('active', 'snack1', numberOfMeals) : '';
//         activeLunchSelect.innerHTML = getOptions('active', 'lunch', numberOfMeals);
//         activeSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('active', 'snack2', numberOfMeals) : '';
//         activeDinnerSelect.innerHTML = getOptions('active', 'dinner', numberOfMeals);

//         toggleVisibility(activeSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(activeSnack2Select, numberOfMeals == 5);
//     }

//     document.getElementById('generate-plan').classList.remove('hidden');
// }

// function toggleVisibility(element, isVisible) {
//     if (isVisible) {
//         element.classList.remove('hidden');
//         element.previousElementSibling.classList.remove('hidden');
//     } else {
//         element.classList.add('hidden');
//         element.previousElementSibling.classList.add('hidden');
//     }
// }

// function getOptions(type, meal, numberOfMeals) {
//     const options = {
//         '2000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (1/2 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/2 cup) + Bhature (1) + Salad (1/2 bowl)",
//                         "Paneer Tikka (100 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1/2 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/2 cup) + Naan (1)",
//                         "Aloo Gobhi (1/2 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/2 cup) + Rice (1/2 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1/2 cup) + Tandoori Roti (1)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/2 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/2 cup) + Chapati (1)",
//                         "Chicken Tikka (100 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/2 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/2 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1/2) + Curd (1/3 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/3 cup) + Bhature (1) + Salad (1/3 bowl)",
//                         "Paneer Tikka (50 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1/2 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1/2 cup) + Naan (1) + Carrot Halwa (1/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/3 cup) + Naan (1)",
//                         "Aloo Gobhi (1/3 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/3 cup) + Rice (1/3 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1/2 cup)",
//                         "Mutton Rogan Josh (1/3 cup) + Tandoori Roti (1)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/3 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/3 cup) + Chapati (1)",
//                         "Chicken Tikka (70 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/3 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/3 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (1)",
//                         "Idli (3) + Sambar (1 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (1 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (1 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (50 grams) + banana (1)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1/2 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (25 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (25 grams) + banana (1)",
//                         "Idli (1) + Sambar (1/3 cup) + Coconut Chutney (25 grams)",
//                         "Upma (1/3 cup) + Curd (1/3 cup) + Papaya (1 slice)",
//                         "Pongal (1/3 cup) + Coconut Chutney (25 grams) + Orange (1/2)",
//                         "Masala Dosa (1) + Sambar (1/3 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/3 cup) + Papad (1) + Curd (1/3 cup)",
//                         "Fish Curry (1/3 cup) + Rice (1/2 cup) + Veg Poriyal (1/3 bowl)",
//                         "Lemon Rice (1/3 cup) + Coconut Chutney (25 grams) + Curd (1/3 cup)",
//                         "Rasam (1 cup) + Rice (1/2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/3 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (25 grams) + Tomato Chutney (25 grams)",
//                         "Curd Rice (1/3 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/3 cup) + Raita (1 cup)",
//                         "Avial (1/2 cup) + Rice (1/2 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1/2 cup) + Spinach Poriyal (1/2 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (1/2 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Poached Egg (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (3/4 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (3/4 cup) + Blueberries (1/3 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (3/4 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (3/4 cup) + Mixed Green Salad",
//                         "Salmon (3/4 fillet) + Brown Rice (3/4 cup) + Broccoli (3/4 cup)",
//                         "Vegetable Stir Fry + Tofu (3/4 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (3/4 fillet) + Sweet Potato (3/4) + Asparagus (3/4 cup)",
//                         "Chicken Breast (3/4) + Couscous (3/4 cup) + Green Beans (3/4 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (3/4 cup)",
//                         "Quinoa Bowl + Black Beans (3/4 cup) + Corn (3/4 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1/2 cup) + Almonds (5) + Apple (1/2)",
//                         "Greek Yogurt (1/2 cup) + Blueberries (1/4 cup)",
//                         "Scrambled Eggs (1) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1/2 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1/2 cup) + Mixed Green Salad",
//                         "Salmon (1/2 fillet) + Brown Rice (1/2 cup) + Broccoli (1/2 cup)",
//                         "Vegetable Stir Fry + Tofu (1/2 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1/2 fillet) + Sweet Potato (1/2) + Asparagus (1/2 cup)",
//                         "Chicken Breast (1/2) + Couscous (1/2 cup) + Green Beans (1/2 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1/2 cup)",
//                         "Quinoa Bowl + Black Beans (1/2 cup) + Corn (1/2 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1)"
//                     ]
//                 }
//             }
//         },

//         '2500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (3) + Curd (1.5 cup) + Mango Pickle (1.5 tablespoon)",
//                         "Chole (1.5 cup) + Bhature (3) + Salad (1.5 bowl)",
//                         "Paneer Tikka (300 grams) + Green Chutney (3 tablespoons) + Mixed Veg Raita (1.5 cup)",
//                         "Rajma (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Dal Makhani (1.5 cup) + Naan (1.5) + Carrot Halwa (1.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.5 cup) + Naan (3)",
//                         "Aloo Gobhi (1.5 cup) + Chapati (3) + Boondi Raita (1.5 cup)",
//                         "Chicken Curry (1.5 cup) + Rice (1.5 cup) + Mixed Vegetable Salad (1.5 bowl)",
//                         "Palak Paneer (1.5 cup) + Jeera Rice (1.5 cup)",
//                         "Mutton Rogan Josh (1.5 cup) + Tandoori Roti (3)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Baingan Bharta (1.5 cup) + Chapati (3)",
//                         "Chicken Tikka (300 grams) + Mint Chutney (3 tablespoons) + Salad (1.5 bowl)",
//                         "Paneer Bhurji (1.5 cup) + Paratha (3)",
//                         "Kadhai Paneer (1.5 cup) + Jeera Rice (1.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1.5) + Curd (0.75 cup) + Mango Pickle (0.75 tablespoon)",
//                         "Chole (0.75 cup) + Bhature (1.5) + Salad (0.75 bowl)",
//                         "Paneer Tikka (150 grams) + Green Chutney (1.5 tablespoons) + Mixed Veg Raita (0.75 cup)",
//                         "Rajma (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Dal Makhani (0.75 cup) + Naan (0.75) + Carrot Halwa (0.75 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.75 cup) + Naan (1.5)",
//                         "Aloo Gobhi (0.75 cup) + Chapati (1.5) + Boondi Raita (0.75 cup)",
//                         "Chicken Curry (0.75 cup) + Rice (0.75 cup) + Mixed Vegetable Salad (0.75 bowl)",
//                         "Palak Paneer (0.75 cup) + Jeera Rice (0.75 cup)",
//                         "Mutton Rogan Josh (0.75 cup) + Tandoori Roti (1.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Baingan Bharta (0.75 cup) + Chapati (1.5)",
//                         "Chicken Tikka (150 grams) + Mint Chutney (1.5 tablespoons) + Salad (0.75 bowl)",
//                         "Paneer Bhurji (0.75 cup) + Paratha (1.5)",
//                         "Kadhai Paneer (0.75 cup) + Jeera Rice (0.75 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (0.75) + Curd (0.375 cup) + Mango Pickle (0.375 tablespoon)",
//                         "Chole (0.375 cup) + Bhature (0.75) + Salad (0.375 bowl)",
//                         "Paneer Tikka (75 grams) + Green Chutney (0.75 tablespoons) + Mixed Veg Raita (0.375 cup)",
//                         "Rajma (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Dal Makhani (0.375 cup) + Naan (0.75) + Carrot Halwa (0.375 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.375 cup) + Naan (0.75)",
//                         "Aloo Gobhi (0.375 cup) + Chapati (0.75) + Boondi Raita (0.375 cup)",
//                         "Chicken Curry (0.375 cup) + Rice (0.375 cup) + Mixed Vegetable Salad (0.375 bowl)",
//                         "Palak Paneer (0.375 cup) + Jeera Rice (0.375 cup)",
//                         "Mutton Rogan Josh (0.375 cup) + Tandoori Roti (0.75)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Baingan Bharta (0.375 cup) + Chapati (0.75)",
//                         "Chicken Tikka (75 grams) + Mint Chutney (0.75 tablespoons) + Salad (0.375 bowl)",
//                         "Paneer Bhurji (0.375 cup) + Paratha (0.75)",
//                         "Kadhai Paneer (0.375 cup) + Jeera Rice (0.375 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (3) + chutney (75 grams) + banana (1.5)",
//                         "Idli (4.5) + Sambar (1.5 cup) + Coconut Chutney (75 grams)",
//                         "Upma (1.5 cup) + Curd (1.5 cup) + Papaya (1.5 slice)",
//                         "Pongal (1.5 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (1.5 cup) + Mango (1.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.5 cup) + Papad (3) + Curd (1.5 cup)",
//                         "Fish Curry (1.5 cup) + Rice (1.5 cup) + Veg Poriyal (1.5 bowl)",
//                         "Lemon Rice (1.5 cup) + Coconut Chutney (75 grams) + Curd (1.5 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (1.5 bowl)",
//                         "Chicken Chettinad (1.5 cup) + Rice (1.5 cup) + Cucumber Raita (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (3) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (1.5 cup) + Pickle (1.5 tablespoon) + Papad (3)",
//                         "Vegetable Biryani (1.5 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (3)",
//                         "Egg Curry (1.5 cup) + Rice (1.5 cup) + Spinach Poriyal (1.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1.5) + chutney (75 grams) + banana (1.5)",
//                         "Idli (3) + Sambar (0.75 cup) + Coconut Chutney (75 grams)",
//                         "Upma (0.75 cup) + Curd (0.75 cup) + Papaya (1.5 slice)",
//                         "Pongal (0.75 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (0.75 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.75 cup) + Papad (1.5) + Curd (0.75 cup)",
//                         "Fish Curry (0.75 cup) + Rice (1.5 cup) + Veg Poriyal (0.75 bowl)",
//                         "Lemon Rice (0.75 cup) + Coconut Chutney (0.375 grams) + Curd (0.75 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (0.75 bowl)",
//                         "Chicken Chettinad (0.75 cup) + Rice (0.75 cup) + Cucumber Raita (0.75 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.5) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (0.75 cup) + Pickle (0.75 tablespoon) + Papad (1.5)",
//                         "Vegetable Biryani (0.75 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (1.5)",
//                         "Egg Curry (0.75 cup) + Rice (1.5 cup) + Spinach Poriyal (0.75 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (0.75) + chutney (37.5 grams) + banana (1.5)",
//                         "Idli (1.5) + Sambar (0.375 cup) + Coconut Chutney (37.5 grams)",
//                         "Upma (0.375 cup) + Curd (0.375 cup) + Papaya (0.75 slice)",
//                         "Pongal (0.375 cup) + Coconut Chutney (37.5 grams) + Orange (0.75)",
//                         "Masala Dosa (0.75) + Sambar (0.375 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.375 cup) + Papad (0.75) + Curd (0.375 cup)",
//                         "Fish Curry (0.375 cup) + Rice (0.75 cup) + Veg Poriyal (0.375 bowl)",
//                         "Lemon Rice (0.375 cup) + Coconut Chutney (37.5 grams) + Curd (0.375 cup)",
//                         "Rasam (0.75 cup) + Rice (0.75 cup) + Beetroot Thoran (0.375 bowl)",
//                         "Chicken Chettinad (0.375 cup) + Rice (0.375 cup) + Cucumber Raita (0.375 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (0.75) + Coconut Chutney (37.5 grams) + Tomato Chutney (37.5 grams)",
//                         "Curd Rice (0.375 cup) + Pickle (0.375 tablespoon) + Papad (0.75)",
//                         "Vegetable Biryani (0.375 cup) + Raita (0.75 cup)",
//                         "Avial (0.75 cup) + Rice (0.75 cup) + Appalam (0.75)",
//                         "Egg Curry (0.375 cup) + Rice (0.75 cup) + Spinach Poriyal (0.375 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.5) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Poached Egg (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3.5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (0.75/4 cup) + Apple (1)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2.5)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (0.75 cup) + Almonds (7) + Apple (0.75)",
//                         "Greek Yogurt (0.75 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (0.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (0.75 cup) + Mixed Green Salad",
//                         "Salmon (0.75 fillet) + Brown Rice (0.75 cup) + Broccoli (0.75 cup)",
//                         "Vegetable Stir Fry + Tofu (0.75 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (0.75 fillet) + Sweet Potato (0.75) + Asparagus (0.75 cup)",
//                         "Chicken Breast (0.75) + Couscous (0.75 cup) + Green Beans (0.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (0.75 cup)",
//                         "Quinoa Bowl + Black Beans (0.75 cup) + Corn (0.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1.5)"
//                     ]
//                 }
//             }
//         },

//         '3000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (4) + Curd (2 cup) + Mango Pickle (2 tablespoon)",
//                         "Chole (2 cup) + Bhature (4) + Salad (2 bowl)",
//                         "Paneer Tikka (400 grams) + Green Chutney (4 tablespoons) + Mixed Veg Raita (2 cup)",
//                         "Rajma (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Dal Makhani (2 cup) + Naan (2) + Carrot Halwa (2 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2 cup) + Naan (4)",
//                         "Aloo Gobhi (2 cup) + Chapati (4) + Boondi Raita (2 cup)",
//                         "Chicken Curry (2 cup) + Rice (2 cup) + Mixed Vegetable Salad (2 bowl)",
//                         "Palak Paneer (2 cup) + Jeera Rice (2 cup)",
//                         "Mutton Rogan Josh (2 cup) + Tandoori Roti (4)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Baingan Bharta (2 cup) + Chapati (4)",
//                         "Chicken Tikka (400 grams) + Mint Chutney (4 tablespoons) + Salad (2 bowl)",
//                         "Paneer Bhurji (2 cup) + Paratha (4)",
//                         "Kadhai Paneer (2 cup) + Jeera Rice (2 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (2/3 cup) + Mango Pickle (2/3 tablespoon)",
//                         "Chole (2/3 cup) + Bhature (1.5) + Salad (2/3 bowl)",
//                         "Paneer Tikka (133 grams) + Green Chutney (2/3 tablespoons) + Mixed Veg Raita (2/3 cup)",
//                         "Rajma (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Dal Makhani (2/3 cup) + Naan (1.5) + Carrot Halwa (2/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2/3 cup) + Naan (1.25)",
//                         "Aloo Gobhi (2/3 cup) + Chapati (1.25) + Boondi Raita (2/3 cup)",
//                         "Chicken Curry (2/3 cup) + Rice (2/3 cup) + Mixed Vegetable Salad (2/3 bowl)",
//                         "Palak Paneer (2/3 cup) + Jeera Rice (2/3 cup)",
//                         "Mutton Rogan Josh (2/3 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Baingan Bharta (2/3 cup) + Chapati (1.25)",
//                         "Chicken Tikka (133 grams) + Mint Chutney (2/3 tablespoons) + Salad (2/3 bowl)",
//                         "Paneer Bhurji (2/3 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (2/3 cup) + Jeera Rice (2/3 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (4) + chutney (100 grams) + banana (2)",
//                         "Idli (6) + Sambar (2 cup) + Coconut Chutney (100 grams)",
//                         "Upma (2 cup) + Curd (2 cup) + Papaya (2 slice)",
//                         "Pongal (2 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (2 cup) + Mango (2 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2 cup) + Papad (4) + Curd (2 cup)",
//                         "Fish Curry (2 cup) + Rice (2 cup) + Veg Poriyal (2 bowl)",
//                         "Lemon Rice (2 cup) + Coconut Chutney (100 grams) + Curd (2 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (2 bowl)",
//                         "Chicken Chettinad (2 cup) + Rice (2 cup) + Cucumber Raita (2 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (4) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (2 cup) + Pickle (2 tablespoon) + Papad (4)",
//                         "Vegetable Biryani (2 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (4)",
//                         "Egg Curry (2 cup) + Rice (2 cup) + Spinach Poriyal (2 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (100 grams) + banana (2)",
//                         "Idli (4) + Sambar (1 cup) + Coconut Chutney (100 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (2 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (2 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (2 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (2)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (2) + Sambar (1/2 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (50 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Poached Egg (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.25) + Whole Wheat Toast (2.25 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Boiled Egg (1.25)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2.5) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 }
//             }
//         },

        
//         '3500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (5) + Curd (2.5 cup) + Mango Pickle (2.5 tablespoon)",
//                         "Chole (2.5 cup) + Bhature (5) + Salad (2.5 bowl)",
//                         "Paneer Tikka (500 grams) + Green Chutney (5 tablespoons) + Mixed Veg Raita (2.5 cup)",
//                         "Rajma (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Dal Makhani (2.5 cup) + Naan (2.5) + Carrot Halwa (2.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2.5 cup) + Naan (5)",
//                         "Aloo Gobhi (2.5 cup) + Chapati (5) + Boondi Raita (2.5 cup)",
//                         "Chicken Curry (2.5 cup) + Rice (2.5 cup) + Mixed Vegetable Salad (2.5 bowl)",
//                         "Palak Paneer (2.5 cup) + Jeera Rice (2.5 cup)",
//                         "Mutton Rogan Josh (2.5 cup) + Tandoori Roti (5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Baingan Bharta (2.5 cup) + Chapati (5)",
//                         "Chicken Tikka (500 grams) + Mint Chutney (5 tablespoons) + Salad (2.5 bowl)",
//                         "Paneer Bhurji (2.5 cup) + Paratha (5)",
//                         "Kadhai Paneer (2.5 cup) + Jeera Rice (2.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2.5) + Curd (1.25 cup) + Mango Pickle (1.25 tablespoon)",
//                         "Chole (1.25 cup) + Bhature (2.5) + Salad (1.25 bowl)",
//                         "Paneer Tikka (250 grams) + Green Chutney (2.5 tablespoons) + Mixed Veg Raita (1.25 cup)",
//                         "Rajma (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Dal Makhani (1.25 cup) + Naan (1.25) + Carrot Halwa (1.25 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.25 cup) + Naan (2.5)",
//                         "Aloo Gobhi (1.25 cup) + Chapati (2.5) + Boondi Raita (1.25 cup)",
//                         "Chicken Curry (1.25 cup) + Rice (1.25 cup) + Mixed Vegetable Salad (1.25 bowl)",
//                         "Palak Paneer (1.25 cup) + Jeera Rice (1.25 cup)",
//                         "Mutton Rogan Josh (1.25 cup) + Tandoori Roti (2.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Baingan Bharta (1.25 cup) + Chapati (2.5)",
//                         "Chicken Tikka (250 grams) + Mint Chutney (2.5 tablespoons) + Salad (1.25 bowl)",
//                         "Paneer Bhurji (1.25 cup) + Paratha (2.5)",
//                         "Kadhai Paneer (1.25 cup) + Jeera Rice (1.25 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1.25) + Curd (0.625 cup) + Mango Pickle (0.625 tablespoon)",
//                         "Chole (0.625 cup) + Bhature (1.25) + Salad (0.625 bowl)",
//                         "Paneer Tikka (125 grams) + Green Chutney (0.625 tablespoons) + Mixed Veg Raita (0.625 cup)",
//                         "Rajma (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Dal Makhani (0.625 cup) + Naan (1.25) + Carrot Halwa (0.625 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.625 cup) + Naan (1.25)",
//                         "Aloo Gobhi (0.625 cup) + Chapati (1.25) + Boondi Raita (0.625 cup)",
//                         "Chicken Curry (0.625 cup) + Rice (0.625 cup) + Mixed Vegetable Salad (0.625 bowl)",
//                         "Palak Paneer (0.625 cup) + Jeera Rice (0.625 cup)",
//                         "Mutton Rogan Josh (0.625 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Baingan Bharta (0.625 cup) + Chapati (1.25)",
//                         "Chicken Tikka (125 grams) + Mint Chutney (0.625 tablespoons) + Salad (0.625 bowl)",
//                         "Paneer Bhurji (0.625 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (0.625 cup) + Jeera Rice (0.625 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (7.5) + Sambar (2.5 cup) + Coconut Chutney (125 grams)",
//                         "Upma (2.5 cup) + Curd (2.5 cup) + Papaya (2.5 slice)",
//                         "Pongal (2.5 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (2.5 cup) + Mango (2.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2.5 cup) + Papad (5) + Curd (2.5 cup)",
//                         "Fish Curry (2.5 cup) + Rice (2.5 cup) + Veg Poriyal (2.5 bowl)",
//                         "Lemon Rice (2.5 cup) + Coconut Chutney (125 grams) + Curd (2.5 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (2.5 bowl)",
//                         "Chicken Chettinad (2.5 cup) + Rice (2.5 cup) + Cucumber Raita (2.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (2.5 cup) + Pickle (2.5 tablespoon) + Papad (5)",
//                         "Vegetable Biryani (2.5 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (5)",
//                         "Egg Curry (2.5 cup) + Rice (2.5 cup) + Spinach Poriyal (2.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2.5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (5) + Sambar (1.25 cup) + Coconut Chutney (125 grams)",
//                         "Upma (1.25 cup) + Curd (1.25 cup) + Papaya (2.5 slice)",
//                         "Pongal (1.25 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (1.25 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.25 cup) + Papad (2.5) + Curd (1.25 cup)",
//                         "Fish Curry (1.25 cup) + Rice (2.5 cup) + Veg Poriyal (1.25 bowl)",
//                         "Lemon Rice (1.25 cup) + Coconut Chutney (1.25 grams) + Curd (1.25 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (1.25 bowl)",
//                         "Chicken Chettinad (1.25 cup) + Rice (1.25 cup) + Cucumber Raita (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2.5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (1.25 cup) + Pickle (1.25 tablespoon) + Papad (2.5)",
//                         "Vegetable Biryani (1.25 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (2.5)",
//                         "Egg Curry (1.25 cup) + Rice (2.5 cup) + Spinach Poriyal (1.25 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1.25) + chutney (62.5 grams) + banana (1.25)",
//                         "Idli (2.5) + Sambar (0.625 cup) + Coconut Chutney (62.5 grams)",
//                         "Upma (0.625 cup) + Curd (0.625 cup) + Papaya (1.25 slice)",
//                         "Pongal (0.625 cup) + Coconut Chutney (62.5 grams) + Orange (1.25)",
//                         "Masala Dosa (1.25) + Sambar (0.625 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.625 cup) + Papad (1.25) + Curd (0.625 cup)",
//                         "Fish Curry (0.625 cup) + Rice (1.25 cup) + Veg Poriyal (0.625 bowl)",
//                         "Lemon Rice (0.625 cup) + Coconut Chutney (62.5 grams) + Curd (0.625 cup)",
//                         "Rasam (1.25 cup) + Rice (1.25 cup) + Beetroot Thoran (0.625 bowl)",
//                         "Chicken Chettinad (0.625 cup) + Rice (0.625 cup) + Cucumber Raita (0.625 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.25) + Coconut Chutney (62.5 grams) + Tomato Chutney (62.5 grams)",
//                         "Curd Rice (0.625 cup) + Pickle (0.625 tablespoon) + Papad (1.25)",
//                         "Vegetable Biryani (0.625 cup) + Raita (1.25 cup)",
//                         "Avial (1.25 cup) + Rice (1.25 cup) + Appalam (1.25)",
//                         "Egg Curry (0.625 cup) + Rice (1.25 cup) + Spinach Poriyal (0.625 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.75 cup) + Almonds (18) + Apple (1.75)",
//                         "Greek Yogurt (1.75 cup) + Blueberries (1.25 cup)",
//                         "Scrambled Eggs (5) + Whole Wheat Toast (3.75 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.75 slice) + Poached Egg (1.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.75 cup) + Mixed Green Salad",
//                         "Salmon (1.75 fillet) + Brown Rice (1.75 cup) + Broccoli (1.75 cup)",
//                         "Vegetable Stir Fry + Tofu (1.75 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.75 fillet) + Sweet Potato (1.75) + Asparagus (1.75 cup)",
//                         "Chicken Breast (1.75) + Couscous (1.75 cup) + Green Beans (1.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.75 cup)",
//                         "Quinoa Bowl + Black Beans (1.75 cup) + Corn (1.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Boiled Egg (1.5)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1.5 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 }
//             }
//         }
//     };

//     return options[calorieCategory][type][numberOfMeals][meal].map(option => `<option value="${option}">${option}</option>`).join('');
// }

// function generatePlan(calorieOverride = null) {
//     if (calorieOverride) {
//         calorieCategory = calorieOverride;
//         updateMealOptions();
//     }

//     const meals = document.getElementById('meals').value;

//     const dietPlanDetails = document.getElementById('diet-plan-details');
//     dietPlanDetails.innerHTML = `<p>Category: ${calorieCategory} kcal</p><p>Meals: ${meals}</p>`;

//     const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
//     if (meals == 4) {
//         mealLabels.splice(1, 0, 'Snack');
//     } else if (meals == 5) {
//         mealLabels.splice(1, 0, 'Snack1');
//         mealLabels.splice(3, 0, 'Snack2');
//     }

//     mealLabels.forEach(label => {
//         let mealType = '';
//         if (activityLevel === 'sedentary') {
//             mealType = document.getElementById(`north-${label.toLowerCase()}-select`).value || document.getElementById(`south-${label.toLowerCase()}-select`).value;
//         } else {
//             mealType = document.getElementById(`active-${label.toLowerCase()}-select`).value;
//         }
//         dietPlanDetails.innerHTML += `<p>${label}: ${mealType}</p>`;
//     });

//     document.getElementById('diet-plan').classList.remove('hidden');
//     document.getElementById('explore-more').classList.remove('hidden');
// }

// function calculateCalories(height, weight, gender) {
//     return (10 * weight) + (6.25 * height) - (5 * 25) + (gender === 'male' ? 5 : -161);
// }

// document.querySelectorAll('.meal-select').forEach(select => {
//     select.addEventListener('change', (event) => {
//         const selectedMeal = event.target.id.split('-')[1]; // breakfast, lunch, dinner, snack1, snack2
//         const selectedType = event.target.id.split('-')[0]; // north, south, active
//         const value = event.target.value;

//         if (value) {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//             }
//         } else {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//             }
//         }
//     });
// });

// document.getElementById('explore-2000').addEventListener('click', () => generatePlan('2000'));
// document.getElementById('explore-2500').addEventListener('click', () => generatePlan('2500'));
// document.getElementById('explore-3000').addEventListener('click', () => generatePlan('3000'));
// document.getElementById('explore-3500').addEventListener('click', () => generatePlan('3500'));






// document.getElementById('sedentary').addEventListener('click', () => {
//     showForm('sedentary');
// });

// document.getElementById('active').addEventListener('click', () => {
//     showForm('active');
// });

// document.querySelectorAll('#height, #weight, #gender, #meals').forEach(input => {
//     input.addEventListener('input', () => {
//         if (isFormFilled()) {
//             calculateAndShowMeals();
//         }
//     });
// });

// document.getElementById('diet-form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     generatePlan();
// });

// let activityLevel = '';
// let maintenanceCalories = 0;
// let calorieCategory = '2000';

// function showForm(level) {
//     activityLevel = level;
//     document.getElementById('form-container').classList.remove('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
// }

// function isFormFilled() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;
//     const meals = document.getElementById('meals').value;
//     return height && weight && gender && meals;
// }

// function calculateAndShowMeals() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;

//     maintenanceCalories = calculateCalories(height, weight, gender);
//     if (maintenanceCalories < 2000) {
//         maintenanceCalories = 2000;
//     } else if (maintenanceCalories > 3500) {
//         maintenanceCalories = 3500;
//     }

//     if (maintenanceCalories > 3200) {
//         calorieCategory = '3500';
//     } else if (maintenanceCalories > 2700) {
//         calorieCategory = '3000';
//     } else if (maintenanceCalories > 2200) {
//         calorieCategory = '2500';
//     } else {
//         calorieCategory = '2000';
//     }

//     updateMealOptions();
//     document.getElementById('meal-options').classList.remove('hidden');
// }

// function updateMealOptions() {
//     const northBreakfastSelect = document.getElementById('north-breakfast-select');
//     const northSnack1Select = document.getElementById('north-snack1-select');
//     const northLunchSelect = document.getElementById('north-lunch-select');
//     const northSnack2Select = document.getElementById('north-snack2-select');
//     const northDinnerSelect = document.getElementById('north-dinner-select');

//     const southBreakfastSelect = document.getElementById('south-breakfast-select');
//     const southSnack1Select = document.getElementById('south-snack1-select');
//     const southLunchSelect = document.getElementById('south-lunch-select');
//     const southSnack2Select = document.getElementById('south-snack2-select');
//     const southDinnerSelect = document.getElementById('south-dinner-select');

//     const activeBreakfastSelect = document.getElementById('active-breakfast-select');
//     const activeSnack1Select = document.getElementById('active-snack1-select');
//     const activeLunchSelect = document.getElementById('active-lunch-select');
//     const activeSnack2Select = document.getElementById('active-snack2-select');
//     const activeDinnerSelect = document.getElementById('active-dinner-select');

//     const numberOfMeals = document.getElementById('meals').value;

//     if (activityLevel === 'sedentary') {
//         document.getElementById('north-indian').classList.remove('hidden');
//         document.getElementById('south-indian').classList.remove('hidden');

//         northBreakfastSelect.innerHTML = getOptions('north', 'breakfast', numberOfMeals);
//         northSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('north', 'snack1', numberOfMeals) : '';
//         northLunchSelect.innerHTML = getOptions('north', 'lunch', numberOfMeals);
//         northSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('north', 'snack2', numberOfMeals) : '';
//         northDinnerSelect.innerHTML = getOptions('north', 'dinner', numberOfMeals);

//         southBreakfastSelect.innerHTML = getOptions('south', 'breakfast', numberOfMeals);
//         southSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('south', 'snack1', numberOfMeals) : '';
//         southLunchSelect.innerHTML = getOptions('south', 'lunch', numberOfMeals);
//         southSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('south', 'snack2', numberOfMeals) : '';
//         southDinnerSelect.innerHTML = getOptions('south', 'dinner', numberOfMeals);

//         toggleVisibility(northSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(northSnack2Select, numberOfMeals == 5);
//         toggleVisibility(southSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(southSnack2Select, numberOfMeals == 5);
//     } else {
//         document.getElementById('active-meals').classList.remove('hidden');

//         activeBreakfastSelect.innerHTML = getOptions('active', 'breakfast', numberOfMeals);
//         activeSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('active', 'snack1', numberOfMeals) : '';
//         activeLunchSelect.innerHTML = getOptions('active', 'lunch', numberOfMeals);
//         activeSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('active', 'snack2', numberOfMeals) : '';
//         activeDinnerSelect.innerHTML = getOptions('active', 'dinner', numberOfMeals);

//         toggleVisibility(activeSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(activeSnack2Select, numberOfMeals == 5);
//     }
// }

// function toggleVisibility(element, isVisible) {
//     if (isVisible) {
//         element.classList.remove('hidden');
//         element.previousElementSibling.classList.remove('hidden');
//     } else {
//         element.classList.add('hidden');
//         element.previousElementSibling.classList.add('hidden');
//     }
// }

// function getOptions(type, meal, numberOfMeals) {
//     const options = {
//         '2000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (1/2 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/2 cup) + Bhature (1) + Salad (1/2 bowl)",
//                         "Paneer Tikka (100 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1/2 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/2 cup) + Naan (1)",
//                         "Aloo Gobhi (1/2 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/2 cup) + Rice (1/2 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1/2 cup) + Tandoori Roti (1)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/2 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/2 cup) + Chapati (1)",
//                         "Chicken Tikka (100 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/2 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/2 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1/2) + Curd (1/3 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/3 cup) + Bhature (1) + Salad (1/3 bowl)",
//                         "Paneer Tikka (50 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1/2 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1/2 cup) + Naan (1) + Carrot Halwa (1/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/3 cup) + Naan (1)",
//                         "Aloo Gobhi (1/3 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/3 cup) + Rice (1/3 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1/2 cup)",
//                         "Mutton Rogan Josh (1/3 cup) + Tandoori Roti (1)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/3 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/3 cup) + Chapati (1)",
//                         "Chicken Tikka (70 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/3 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/3 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (1)",
//                         "Idli (3) + Sambar (1 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (1 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (1 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (50 grams) + banana (1)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1/2 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (25 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (25 grams) + banana (1)",
//                         "Idli (1) + Sambar (1/3 cup) + Coconut Chutney (25 grams)",
//                         "Upma (1/3 cup) + Curd (1/3 cup) + Papaya (1 slice)",
//                         "Pongal (1/3 cup) + Coconut Chutney (25 grams) + Orange (1/2)",
//                         "Masala Dosa (1) + Sambar (1/3 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/3 cup) + Papad (1) + Curd (1/3 cup)",
//                         "Fish Curry (1/3 cup) + Rice (1/2 cup) + Veg Poriyal (1/3 bowl)",
//                         "Lemon Rice (1/3 cup) + Coconut Chutney (25 grams) + Curd (1/3 cup)",
//                         "Rasam (1 cup) + Rice (1/2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/3 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (25 grams) + Tomato Chutney (25 grams)",
//                         "Curd Rice (1/3 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/3 cup) + Raita (1 cup)",
//                         "Avial (1/2 cup) + Rice (1/2 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1/2 cup) + Spinach Poriyal (1/2 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (1/2 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Poached Egg (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (3/4 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (3/4 cup) + Blueberries (1/3 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (3/4 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (3/4 cup) + Mixed Green Salad",
//                         "Salmon (3/4 fillet) + Brown Rice (3/4 cup) + Broccoli (3/4 cup)",
//                         "Vegetable Stir Fry + Tofu (3/4 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (3/4 fillet) + Sweet Potato (3/4) + Asparagus (3/4 cup)",
//                         "Chicken Breast (3/4) + Couscous (3/4 cup) + Green Beans (3/4 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (3/4 cup)",
//                         "Quinoa Bowl + Black Beans (3/4 cup) + Corn (3/4 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1/2 cup) + Almonds (5) + Apple (1/2)",
//                         "Greek Yogurt (1/2 cup) + Blueberries (1/4 cup)",
//                         "Scrambled Eggs (1) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1/2 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1/2 cup) + Mixed Green Salad",
//                         "Salmon (1/2 fillet) + Brown Rice (1/2 cup) + Broccoli (1/2 cup)",
//                         "Vegetable Stir Fry + Tofu (1/2 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1/2 fillet) + Sweet Potato (1/2) + Asparagus (1/2 cup)",
//                         "Chicken Breast (1/2) + Couscous (1/2 cup) + Green Beans (1/2 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1/2 cup)",
//                         "Quinoa Bowl + Black Beans (1/2 cup) + Corn (1/2 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1)"
//                     ]
//                 }
//             }
//         },

//         '2500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (3) + Curd (1.5 cup) + Mango Pickle (1.5 tablespoon)",
//                         "Chole (1.5 cup) + Bhature (3) + Salad (1.5 bowl)",
//                         "Paneer Tikka (300 grams) + Green Chutney (3 tablespoons) + Mixed Veg Raita (1.5 cup)",
//                         "Rajma (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Dal Makhani (1.5 cup) + Naan (1.5) + Carrot Halwa (1.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.5 cup) + Naan (3)",
//                         "Aloo Gobhi (1.5 cup) + Chapati (3) + Boondi Raita (1.5 cup)",
//                         "Chicken Curry (1.5 cup) + Rice (1.5 cup) + Mixed Vegetable Salad (1.5 bowl)",
//                         "Palak Paneer (1.5 cup) + Jeera Rice (1.5 cup)",
//                         "Mutton Rogan Josh (1.5 cup) + Tandoori Roti (3)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Baingan Bharta (1.5 cup) + Chapati (3)",
//                         "Chicken Tikka (300 grams) + Mint Chutney (3 tablespoons) + Salad (1.5 bowl)",
//                         "Paneer Bhurji (1.5 cup) + Paratha (3)",
//                         "Kadhai Paneer (1.5 cup) + Jeera Rice (1.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1.5) + Curd (0.75 cup) + Mango Pickle (0.75 tablespoon)",
//                         "Chole (0.75 cup) + Bhature (1.5) + Salad (0.75 bowl)",
//                         "Paneer Tikka (150 grams) + Green Chutney (1.5 tablespoons) + Mixed Veg Raita (0.75 cup)",
//                         "Rajma (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Dal Makhani (0.75 cup) + Naan (0.75) + Carrot Halwa (0.75 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.75 cup) + Naan (1.5)",
//                         "Aloo Gobhi (0.75 cup) + Chapati (1.5) + Boondi Raita (0.75 cup)",
//                         "Chicken Curry (0.75 cup) + Rice (0.75 cup) + Mixed Vegetable Salad (0.75 bowl)",
//                         "Palak Paneer (0.75 cup) + Jeera Rice (0.75 cup)",
//                         "Mutton Rogan Josh (0.75 cup) + Tandoori Roti (1.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Baingan Bharta (0.75 cup) + Chapati (1.5)",
//                         "Chicken Tikka (150 grams) + Mint Chutney (1.5 tablespoons) + Salad (0.75 bowl)",
//                         "Paneer Bhurji (0.75 cup) + Paratha (1.5)",
//                         "Kadhai Paneer (0.75 cup) + Jeera Rice (0.75 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (0.75) + Curd (0.375 cup) + Mango Pickle (0.375 tablespoon)",
//                         "Chole (0.375 cup) + Bhature (0.75) + Salad (0.375 bowl)",
//                         "Paneer Tikka (75 grams) + Green Chutney (0.75 tablespoons) + Mixed Veg Raita (0.375 cup)",
//                         "Rajma (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Dal Makhani (0.375 cup) + Naan (0.75) + Carrot Halwa (0.375 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.375 cup) + Naan (0.75)",
//                         "Aloo Gobhi (0.375 cup) + Chapati (0.75) + Boondi Raita (0.375 cup)",
//                         "Chicken Curry (0.375 cup) + Rice (0.375 cup) + Mixed Vegetable Salad (0.375 bowl)",
//                         "Palak Paneer (0.375 cup) + Jeera Rice (0.375 cup)",
//                         "Mutton Rogan Josh (0.375 cup) + Tandoori Roti (0.75)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Baingan Bharta (0.375 cup) + Chapati (0.75)",
//                         "Chicken Tikka (75 grams) + Mint Chutney (0.75 tablespoons) + Salad (0.375 bowl)",
//                         "Paneer Bhurji (0.375 cup) + Paratha (0.75)",
//                         "Kadhai Paneer (0.375 cup) + Jeera Rice (0.375 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (3) + chutney (75 grams) + banana (1.5)",
//                         "Idli (4.5) + Sambar (1.5 cup) + Coconut Chutney (75 grams)",
//                         "Upma (1.5 cup) + Curd (1.5 cup) + Papaya (1.5 slice)",
//                         "Pongal (1.5 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (1.5 cup) + Mango (1.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.5 cup) + Papad (3) + Curd (1.5 cup)",
//                         "Fish Curry (1.5 cup) + Rice (1.5 cup) + Veg Poriyal (1.5 bowl)",
//                         "Lemon Rice (1.5 cup) + Coconut Chutney (75 grams) + Curd (1.5 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (1.5 bowl)",
//                         "Chicken Chettinad (1.5 cup) + Rice (1.5 cup) + Cucumber Raita (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (3) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (1.5 cup) + Pickle (1.5 tablespoon) + Papad (3)",
//                         "Vegetable Biryani (1.5 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (3)",
//                         "Egg Curry (1.5 cup) + Rice (1.5 cup) + Spinach Poriyal (1.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1.5) + chutney (75 grams) + banana (1.5)",
//                         "Idli (3) + Sambar (0.75 cup) + Coconut Chutney (75 grams)",
//                         "Upma (0.75 cup) + Curd (0.75 cup) + Papaya (1.5 slice)",
//                         "Pongal (0.75 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (0.75 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.75 cup) + Papad (1.5) + Curd (0.75 cup)",
//                         "Fish Curry (0.75 cup) + Rice (1.5 cup) + Veg Poriyal (0.75 bowl)",
//                         "Lemon Rice (0.75 cup) + Coconut Chutney (0.375 grams) + Curd (0.75 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (0.75 bowl)",
//                         "Chicken Chettinad (0.75 cup) + Rice (0.75 cup) + Cucumber Raita (0.75 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.5) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (0.75 cup) + Pickle (0.75 tablespoon) + Papad (1.5)",
//                         "Vegetable Biryani (0.75 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (1.5)",
//                         "Egg Curry (0.75 cup) + Rice (1.5 cup) + Spinach Poriyal (0.75 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (0.75) + chutney (37.5 grams) + banana (1.5)",
//                         "Idli (1.5) + Sambar (0.375 cup) + Coconut Chutney (37.5 grams)",
//                         "Upma (0.375 cup) + Curd (0.375 cup) + Papaya (0.75 slice)",
//                         "Pongal (0.375 cup) + Coconut Chutney (37.5 grams) + Orange (0.75)",
//                         "Masala Dosa (0.75) + Sambar (0.375 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.375 cup) + Papad (0.75) + Curd (0.375 cup)",
//                         "Fish Curry (0.375 cup) + Rice (0.75 cup) + Veg Poriyal (0.375 bowl)",
//                         "Lemon Rice (0.375 cup) + Coconut Chutney (37.5 grams) + Curd (0.375 cup)",
//                         "Rasam (0.75 cup) + Rice (0.75 cup) + Beetroot Thoran (0.375 bowl)",
//                         "Chicken Chettinad (0.375 cup) + Rice (0.375 cup) + Cucumber Raita (0.375 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (0.75) + Coconut Chutney (37.5 grams) + Tomato Chutney (37.5 grams)",
//                         "Curd Rice (0.375 cup) + Pickle (0.375 tablespoon) + Papad (0.75)",
//                         "Vegetable Biryani (0.375 cup) + Raita (0.75 cup)",
//                         "Avial (0.75 cup) + Rice (0.75 cup) + Appalam (0.75)",
//                         "Egg Curry (0.375 cup) + Rice (0.75 cup) + Spinach Poriyal (0.375 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.5) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Poached Egg (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3.5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (0.75/4 cup) + Apple (1)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2.5)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (0.75 cup) + Almonds (7) + Apple (0.75)",
//                         "Greek Yogurt (0.75 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (0.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (0.75 cup) + Mixed Green Salad",
//                         "Salmon (0.75 fillet) + Brown Rice (0.75 cup) + Broccoli (0.75 cup)",
//                         "Vegetable Stir Fry + Tofu (0.75 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (0.75 fillet) + Sweet Potato (0.75) + Asparagus (0.75 cup)",
//                         "Chicken Breast (0.75) + Couscous (0.75 cup) + Green Beans (0.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (0.75 cup)",
//                         "Quinoa Bowl + Black Beans (0.75 cup) + Corn (0.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1.5)"
//                     ]
//                 }
//             }
//         },

//         '3000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (4) + Curd (2 cup) + Mango Pickle (2 tablespoon)",
//                         "Chole (2 cup) + Bhature (4) + Salad (2 bowl)",
//                         "Paneer Tikka (400 grams) + Green Chutney (4 tablespoons) + Mixed Veg Raita (2 cup)",
//                         "Rajma (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Dal Makhani (2 cup) + Naan (2) + Carrot Halwa (2 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2 cup) + Naan (4)",
//                         "Aloo Gobhi (2 cup) + Chapati (4) + Boondi Raita (2 cup)",
//                         "Chicken Curry (2 cup) + Rice (2 cup) + Mixed Vegetable Salad (2 bowl)",
//                         "Palak Paneer (2 cup) + Jeera Rice (2 cup)",
//                         "Mutton Rogan Josh (2 cup) + Tandoori Roti (4)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Baingan Bharta (2 cup) + Chapati (4)",
//                         "Chicken Tikka (400 grams) + Mint Chutney (4 tablespoons) + Salad (2 bowl)",
//                         "Paneer Bhurji (2 cup) + Paratha (4)",
//                         "Kadhai Paneer (2 cup) + Jeera Rice (2 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (2/3 cup) + Mango Pickle (2/3 tablespoon)",
//                         "Chole (2/3 cup) + Bhature (1.5) + Salad (2/3 bowl)",
//                         "Paneer Tikka (133 grams) + Green Chutney (2/3 tablespoons) + Mixed Veg Raita (2/3 cup)",
//                         "Rajma (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Dal Makhani (2/3 cup) + Naan (1.5) + Carrot Halwa (2/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2/3 cup) + Naan (1.25)",
//                         "Aloo Gobhi (2/3 cup) + Chapati (1.25) + Boondi Raita (2/3 cup)",
//                         "Chicken Curry (2/3 cup) + Rice (2/3 cup) + Mixed Vegetable Salad (2/3 bowl)",
//                         "Palak Paneer (2/3 cup) + Jeera Rice (2/3 cup)",
//                         "Mutton Rogan Josh (2/3 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Baingan Bharta (2/3 cup) + Chapati (1.25)",
//                         "Chicken Tikka (133 grams) + Mint Chutney (2/3 tablespoons) + Salad (2/3 bowl)",
//                         "Paneer Bhurji (2/3 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (2/3 cup) + Jeera Rice (2/3 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (4) + chutney (100 grams) + banana (2)",
//                         "Idli (6) + Sambar (2 cup) + Coconut Chutney (100 grams)",
//                         "Upma (2 cup) + Curd (2 cup) + Papaya (2 slice)",
//                         "Pongal (2 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (2 cup) + Mango (2 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2 cup) + Papad (4) + Curd (2 cup)",
//                         "Fish Curry (2 cup) + Rice (2 cup) + Veg Poriyal (2 bowl)",
//                         "Lemon Rice (2 cup) + Coconut Chutney (100 grams) + Curd (2 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (2 bowl)",
//                         "Chicken Chettinad (2 cup) + Rice (2 cup) + Cucumber Raita (2 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (4) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (2 cup) + Pickle (2 tablespoon) + Papad (4)",
//                         "Vegetable Biryani (2 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (4)",
//                         "Egg Curry (2 cup) + Rice (2 cup) + Spinach Poriyal (2 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (100 grams) + banana (2)",
//                         "Idli (4) + Sambar (1 cup) + Coconut Chutney (100 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (2 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (2 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (2 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (2)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (2) + Sambar (1/2 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (50 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Poached Egg (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.25) + Whole Wheat Toast (2.25 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Boiled Egg (1.25)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2.5) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 }
//             }
//         },

        
//         '3500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (5) + Curd (2.5 cup) + Mango Pickle (2.5 tablespoon)",
//                         "Chole (2.5 cup) + Bhature (5) + Salad (2.5 bowl)",
//                         "Paneer Tikka (500 grams) + Green Chutney (5 tablespoons) + Mixed Veg Raita (2.5 cup)",
//                         "Rajma (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Dal Makhani (2.5 cup) + Naan (2.5) + Carrot Halwa (2.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2.5 cup) + Naan (5)",
//                         "Aloo Gobhi (2.5 cup) + Chapati (5) + Boondi Raita (2.5 cup)",
//                         "Chicken Curry (2.5 cup) + Rice (2.5 cup) + Mixed Vegetable Salad (2.5 bowl)",
//                         "Palak Paneer (2.5 cup) + Jeera Rice (2.5 cup)",
//                         "Mutton Rogan Josh (2.5 cup) + Tandoori Roti (5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Baingan Bharta (2.5 cup) + Chapati (5)",
//                         "Chicken Tikka (500 grams) + Mint Chutney (5 tablespoons) + Salad (2.5 bowl)",
//                         "Paneer Bhurji (2.5 cup) + Paratha (5)",
//                         "Kadhai Paneer (2.5 cup) + Jeera Rice (2.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2.5) + Curd (1.25 cup) + Mango Pickle (1.25 tablespoon)",
//                         "Chole (1.25 cup) + Bhature (2.5) + Salad (1.25 bowl)",
//                         "Paneer Tikka (250 grams) + Green Chutney (2.5 tablespoons) + Mixed Veg Raita (1.25 cup)",
//                         "Rajma (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Dal Makhani (1.25 cup) + Naan (1.25) + Carrot Halwa (1.25 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.25 cup) + Naan (2.5)",
//                         "Aloo Gobhi (1.25 cup) + Chapati (2.5) + Boondi Raita (1.25 cup)",
//                         "Chicken Curry (1.25 cup) + Rice (1.25 cup) + Mixed Vegetable Salad (1.25 bowl)",
//                         "Palak Paneer (1.25 cup) + Jeera Rice (1.25 cup)",
//                         "Mutton Rogan Josh (1.25 cup) + Tandoori Roti (2.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Baingan Bharta (1.25 cup) + Chapati (2.5)",
//                         "Chicken Tikka (250 grams) + Mint Chutney (2.5 tablespoons) + Salad (1.25 bowl)",
//                         "Paneer Bhurji (1.25 cup) + Paratha (2.5)",
//                         "Kadhai Paneer (1.25 cup) + Jeera Rice (1.25 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1.25) + Curd (0.625 cup) + Mango Pickle (0.625 tablespoon)",
//                         "Chole (0.625 cup) + Bhature (1.25) + Salad (0.625 bowl)",
//                         "Paneer Tikka (125 grams) + Green Chutney (0.625 tablespoons) + Mixed Veg Raita (0.625 cup)",
//                         "Rajma (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Dal Makhani (0.625 cup) + Naan (1.25) + Carrot Halwa (0.625 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.625 cup) + Naan (1.25)",
//                         "Aloo Gobhi (0.625 cup) + Chapati (1.25) + Boondi Raita (0.625 cup)",
//                         "Chicken Curry (0.625 cup) + Rice (0.625 cup) + Mixed Vegetable Salad (0.625 bowl)",
//                         "Palak Paneer (0.625 cup) + Jeera Rice (0.625 cup)",
//                         "Mutton Rogan Josh (0.625 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Baingan Bharta (0.625 cup) + Chapati (1.25)",
//                         "Chicken Tikka (125 grams) + Mint Chutney (0.625 tablespoons) + Salad (0.625 bowl)",
//                         "Paneer Bhurji (0.625 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (0.625 cup) + Jeera Rice (0.625 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (7.5) + Sambar (2.5 cup) + Coconut Chutney (125 grams)",
//                         "Upma (2.5 cup) + Curd (2.5 cup) + Papaya (2.5 slice)",
//                         "Pongal (2.5 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (2.5 cup) + Mango (2.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2.5 cup) + Papad (5) + Curd (2.5 cup)",
//                         "Fish Curry (2.5 cup) + Rice (2.5 cup) + Veg Poriyal (2.5 bowl)",
//                         "Lemon Rice (2.5 cup) + Coconut Chutney (125 grams) + Curd (2.5 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (2.5 bowl)",
//                         "Chicken Chettinad (2.5 cup) + Rice (2.5 cup) + Cucumber Raita (2.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (2.5 cup) + Pickle (2.5 tablespoon) + Papad (5)",
//                         "Vegetable Biryani (2.5 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (5)",
//                         "Egg Curry (2.5 cup) + Rice (2.5 cup) + Spinach Poriyal (2.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2.5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (5) + Sambar (1.25 cup) + Coconut Chutney (125 grams)",
//                         "Upma (1.25 cup) + Curd (1.25 cup) + Papaya (2.5 slice)",
//                         "Pongal (1.25 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (1.25 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.25 cup) + Papad (2.5) + Curd (1.25 cup)",
//                         "Fish Curry (1.25 cup) + Rice (2.5 cup) + Veg Poriyal (1.25 bowl)",
//                         "Lemon Rice (1.25 cup) + Coconut Chutney (1.25 grams) + Curd (1.25 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (1.25 bowl)",
//                         "Chicken Chettinad (1.25 cup) + Rice (1.25 cup) + Cucumber Raita (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2.5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (1.25 cup) + Pickle (1.25 tablespoon) + Papad (2.5)",
//                         "Vegetable Biryani (1.25 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (2.5)",
//                         "Egg Curry (1.25 cup) + Rice (2.5 cup) + Spinach Poriyal (1.25 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1.25) + chutney (62.5 grams) + banana (1.25)",
//                         "Idli (2.5) + Sambar (0.625 cup) + Coconut Chutney (62.5 grams)",
//                         "Upma (0.625 cup) + Curd (0.625 cup) + Papaya (1.25 slice)",
//                         "Pongal (0.625 cup) + Coconut Chutney (62.5 grams) + Orange (1.25)",
//                         "Masala Dosa (1.25) + Sambar (0.625 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.625 cup) + Papad (1.25) + Curd (0.625 cup)",
//                         "Fish Curry (0.625 cup) + Rice (1.25 cup) + Veg Poriyal (0.625 bowl)",
//                         "Lemon Rice (0.625 cup) + Coconut Chutney (62.5 grams) + Curd (0.625 cup)",
//                         "Rasam (1.25 cup) + Rice (1.25 cup) + Beetroot Thoran (0.625 bowl)",
//                         "Chicken Chettinad (0.625 cup) + Rice (0.625 cup) + Cucumber Raita (0.625 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.25) + Coconut Chutney (62.5 grams) + Tomato Chutney (62.5 grams)",
//                         "Curd Rice (0.625 cup) + Pickle (0.625 tablespoon) + Papad (1.25)",
//                         "Vegetable Biryani (0.625 cup) + Raita (1.25 cup)",
//                         "Avial (1.25 cup) + Rice (1.25 cup) + Appalam (1.25)",
//                         "Egg Curry (0.625 cup) + Rice (1.25 cup) + Spinach Poriyal (0.625 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.75 cup) + Almonds (18) + Apple (1.75)",
//                         "Greek Yogurt (1.75 cup) + Blueberries (1.25 cup)",
//                         "Scrambled Eggs (5) + Whole Wheat Toast (3.75 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.75 slice) + Poached Egg (1.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.75 cup) + Mixed Green Salad",
//                         "Salmon (1.75 fillet) + Brown Rice (1.75 cup) + Broccoli (1.75 cup)",
//                         "Vegetable Stir Fry + Tofu (1.75 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.75 fillet) + Sweet Potato (1.75) + Asparagus (1.75 cup)",
//                         "Chicken Breast (1.75) + Couscous (1.75 cup) + Green Beans (1.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.75 cup)",
//                         "Quinoa Bowl + Black Beans (1.75 cup) + Corn (1.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Boiled Egg (1.5)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1.5 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 }
//             }
//         }
//     };

//     return options[calorieCategory][type][numberOfMeals][meal].map(option => `<option value="${option}">${option}</option>`).join('');
// }

// function generatePlan(calorieOverride = null) {
//     if (calorieOverride) {
//         calorieCategory = calorieOverride;
//         updateMealOptions();
//     }

//     const meals = document.getElementById('meals').value;

//     const dietPlanDetails = document.getElementById('diet-plan-details');
//     dietPlanDetails.innerHTML = `<p>Category: ${calorieCategory} kcal</p><p>Meals: ${meals}</p>`;

//     const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
//     if (meals == 4) {
//         mealLabels.splice(1, 0, 'Snack');
//     } else if (meals == 5) {
//         mealLabels.splice(1, 0, 'Snack1');
//         mealLabels.splice(3, 0, 'Snack2');
//     }

//     mealLabels.forEach(label => {
//         let mealType = '';
//         if (activityLevel === 'sedentary') {
//             mealType = document.getElementById(`north-${label.toLowerCase()}-select`).value || document.getElementById(`south-${label.toLowerCase()}-select`).value;
//         } else {
//             mealType = document.getElementById(`active-${label.toLowerCase()}-select`).value;
//         }
//         dietPlanDetails.innerHTML += `<p>${label}: ${mealType}</p>`;
//     });

//     document.getElementById('diet-plan').classList.remove('hidden');
//     document.getElementById('explore-more').classList.remove('hidden');
// }

// function calculateCalories(height, weight, gender) {
//     return (10 * weight) + (6.25 * height) - (5 * 25) + (gender === 'male' ? 5 : -161);
// }

// document.querySelectorAll('.meal-select').forEach(select => {
//     select.addEventListener('change', (event) => {
//         const selectedMeal = event.target.id.split('-')[1]; // breakfast, lunch, dinner, snack1, snack2
//         const selectedType = event.target.id.split('-')[0]; // north, south, active
//         const value = event.target.value;

//         if (value) {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//             }
//         } else {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//             }
//         }
//     });
// });

// document.getElementById('explore-2000').addEventListener('click', () => generatePlan('2000'));
// document.getElementById('explore-2500').addEventListener('click', () => generatePlan('2500'));
// document.getElementById('explore-3000').addEventListener('click', () => generatePlan('3000'));
// document.getElementById('explore-3500').addEventListener('click', () => generatePlan('3500'));





// document.getElementById('sedentary').addEventListener('click', () => {
//     showForm('sedentary');
// });

// document.getElementById('active').addEventListener('click', () => {
//     showForm('active');
// });

// document.querySelectorAll('#height, #weight, #gender, #meals').forEach(input => {
//     input.addEventListener('input', () => {
//         if (isFormFilled()) {
//             calculateAndShowMeals();
//         }
//     });
// });

// document.getElementById('diet-form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     generatePlan();
// });

// let activityLevel = '';
// let maintenanceCalories = 0;
// let calorieCategory = '2000';

// function showForm(level) {
//     activityLevel = level;
//     document.getElementById('form-container').classList.remove('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
// }

// function isFormFilled() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;
//     const meals = document.getElementById('meals').value;
//     return height && weight && gender && meals;
// }

// function calculateAndShowMeals() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;

//     maintenanceCalories = calculateCalories(height, weight, gender);
//     if (maintenanceCalories < 2000) {
//         maintenanceCalories = 2000;
//     } else if (maintenanceCalories > 3500) {
//         maintenanceCalories = 3500;
//     }

//     if (maintenanceCalories > 3200) {
//         calorieCategory = '3500';
//     } else if (maintenanceCalories > 2700) {
//         calorieCategory = '3000';
//     } else if (maintenanceCalories > 2200) {
//         calorieCategory = '2500';
//     } else {
//         calorieCategory = '2000';
//     }

//     updateMealOptions();
//     document.getElementById('meal-options').classList.remove('hidden');
// }

// function updateMealOptions() {
//     const northBreakfastSelect = document.getElementById('north-breakfast-select');
//     const northSnack1Select = document.getElementById('north-snack1-select');
//     const northLunchSelect = document.getElementById('north-lunch-select');
//     const northSnack2Select = document.getElementById('north-snack2-select');
//     const northDinnerSelect = document.getElementById('north-dinner-select');

//     const southBreakfastSelect = document.getElementById('south-breakfast-select');
//     const southSnack1Select = document.getElementById('south-snack1-select');
//     const southLunchSelect = document.getElementById('south-lunch-select');
//     const southSnack2Select = document.getElementById('south-snack2-select');
//     const southDinnerSelect = document.getElementById('south-dinner-select');

//     const activeBreakfastSelect = document.getElementById('active-breakfast-select');
//     const activeSnack1Select = document.getElementById('active-snack1-select');
//     const activeLunchSelect = document.getElementById('active-lunch-select');
//     const activeSnack2Select = document.getElementById('active-snack2-select');
//     const activeDinnerSelect = document.getElementById('active-dinner-select');

//     const numberOfMeals = document.getElementById('meals').value;

//     if (activityLevel === 'sedentary') {
//         document.getElementById('north-indian').classList.remove('hidden');
//         document.getElementById('south-indian').classList.remove('hidden');

//         northBreakfastSelect.innerHTML = getOptions('north', 'breakfast', numberOfMeals);
//         northSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('north', 'snack1', numberOfMeals) : '';
//         northLunchSelect.innerHTML = getOptions('north', 'lunch', numberOfMeals);
//         northSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('north', 'snack2', numberOfMeals) : '';
//         northDinnerSelect.innerHTML = getOptions('north', 'dinner', numberOfMeals);

//         southBreakfastSelect.innerHTML = getOptions('south', 'breakfast', numberOfMeals);
//         southSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('south', 'snack1', numberOfMeals) : '';
//         southLunchSelect.innerHTML = getOptions('south', 'lunch', numberOfMeals);
//         southSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('south', 'snack2', numberOfMeals) : '';
//         southDinnerSelect.innerHTML = getOptions('south', 'dinner', numberOfMeals);

//         toggleVisibility(northSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(northSnack2Select, numberOfMeals == 5);
//         toggleVisibility(southSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(southSnack2Select, numberOfMeals == 5);
//     } else {
//         document.getElementById('active-meals').classList.remove('hidden');

//         activeBreakfastSelect.innerHTML = getOptions('active', 'breakfast', numberOfMeals);
//         activeSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('active', 'snack1', numberOfMeals) : '';
//         activeLunchSelect.innerHTML = getOptions('active', 'lunch', numberOfMeals);
//         activeSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('active', 'snack2', numberOfMeals) : '';
//         activeDinnerSelect.innerHTML = getOptions('active', 'dinner', numberOfMeals);

//         toggleVisibility(activeSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(activeSnack2Select, numberOfMeals == 5);
//     }
// }

// function toggleVisibility(element, isVisible) {
//     if (isVisible) {
//         element.classList.remove('hidden');
//         element.previousElementSibling.classList.remove('hidden');
//     } else {
//         element.classList.add('hidden');
//         element.previousElementSibling.classList.add('hidden');
//     }
// }

// function getOptions(type, meal, numberOfMeals) {
//     const options = {
//         '2000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (1/2 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/2 cup) + Bhature (1) + Salad (1/2 bowl)",
//                         "Paneer Tikka (100 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1/2 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/2 cup) + Naan (1)",
//                         "Aloo Gobhi (1/2 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/2 cup) + Rice (1/2 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1/2 cup) + Tandoori Roti (1)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/2 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/2 cup) + Chapati (1)",
//                         "Chicken Tikka (100 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/2 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/2 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1/2) + Curd (1/3 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/3 cup) + Bhature (1) + Salad (1/3 bowl)",
//                         "Paneer Tikka (50 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1/2 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1/2 cup) + Naan (1) + Carrot Halwa (1/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/3 cup) + Naan (1)",
//                         "Aloo Gobhi (1/3 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/3 cup) + Rice (1/3 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1/2 cup)",
//                         "Mutton Rogan Josh (1/3 cup) + Tandoori Roti (1)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/3 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/3 cup) + Chapati (1)",
//                         "Chicken Tikka (70 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/3 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/3 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (1)",
//                         "Idli (3) + Sambar (1 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (1 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (1 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (50 grams) + banana (1)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1/2 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (25 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (25 grams) + banana (1)",
//                         "Idli (1) + Sambar (1/3 cup) + Coconut Chutney (25 grams)",
//                         "Upma (1/3 cup) + Curd (1/3 cup) + Papaya (1 slice)",
//                         "Pongal (1/3 cup) + Coconut Chutney (25 grams) + Orange (1/2)",
//                         "Masala Dosa (1) + Sambar (1/3 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/3 cup) + Papad (1) + Curd (1/3 cup)",
//                         "Fish Curry (1/3 cup) + Rice (1/2 cup) + Veg Poriyal (1/3 bowl)",
//                         "Lemon Rice (1/3 cup) + Coconut Chutney (25 grams) + Curd (1/3 cup)",
//                         "Rasam (1 cup) + Rice (1/2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/3 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (25 grams) + Tomato Chutney (25 grams)",
//                         "Curd Rice (1/3 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/3 cup) + Raita (1 cup)",
//                         "Avial (1/2 cup) + Rice (1/2 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1/2 cup) + Spinach Poriyal (1/2 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (1/2 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Poached Egg (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (3/4 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (3/4 cup) + Blueberries (1/3 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (3/4 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (3/4 cup) + Mixed Green Salad",
//                         "Salmon (3/4 fillet) + Brown Rice (3/4 cup) + Broccoli (3/4 cup)",
//                         "Vegetable Stir Fry + Tofu (3/4 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (3/4 fillet) + Sweet Potato (3/4) + Asparagus (3/4 cup)",
//                         "Chicken Breast (3/4) + Couscous (3/4 cup) + Green Beans (3/4 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (3/4 cup)",
//                         "Quinoa Bowl + Black Beans (3/4 cup) + Corn (3/4 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1/2 cup) + Almonds (5) + Apple (1/2)",
//                         "Greek Yogurt (1/2 cup) + Blueberries (1/4 cup)",
//                         "Scrambled Eggs (1) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1/2 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1/2 cup) + Mixed Green Salad",
//                         "Salmon (1/2 fillet) + Brown Rice (1/2 cup) + Broccoli (1/2 cup)",
//                         "Vegetable Stir Fry + Tofu (1/2 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1/2 fillet) + Sweet Potato (1/2) + Asparagus (1/2 cup)",
//                         "Chicken Breast (1/2) + Couscous (1/2 cup) + Green Beans (1/2 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1/2 cup)",
//                         "Quinoa Bowl + Black Beans (1/2 cup) + Corn (1/2 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1)"
//                     ]
//                 }
//             }
//         },

//         '2500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (3) + Curd (1.5 cup) + Mango Pickle (1.5 tablespoon)",
//                         "Chole (1.5 cup) + Bhature (3) + Salad (1.5 bowl)",
//                         "Paneer Tikka (300 grams) + Green Chutney (3 tablespoons) + Mixed Veg Raita (1.5 cup)",
//                         "Rajma (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Dal Makhani (1.5 cup) + Naan (1.5) + Carrot Halwa (1.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.5 cup) + Naan (3)",
//                         "Aloo Gobhi (1.5 cup) + Chapati (3) + Boondi Raita (1.5 cup)",
//                         "Chicken Curry (1.5 cup) + Rice (1.5 cup) + Mixed Vegetable Salad (1.5 bowl)",
//                         "Palak Paneer (1.5 cup) + Jeera Rice (1.5 cup)",
//                         "Mutton Rogan Josh (1.5 cup) + Tandoori Roti (3)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.5 cup) + Rice (1.5 cup) + Cucumber Salad (1.5 bowl)",
//                         "Baingan Bharta (1.5 cup) + Chapati (3)",
//                         "Chicken Tikka (300 grams) + Mint Chutney (3 tablespoons) + Salad (1.5 bowl)",
//                         "Paneer Bhurji (1.5 cup) + Paratha (3)",
//                         "Kadhai Paneer (1.5 cup) + Jeera Rice (1.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1.5) + Curd (0.75 cup) + Mango Pickle (0.75 tablespoon)",
//                         "Chole (0.75 cup) + Bhature (1.5) + Salad (0.75 bowl)",
//                         "Paneer Tikka (150 grams) + Green Chutney (1.5 tablespoons) + Mixed Veg Raita (0.75 cup)",
//                         "Rajma (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Dal Makhani (0.75 cup) + Naan (0.75) + Carrot Halwa (0.75 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.75 cup) + Naan (1.5)",
//                         "Aloo Gobhi (0.75 cup) + Chapati (1.5) + Boondi Raita (0.75 cup)",
//                         "Chicken Curry (0.75 cup) + Rice (0.75 cup) + Mixed Vegetable Salad (0.75 bowl)",
//                         "Palak Paneer (0.75 cup) + Jeera Rice (0.75 cup)",
//                         "Mutton Rogan Josh (0.75 cup) + Tandoori Roti (1.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.75 cup) + Rice (0.75 cup) + Cucumber Salad (0.75 bowl)",
//                         "Baingan Bharta (0.75 cup) + Chapati (1.5)",
//                         "Chicken Tikka (150 grams) + Mint Chutney (1.5 tablespoons) + Salad (0.75 bowl)",
//                         "Paneer Bhurji (0.75 cup) + Paratha (1.5)",
//                         "Kadhai Paneer (0.75 cup) + Jeera Rice (0.75 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (0.75) + Curd (0.375 cup) + Mango Pickle (0.375 tablespoon)",
//                         "Chole (0.375 cup) + Bhature (0.75) + Salad (0.375 bowl)",
//                         "Paneer Tikka (75 grams) + Green Chutney (0.75 tablespoons) + Mixed Veg Raita (0.375 cup)",
//                         "Rajma (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Dal Makhani (0.375 cup) + Naan (0.75) + Carrot Halwa (0.375 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.375 cup) + Naan (0.75)",
//                         "Aloo Gobhi (0.375 cup) + Chapati (0.75) + Boondi Raita (0.375 cup)",
//                         "Chicken Curry (0.375 cup) + Rice (0.375 cup) + Mixed Vegetable Salad (0.375 bowl)",
//                         "Palak Paneer (0.375 cup) + Jeera Rice (0.375 cup)",
//                         "Mutton Rogan Josh (0.375 cup) + Tandoori Roti (0.75)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.375 cup) + Rice (0.375 cup) + Cucumber Salad (0.375 bowl)",
//                         "Baingan Bharta (0.375 cup) + Chapati (0.75)",
//                         "Chicken Tikka (75 grams) + Mint Chutney (0.75 tablespoons) + Salad (0.375 bowl)",
//                         "Paneer Bhurji (0.375 cup) + Paratha (0.75)",
//                         "Kadhai Paneer (0.375 cup) + Jeera Rice (0.375 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (3) + chutney (75 grams) + banana (1.5)",
//                         "Idli (4.5) + Sambar (1.5 cup) + Coconut Chutney (75 grams)",
//                         "Upma (1.5 cup) + Curd (1.5 cup) + Papaya (1.5 slice)",
//                         "Pongal (1.5 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (1.5 cup) + Mango (1.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.5 cup) + Papad (3) + Curd (1.5 cup)",
//                         "Fish Curry (1.5 cup) + Rice (1.5 cup) + Veg Poriyal (1.5 bowl)",
//                         "Lemon Rice (1.5 cup) + Coconut Chutney (75 grams) + Curd (1.5 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (1.5 bowl)",
//                         "Chicken Chettinad (1.5 cup) + Rice (1.5 cup) + Cucumber Raita (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (3) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (1.5 cup) + Pickle (1.5 tablespoon) + Papad (3)",
//                         "Vegetable Biryani (1.5 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (3)",
//                         "Egg Curry (1.5 cup) + Rice (1.5 cup) + Spinach Poriyal (1.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1.5) + chutney (75 grams) + banana (1.5)",
//                         "Idli (3) + Sambar (0.75 cup) + Coconut Chutney (75 grams)",
//                         "Upma (0.75 cup) + Curd (0.75 cup) + Papaya (1.5 slice)",
//                         "Pongal (0.75 cup) + Coconut Chutney (75 grams) + Orange (1.5)",
//                         "Masala Dosa (1.5) + Sambar (0.75 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.75 cup) + Papad (1.5) + Curd (0.75 cup)",
//                         "Fish Curry (0.75 cup) + Rice (1.5 cup) + Veg Poriyal (0.75 bowl)",
//                         "Lemon Rice (0.75 cup) + Coconut Chutney (0.375 grams) + Curd (0.75 cup)",
//                         "Rasam (1.5 cup) + Rice (1.5 cup) + Beetroot Thoran (0.75 bowl)",
//                         "Chicken Chettinad (0.75 cup) + Rice (0.75 cup) + Cucumber Raita (0.75 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.5) + Coconut Chutney (75 grams) + Tomato Chutney (75 grams)",
//                         "Curd Rice (0.75 cup) + Pickle (0.75 tablespoon) + Papad (1.5)",
//                         "Vegetable Biryani (0.75 cup) + Raita (1.5 cup)",
//                         "Avial (1.5 cup) + Rice (1.5 cup) + Appalam (1.5)",
//                         "Egg Curry (0.75 cup) + Rice (1.5 cup) + Spinach Poriyal (0.75 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (0.75) + chutney (37.5 grams) + banana (1.5)",
//                         "Idli (1.5) + Sambar (0.375 cup) + Coconut Chutney (37.5 grams)",
//                         "Upma (0.375 cup) + Curd (0.375 cup) + Papaya (0.75 slice)",
//                         "Pongal (0.375 cup) + Coconut Chutney (37.5 grams) + Orange (0.75)",
//                         "Masala Dosa (0.75) + Sambar (0.375 cup) + Mango (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.375 cup) + Papad (0.75) + Curd (0.375 cup)",
//                         "Fish Curry (0.375 cup) + Rice (0.75 cup) + Veg Poriyal (0.375 bowl)",
//                         "Lemon Rice (0.375 cup) + Coconut Chutney (37.5 grams) + Curd (0.375 cup)",
//                         "Rasam (0.75 cup) + Rice (0.75 cup) + Beetroot Thoran (0.375 bowl)",
//                         "Chicken Chettinad (0.375 cup) + Rice (0.375 cup) + Cucumber Raita (0.375 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.375 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.75)",
//                         "Granola Bar (0.75) + Orange (0.75)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (0.75) + Coconut Chutney (37.5 grams) + Tomato Chutney (37.5 grams)",
//                         "Curd Rice (0.375 cup) + Pickle (0.375 tablespoon) + Papad (0.75)",
//                         "Vegetable Biryani (0.375 cup) + Raita (0.75 cup)",
//                         "Avial (0.75 cup) + Rice (0.75 cup) + Appalam (0.75)",
//                         "Egg Curry (0.375 cup) + Rice (0.75 cup) + Spinach Poriyal (0.375 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.5) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Poached Egg (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3.5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.75 cup)",
//                         "Mixed Nuts (0.75/4 cup) + Apple (1)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2.5)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (0.75 cup) + Almonds (7) + Apple (0.75)",
//                         "Greek Yogurt (0.75 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (0.75 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (0.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (0.75 cup) + Mixed Green Salad",
//                         "Salmon (0.75 fillet) + Brown Rice (0.75 cup) + Broccoli (0.75 cup)",
//                         "Vegetable Stir Fry + Tofu (0.75 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (0.75 cup) + Yogurt (0.5 cup)",
//                         "Mixed Nuts (0.75/8 cup) + Apple (0.5)",
//                         "Granola Bar (0.75) + Orange (0.5)",
//                         "Vegetable Sticks (0.75 cup) + Hummus (0.75/4 cup)",
//                         "Smoothie (0.75 cup) + Banana (0.75)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (0.75 fillet) + Sweet Potato (0.75) + Asparagus (0.75 cup)",
//                         "Chicken Breast (0.75) + Couscous (0.75 cup) + Green Beans (0.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (0.75 cup)",
//                         "Quinoa Bowl + Black Beans (0.75 cup) + Corn (0.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1.5)"
//                     ]
//                 }
//             }
//         },

//         '3000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (4) + Curd (2 cup) + Mango Pickle (2 tablespoon)",
//                         "Chole (2 cup) + Bhature (4) + Salad (2 bowl)",
//                         "Paneer Tikka (400 grams) + Green Chutney (4 tablespoons) + Mixed Veg Raita (2 cup)",
//                         "Rajma (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Dal Makhani (2 cup) + Naan (2) + Carrot Halwa (2 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2 cup) + Naan (4)",
//                         "Aloo Gobhi (2 cup) + Chapati (4) + Boondi Raita (2 cup)",
//                         "Chicken Curry (2 cup) + Rice (2 cup) + Mixed Vegetable Salad (2 bowl)",
//                         "Palak Paneer (2 cup) + Jeera Rice (2 cup)",
//                         "Mutton Rogan Josh (2 cup) + Tandoori Roti (4)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2 cup) + Rice (2 cup) + Cucumber Salad (2 bowl)",
//                         "Baingan Bharta (2 cup) + Chapati (4)",
//                         "Chicken Tikka (400 grams) + Mint Chutney (4 tablespoons) + Salad (2 bowl)",
//                         "Paneer Bhurji (2 cup) + Paratha (4)",
//                         "Kadhai Paneer (2 cup) + Jeera Rice (2 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (2/3 cup) + Mango Pickle (2/3 tablespoon)",
//                         "Chole (2/3 cup) + Bhature (1.5) + Salad (2/3 bowl)",
//                         "Paneer Tikka (133 grams) + Green Chutney (2/3 tablespoons) + Mixed Veg Raita (2/3 cup)",
//                         "Rajma (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Dal Makhani (2/3 cup) + Naan (1.5) + Carrot Halwa (2/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2/3 cup) + Naan (1.25)",
//                         "Aloo Gobhi (2/3 cup) + Chapati (1.25) + Boondi Raita (2/3 cup)",
//                         "Chicken Curry (2/3 cup) + Rice (2/3 cup) + Mixed Vegetable Salad (2/3 bowl)",
//                         "Palak Paneer (2/3 cup) + Jeera Rice (2/3 cup)",
//                         "Mutton Rogan Josh (2/3 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (2/3 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2/3 cup) + Rice (2/3 cup) + Cucumber Salad (2/3 bowl)",
//                         "Baingan Bharta (2/3 cup) + Chapati (1.25)",
//                         "Chicken Tikka (133 grams) + Mint Chutney (2/3 tablespoons) + Salad (2/3 bowl)",
//                         "Paneer Bhurji (2/3 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (2/3 cup) + Jeera Rice (2/3 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (4) + chutney (100 grams) + banana (2)",
//                         "Idli (6) + Sambar (2 cup) + Coconut Chutney (100 grams)",
//                         "Upma (2 cup) + Curd (2 cup) + Papaya (2 slice)",
//                         "Pongal (2 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (2 cup) + Mango (2 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2 cup) + Papad (4) + Curd (2 cup)",
//                         "Fish Curry (2 cup) + Rice (2 cup) + Veg Poriyal (2 bowl)",
//                         "Lemon Rice (2 cup) + Coconut Chutney (100 grams) + Curd (2 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (2 bowl)",
//                         "Chicken Chettinad (2 cup) + Rice (2 cup) + Cucumber Raita (2 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (4) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (2 cup) + Pickle (2 tablespoon) + Papad (4)",
//                         "Vegetable Biryani (2 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (4)",
//                         "Egg Curry (2 cup) + Rice (2 cup) + Spinach Poriyal (2 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (100 grams) + banana (2)",
//                         "Idli (4) + Sambar (1 cup) + Coconut Chutney (100 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (2 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (100 grams) + Orange (2)",
//                         "Masala Dosa (2) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (2 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (2 cup) + Rice (2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (100 grams) + Tomato Chutney (100 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (2 cup)",
//                         "Avial (2 cup) + Rice (2 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (2 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (2)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (2) + Sambar (1/2 cup) + Mango (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (50 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Poached Egg (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3.25) + Whole Wheat Toast (2.25 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice) + Boiled Egg (1.25)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/4 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (0.5 cup)",
//                         "Scrambled Eggs (2.5) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 }
//             }
//         },

        
//         '3500': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (5) + Curd (2.5 cup) + Mango Pickle (2.5 tablespoon)",
//                         "Chole (2.5 cup) + Bhature (5) + Salad (2.5 bowl)",
//                         "Paneer Tikka (500 grams) + Green Chutney (5 tablespoons) + Mixed Veg Raita (2.5 cup)",
//                         "Rajma (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Dal Makhani (2.5 cup) + Naan (2.5) + Carrot Halwa (2.5 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (2.5 cup) + Naan (5)",
//                         "Aloo Gobhi (2.5 cup) + Chapati (5) + Boondi Raita (2.5 cup)",
//                         "Chicken Curry (2.5 cup) + Rice (2.5 cup) + Mixed Vegetable Salad (2.5 bowl)",
//                         "Palak Paneer (2.5 cup) + Jeera Rice (2.5 cup)",
//                         "Mutton Rogan Josh (2.5 cup) + Tandoori Roti (5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (2.5 cup) + Rice (2.5 cup) + Cucumber Salad (2.5 bowl)",
//                         "Baingan Bharta (2.5 cup) + Chapati (5)",
//                         "Chicken Tikka (500 grams) + Mint Chutney (5 tablespoons) + Salad (2.5 bowl)",
//                         "Paneer Bhurji (2.5 cup) + Paratha (5)",
//                         "Kadhai Paneer (2.5 cup) + Jeera Rice (2.5 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (2.5) + Curd (1.25 cup) + Mango Pickle (1.25 tablespoon)",
//                         "Chole (1.25 cup) + Bhature (2.5) + Salad (1.25 bowl)",
//                         "Paneer Tikka (250 grams) + Green Chutney (2.5 tablespoons) + Mixed Veg Raita (1.25 cup)",
//                         "Rajma (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Dal Makhani (1.25 cup) + Naan (1.25) + Carrot Halwa (1.25 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1.25 cup) + Naan (2.5)",
//                         "Aloo Gobhi (1.25 cup) + Chapati (2.5) + Boondi Raita (1.25 cup)",
//                         "Chicken Curry (1.25 cup) + Rice (1.25 cup) + Mixed Vegetable Salad (1.25 bowl)",
//                         "Palak Paneer (1.25 cup) + Jeera Rice (1.25 cup)",
//                         "Mutton Rogan Josh (1.25 cup) + Tandoori Roti (2.5)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1.25 cup) + Rice (1.25 cup) + Cucumber Salad (1.25 bowl)",
//                         "Baingan Bharta (1.25 cup) + Chapati (2.5)",
//                         "Chicken Tikka (250 grams) + Mint Chutney (2.5 tablespoons) + Salad (1.25 bowl)",
//                         "Paneer Bhurji (1.25 cup) + Paratha (2.5)",
//                         "Kadhai Paneer (1.25 cup) + Jeera Rice (1.25 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1.25) + Curd (0.625 cup) + Mango Pickle (0.625 tablespoon)",
//                         "Chole (0.625 cup) + Bhature (1.25) + Salad (0.625 bowl)",
//                         "Paneer Tikka (125 grams) + Green Chutney (0.625 tablespoons) + Mixed Veg Raita (0.625 cup)",
//                         "Rajma (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Dal Makhani (0.625 cup) + Naan (1.25) + Carrot Halwa (0.625 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (0.625 cup) + Naan (1.25)",
//                         "Aloo Gobhi (0.625 cup) + Chapati (1.25) + Boondi Raita (0.625 cup)",
//                         "Chicken Curry (0.625 cup) + Rice (0.625 cup) + Mixed Vegetable Salad (0.625 bowl)",
//                         "Palak Paneer (0.625 cup) + Jeera Rice (0.625 cup)",
//                         "Mutton Rogan Josh (0.625 cup) + Tandoori Roti (1.25)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (0.625 cup) + Rice (0.625 cup) + Cucumber Salad (0.625 bowl)",
//                         "Baingan Bharta (0.625 cup) + Chapati (1.25)",
//                         "Chicken Tikka (125 grams) + Mint Chutney (0.625 tablespoons) + Salad (0.625 bowl)",
//                         "Paneer Bhurji (0.625 cup) + Paratha (1.25)",
//                         "Kadhai Paneer (0.625 cup) + Jeera Rice (0.625 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (7.5) + Sambar (2.5 cup) + Coconut Chutney (125 grams)",
//                         "Upma (2.5 cup) + Curd (2.5 cup) + Papaya (2.5 slice)",
//                         "Pongal (2.5 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (2.5 cup) + Mango (2.5 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (2.5 cup) + Papad (5) + Curd (2.5 cup)",
//                         "Fish Curry (2.5 cup) + Rice (2.5 cup) + Veg Poriyal (2.5 bowl)",
//                         "Lemon Rice (2.5 cup) + Coconut Chutney (125 grams) + Curd (2.5 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (2.5 bowl)",
//                         "Chicken Chettinad (2.5 cup) + Rice (2.5 cup) + Cucumber Raita (2.5 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (2.5 cup) + Pickle (2.5 tablespoon) + Papad (5)",
//                         "Vegetable Biryani (2.5 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (5)",
//                         "Egg Curry (2.5 cup) + Rice (2.5 cup) + Spinach Poriyal (2.5 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (2.5) + chutney (125 grams) + banana (2.5)",
//                         "Idli (5) + Sambar (1.25 cup) + Coconut Chutney (125 grams)",
//                         "Upma (1.25 cup) + Curd (1.25 cup) + Papaya (2.5 slice)",
//                         "Pongal (1.25 cup) + Coconut Chutney (125 grams) + Orange (2.5)",
//                         "Masala Dosa (2.5) + Sambar (1.25 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2.5 cup) + Yogurt (1.25 cup)",
//                         "Mixed Nuts (2.5/4 cup) + Apple (2.5)",
//                         "Granola Bar (2.5) + Orange (2.5)",
//                         "Vegetable Sticks (2.5 cup) + Hummus (2.5/4 cup)",
//                         "Smoothie (2.5 cup) + Banana (2.5)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1.25 cup) + Papad (2.5) + Curd (1.25 cup)",
//                         "Fish Curry (1.25 cup) + Rice (2.5 cup) + Veg Poriyal (1.25 bowl)",
//                         "Lemon Rice (1.25 cup) + Coconut Chutney (1.25 grams) + Curd (1.25 cup)",
//                         "Rasam (2.5 cup) + Rice (2.5 cup) + Beetroot Thoran (1.25 bowl)",
//                         "Chicken Chettinad (1.25 cup) + Rice (1.25 cup) + Cucumber Raita (1.25 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2.5) + Coconut Chutney (125 grams) + Tomato Chutney (125 grams)",
//                         "Curd Rice (1.25 cup) + Pickle (1.25 tablespoon) + Papad (2.5)",
//                         "Vegetable Biryani (1.25 cup) + Raita (2.5 cup)",
//                         "Avial (2.5 cup) + Rice (2.5 cup) + Appalam (2.5)",
//                         "Egg Curry (1.25 cup) + Rice (2.5 cup) + Spinach Poriyal (1.25 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1.25) + chutney (62.5 grams) + banana (1.25)",
//                         "Idli (2.5) + Sambar (0.625 cup) + Coconut Chutney (62.5 grams)",
//                         "Upma (0.625 cup) + Curd (0.625 cup) + Papaya (1.25 slice)",
//                         "Pongal (0.625 cup) + Coconut Chutney (62.5 grams) + Orange (1.25)",
//                         "Masala Dosa (1.25) + Sambar (0.625 cup) + Mango (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (0.625 cup) + Papad (1.25) + Curd (0.625 cup)",
//                         "Fish Curry (0.625 cup) + Rice (1.25 cup) + Veg Poriyal (0.625 bowl)",
//                         "Lemon Rice (0.625 cup) + Coconut Chutney (62.5 grams) + Curd (0.625 cup)",
//                         "Rasam (1.25 cup) + Rice (1.25 cup) + Beetroot Thoran (0.625 bowl)",
//                         "Chicken Chettinad (0.625 cup) + Rice (0.625 cup) + Cucumber Raita (0.625 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.25 cup) + Yogurt (0.625 cup)",
//                         "Mixed Nuts (1.25/8 cup) + Apple (1.25)",
//                         "Granola Bar (1.25) + Orange (1.25)",
//                         "Vegetable Sticks (1.25 cup) + Hummus (1.25/4 cup)",
//                         "Smoothie (1.25 cup) + Banana (1.25)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1.25) + Coconut Chutney (62.5 grams) + Tomato Chutney (62.5 grams)",
//                         "Curd Rice (0.625 cup) + Pickle (0.625 tablespoon) + Papad (1.25)",
//                         "Vegetable Biryani (0.625 cup) + Raita (1.25 cup)",
//                         "Avial (1.25 cup) + Rice (1.25 cup) + Appalam (1.25)",
//                         "Egg Curry (0.625 cup) + Rice (1.25 cup) + Spinach Poriyal (0.625 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1.75 cup) + Almonds (18) + Apple (1.75)",
//                         "Greek Yogurt (1.75 cup) + Blueberries (1.25 cup)",
//                         "Scrambled Eggs (5) + Whole Wheat Toast (3.75 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.75 slice) + Poached Egg (1.75)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.75 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1.75 cup) + Mixed Green Salad",
//                         "Salmon (1.75 fillet) + Brown Rice (1.75 cup) + Broccoli (1.75 cup)",
//                         "Vegetable Stir Fry + Tofu (1.75 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.75 fillet) + Sweet Potato (1.75) + Asparagus (1.75 cup)",
//                         "Chicken Breast (1.75) + Couscous (1.75 cup) + Green Beans (1.75 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.75 cup)",
//                         "Quinoa Bowl + Black Beans (1.75 cup) + Corn (1.75 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (5)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (1.5 cup) + Almonds (15) + Apple (1.5)",
//                         "Greek Yogurt (1.5 cup) + Blueberries (1 cup)",
//                         "Scrambled Eggs (4) + Whole Wheat Toast (3 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.5 slice) + Boiled Egg (1.5)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (2 cup) + Yogurt (1.5 cup)",
//                         "Mixed Nuts (2/4 cup) + Apple (2)",
//                         "Granola Bar (2) + Orange (2)",
//                         "Vegetable Sticks (2 cup) + Hummus (2/4 cup)",
//                         "Smoothie (2 cup) + Banana (2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.5 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (1.5 cup) + Mixed Green Salad",
//                         "Salmon (1.5 fillet) + Brown Rice (1.5 cup) + Broccoli (1.5 cup)",
//                         "Vegetable Stir Fry + Tofu (1.5 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.5 fillet) + Sweet Potato (1.5) + Asparagus (1.5 cup)",
//                         "Chicken Breast (1.5) + Couscous (1.5 cup) + Green Beans (1.5 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.5 cup)",
//                         "Quinoa Bowl + Black Beans (1.5 cup) + Corn (1.5 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (4)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1.25 cup) + Almonds (12) + Apple (1.25)",
//                         "Greek Yogurt (1.25 cup) + Blueberries (0.75 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2.5 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1.25 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1.25 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1.25 cup) + Mixed Green Salad",
//                         "Salmon (1.25 fillet) + Brown Rice (1.25 cup) + Broccoli (1.25 cup)",
//                         "Vegetable Stir Fry + Tofu (1.25 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1.5 cup) + Yogurt (1 cup)",
//                         "Mixed Nuts (1.5/8 cup) + Apple (1.5)",
//                         "Granola Bar (1.5) + Orange (1.5)",
//                         "Vegetable Sticks (1.5 cup) + Hummus (1.5/4 cup)",
//                         "Smoothie (1.5 cup) + Banana (1.5)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1.25 fillet) + Sweet Potato (1.25) + Asparagus (1.25 cup)",
//                         "Chicken Breast (1.25) + Couscous (1.25 cup) + Green Beans (1.25 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1.25 cup)",
//                         "Quinoa Bowl + Black Beans (1.25 cup) + Corn (1.25 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 }
//             }
//         }


//         // Add more calorie categories and meal options based on the provided document
//     };

//     return options[calorieCategory][type][numberOfMeals][meal].map(option => `<option value="${option}">${option}</option>`).join('');
// }

// function generatePlan() {
//     const meals = document.getElementById('meals').value;

//     const dietPlanDetails = document.getElementById('diet-plan-details');
//     dietPlanDetails.innerHTML = `<p>Category: ${calorieCategory} kcal</p><p>Meals: ${meals}</p>`;

//     const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
//     if (meals == 4) {
//         mealLabels.splice(1, 0, 'Snack');
//     } else if (meals == 5) {
//         mealLabels.splice(1, 0, 'Snack1');
//         mealLabels.splice(3, 0, 'Snack2');
//     }

//     mealLabels.forEach(label => {
//         let mealType = '';
//         if (activityLevel === 'sedentary') {
//             mealType = document.getElementById(`north-${label.toLowerCase()}-select`).value || document.getElementById(`south-${label.toLowerCase()}-select`).value;
//         } else {
//             mealType = document.getElementById(`active-${label.toLowerCase()}-select`).value;
//         }
//         dietPlanDetails.innerHTML += `<p>${label}: ${mealType}</p>`;
//     });

//     document.getElementById('diet-plan').classList.remove('hidden');
// }

// function calculateCalories(height, weight, gender) {
//     return (10 * weight) + (6.25 * height) - (5 * 25) + (gender === 'male' ? 5 : -161);
// }

// document.querySelectorAll('.meal-select').forEach(select => {
//     select.addEventListener('change', (event) => {
//         const selectedMeal = event.target.id.split('-')[1]; // breakfast, lunch, dinner, snack1, snack2
//         const selectedType = event.target.id.split('-')[0]; // north, south, active
//         const value = event.target.value;

//         if (value) {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//             }
//         } else {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//             }
//         }
//     });
// });




// document.getElementById('sedentary').addEventListener('click', () => {
//     showForm('sedentary');
// });

// document.getElementById('active').addEventListener('click', () => {
//     showForm('active');
// });

// document.querySelectorAll('#height, #weight, #gender, #meals').forEach(input => {
//     input.addEventListener('input', () => {
//         if (isFormFilled()) {
//             calculateAndShowMeals();
//         }
//     });
// });

// document.getElementById('diet-form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     generatePlan();
// });

// let activityLevel = '';
// let maintenanceCalories = 0;
// let calorieCategory = '2000';

// function showForm(level) {
//     activityLevel = level;
//     document.getElementById('form-container').classList.remove('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
// }

// function isFormFilled() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;
//     const meals = document.getElementById('meals').value;
//     return height && weight && gender && meals;
// }

// function calculateAndShowMeals() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;

//     maintenanceCalories = calculateCalories(height, weight, gender);
//     if (maintenanceCalories < 2000) {
//         maintenanceCalories = 2000;
//     } else if (maintenanceCalories > 3500) {
//         maintenanceCalories = 3500;
//     }

//     if (maintenanceCalories > 3200) {
//         calorieCategory = '3500';
//     } else if (maintenanceCalories > 2700) {
//         calorieCategory = '3000';
//     } else if (maintenanceCalories > 2200) {
//         calorieCategory = '2500';
//     } else {
//         calorieCategory = '2000';
//     }

//     updateMealOptions();
//     document.getElementById('meal-options').classList.remove('hidden');
// }

// function updateMealOptions() {
//     const northBreakfastSelect = document.getElementById('north-breakfast-select');
//     const northSnack1Select = document.getElementById('north-snack1-select');
//     const northLunchSelect = document.getElementById('north-lunch-select');
//     const northSnack2Select = document.getElementById('north-snack2-select');
//     const northDinnerSelect = document.getElementById('north-dinner-select');

//     const southBreakfastSelect = document.getElementById('south-breakfast-select');
//     const southSnack1Select = document.getElementById('south-snack1-select');
//     const southLunchSelect = document.getElementById('south-lunch-select');
//     const southSnack2Select = document.getElementById('south-snack2-select');
//     const southDinnerSelect = document.getElementById('south-dinner-select');

//     const activeBreakfastSelect = document.getElementById('active-breakfast-select');
//     const activeSnack1Select = document.getElementById('active-snack1-select');
//     const activeLunchSelect = document.getElementById('active-lunch-select');
//     const activeSnack2Select = document.getElementById('active-snack2-select');
//     const activeDinnerSelect = document.getElementById('active-dinner-select');

//     const numberOfMeals = document.getElementById('meals').value;

//     if (activityLevel === 'sedentary') {
//         document.getElementById('north-indian').classList.remove('hidden');
//         document.getElementById('south-indian').classList.remove('hidden');

//         northBreakfastSelect.innerHTML = getOptions('north', 'breakfast', numberOfMeals);
//         northSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('north', 'snack1', numberOfMeals) : '';
//         northLunchSelect.innerHTML = getOptions('north', 'lunch', numberOfMeals);
//         northSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('north', 'snack2', numberOfMeals) : '';
//         northDinnerSelect.innerHTML = getOptions('north', 'dinner', numberOfMeals);

//         southBreakfastSelect.innerHTML = getOptions('south', 'breakfast', numberOfMeals);
//         southSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('south', 'snack1', numberOfMeals) : '';
//         southLunchSelect.innerHTML = getOptions('south', 'lunch', numberOfMeals);
//         southSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('south', 'snack2', numberOfMeals) : '';
//         southDinnerSelect.innerHTML = getOptions('south', 'dinner', numberOfMeals);

//         toggleVisibility(northSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(northSnack2Select, numberOfMeals == 5);
//         toggleVisibility(southSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(southSnack2Select, numberOfMeals == 5);
//     } else {
//         document.getElementById('active-meals').classList.remove('hidden');

//         activeBreakfastSelect.innerHTML = getOptions('active', 'breakfast', numberOfMeals);
//         activeSnack1Select.innerHTML = numberOfMeals >= 4 ? getOptions('active', 'snack1', numberOfMeals) : '';
//         activeLunchSelect.innerHTML = getOptions('active', 'lunch', numberOfMeals);
//         activeSnack2Select.innerHTML = numberOfMeals == 5 ? getOptions('active', 'snack2', numberOfMeals) : '';
//         activeDinnerSelect.innerHTML = getOptions('active', 'dinner', numberOfMeals);

//         toggleVisibility(activeSnack1Select, numberOfMeals >= 4);
//         toggleVisibility(activeSnack2Select, numberOfMeals == 5);
//     }
// }

// function toggleVisibility(element, isVisible) {
//     if (isVisible) {
//         element.classList.remove('hidden');
//         element.previousElementSibling.classList.remove('hidden');
//     } else {
//         element.classList.add('hidden');
//         element.previousElementSibling.classList.add('hidden');
//     }
// }

// function getOptions(type, meal, numberOfMeals) {
//     const options = {
//         '2000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (1/2 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/2 cup) + Bhature (1) + Salad (1/2 bowl)",
//                         "Paneer Tikka (100 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1/2 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/2 cup) + Naan (1)",
//                         "Aloo Gobhi (1/2 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/2 cup) + Rice (1/2 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1/2 cup) + Tandoori Roti (1)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/2 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/2 cup) + Chapati (1)",
//                         "Chicken Tikka (100 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/2 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/2 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1/2) + Curd (1/3 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/3 cup) + Bhature (1) + Salad (1/3 bowl)",
//                         "Paneer Tikka (50 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1/2 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1/2 cup) + Naan (1) + Carrot Halwa (1/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/3 cup) + Naan (1)",
//                         "Aloo Gobhi (1/3 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/3 cup) + Rice (1/3 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1/2 cup)",
//                         "Mutton Rogan Josh (1/3 cup) + Tandoori Roti (1)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/3 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/3 cup) + Chapati (1)",
//                         "Chicken Tikka (70 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/3 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/3 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (1)",
//                         "Idli (3) + Sambar (1 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (1 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (1 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (50 grams) + banana (1)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1/2 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (25 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (25 grams) + banana (1)",
//                         "Idli (1) + Sambar (1/3 cup) + Coconut Chutney (25 grams)",
//                         "Upma (1/3 cup) + Curd (1/3 cup) + Papaya (1 slice)",
//                         "Pongal (1/3 cup) + Coconut Chutney (25 grams) + Orange (1/2)",
//                         "Masala Dosa (1) + Sambar (1/3 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/3 cup) + Papad (1) + Curd (1/3 cup)",
//                         "Fish Curry (1/3 cup) + Rice (1/2 cup) + Veg Poriyal (1/3 bowl)",
//                         "Lemon Rice (1/3 cup) + Coconut Chutney (25 grams) + Curd (1/3 cup)",
//                         "Rasam (1 cup) + Rice (1/2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/3 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (25 grams) + Tomato Chutney (25 grams)",
//                         "Curd Rice (1/3 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/3 cup) + Raita (1 cup)",
//                         "Avial (1/2 cup) + Rice (1/2 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1/2 cup) + Spinach Poriyal (1/2 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (1/2 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Poached Egg (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (3/4 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (3/4 cup) + Blueberries (1/3 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (3/4 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (3/4 cup) + Mixed Green Salad",
//                         "Salmon (3/4 fillet) + Brown Rice (3/4 cup) + Broccoli (3/4 cup)",
//                         "Vegetable Stir Fry + Tofu (3/4 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (3/4 fillet) + Sweet Potato (3/4) + Asparagus (3/4 cup)",
//                         "Chicken Breast (3/4) + Couscous (3/4 cup) + Green Beans (3/4 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (3/4 cup)",
//                         "Quinoa Bowl + Black Beans (3/4 cup) + Corn (3/4 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1/2 cup) + Almonds (5) + Apple (1/2)",
//                         "Greek Yogurt (1/2 cup) + Blueberries (1/4 cup)",
//                         "Scrambled Eggs (1) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1/2 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1/2 cup) + Mixed Green Salad",
//                         "Salmon (1/2 fillet) + Brown Rice (1/2 cup) + Broccoli (1/2 cup)",
//                         "Vegetable Stir Fry + Tofu (1/2 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1/2 fillet) + Sweet Potato (1/2) + Asparagus (1/2 cup)",
//                         "Chicken Breast (1/2) + Couscous (1/2 cup) + Green Beans (1/2 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1/2 cup)",
//                         "Quinoa Bowl + Black Beans (1/2 cup) + Corn (1/2 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1)"
//                     ]
//                 }
//             }
//         },
//         // Add more calorie categories and meal options based on the provided document
//     };

//     return options[calorieCategory][type][numberOfMeals][meal].map(option => `<option value="${option}">${option}</option>`).join('');
// }

// function generatePlan() {
//     const meals = document.getElementById('meals').value;

//     const dietPlanDetails = document.getElementById('diet-plan-details');
//     dietPlanDetails.innerHTML = `<p>Category: ${calorieCategory} kcal</p><p>Meals: ${meals}</p>`;

//     const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
//     if (meals == 4) {
//         mealLabels.splice(1, 0, 'Snack');
//     } else if (meals == 5) {
//         mealLabels.splice(1, 0, 'Snack1');
//         mealLabels.splice(3, 0, 'Snack2');
//     }

//     mealLabels.forEach(label => {
//         const mealType = activityLevel === 'sedentary' ? (document.getElementById(`north-${label.toLowerCase()}-select`).value || document.getElementById(`south-${label.toLowerCase()}-select`).value) : document.getElementById(`active-${label.toLowerCase()}-select`).value;
//         dietPlanDetails.innerHTML += `<p>${label}: ${mealType}</p>`;
//     });

//     document.getElementById('diet-plan').classList.remove('hidden');
// }

// function calculateCalories(height, weight, gender) {
//     return (10 * weight) + (6.25 * height) - (5 * 25) + (gender === 'male' ? 5 : -161);
// }

// document.querySelectorAll('.meal-select').forEach(select => {
//     select.addEventListener('change', (event) => {
//         const selectedMeal = event.target.id.split('-')[1]; // breakfast, lunch, dinner
//         const selectedType = event.target.id.split('-')[0]; // north, south, active
//         const value = event.target.value;

//         if (value) {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//             }
//         } else {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//             }
//         }
//     });
// });




// document.getElementById('sedentary').addEventListener('click', () => {
//     showForm('sedentary');
// });

// document.getElementById('active').addEventListener('click', () => {
//     showForm('active');
// });

// document.querySelectorAll('#height, #weight, #gender, #meals').forEach(input => {
//     input.addEventListener('input', () => {
//         if (isFormFilled()) {
//             calculateAndShowMeals();
//         }
//     });
// });

// document.getElementById('diet-form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     generatePlan();
// });

// let activityLevel = '';
// let maintenanceCalories = 0;
// let calorieCategory = '2000';

// function showForm(level) {
//     activityLevel = level;
//     document.getElementById('form-container').classList.remove('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
// }

// function isFormFilled() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;
//     const meals = document.getElementById('meals').value;
//     return height && weight && gender && meals;
// }

// function calculateAndShowMeals() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;

//     maintenanceCalories = calculateCalories(height, weight, gender);
//     if (maintenanceCalories < 2000) {
//         maintenanceCalories = 2000;
//     } else if (maintenanceCalories > 3500) {
//         maintenanceCalories = 3500;
//     }

//     if (maintenanceCalories > 3200) {
//         calorieCategory = '3500';
//     } else if (maintenanceCalories > 2700) {
//         calorieCategory = '3000';
//     } else if (maintenanceCalories > 2200) {
//         calorieCategory = '2500';
//     } else {
//         calorieCategory = '2000';
//     }

//     updateMealOptions();
//     document.getElementById('meal-options').classList.remove('hidden');
// }

// function updateMealOptions() {
//     const northBreakfastSelect = document.getElementById('north-breakfast-select');
//     const northLunchSelect = document.getElementById('north-lunch-select');
//     const northDinnerSelect = document.getElementById('north-dinner-select');

//     const southBreakfastSelect = document.getElementById('south-breakfast-select');
//     const southLunchSelect = document.getElementById('south-lunch-select');
//     const southDinnerSelect = document.getElementById('south-dinner-select');

//     const activeBreakfastSelect = document.getElementById('active-breakfast-select');
//     const activeLunchSelect = document.getElementById('active-lunch-select');
//     const activeDinnerSelect = document.getElementById('active-dinner-select');

//     const numberOfMeals = document.getElementById('meals').value;

//     if (activityLevel === 'sedentary') {
//         document.getElementById('north-indian').classList.remove('hidden');
//         document.getElementById('south-indian').classList.remove('hidden');

//         northBreakfastSelect.innerHTML = getOptions('north', 'breakfast', numberOfMeals);
//         northLunchSelect.innerHTML = getOptions('north', 'lunch', numberOfMeals);
//         northDinnerSelect.innerHTML = getOptions('north', 'dinner', numberOfMeals);

//         southBreakfastSelect.innerHTML = getOptions('south', 'breakfast', numberOfMeals);
//         southLunchSelect.innerHTML = getOptions('south', 'lunch', numberOfMeals);
//         southDinnerSelect.innerHTML = getOptions('south', 'dinner', numberOfMeals);
//     } else {
//         document.getElementById('active-meals').classList.remove('hidden');

//         activeBreakfastSelect.innerHTML = getOptions('active', 'breakfast', numberOfMeals);
//         activeLunchSelect.innerHTML = getOptions('active', 'lunch', numberOfMeals);
//         activeDinnerSelect.innerHTML = getOptions('active', 'dinner', numberOfMeals);
//     }
// }

// function getOptions(type, meal, numberOfMeals) {
//     const options = {
//         '2000': {
//             'north': {
//                 '3': {
//                     'breakfast': [
//                         "Aloo Paratha (2) + Curd (1 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1 cup) + Bhature (2) + Salad (1 bowl)",
//                         "Paneer Tikka (200 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1 cup) + Naan (2)",
//                         "Aloo Gobhi (1 cup) + Chapati (2) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1 cup) + Rice (1 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1 cup) + Tandoori Roti (2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1 cup) + Rice (1 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1 cup) + Chapati (2)",
//                         "Chicken Tikka (200 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1 cup) + Paratha (2)",
//                         "Kadhai Paneer (1 cup) + Jeera Rice (1 cup)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Aloo Paratha (1) + Curd (1/2 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/2 cup) + Bhature (1) + Salad (1/2 bowl)",
//                         "Paneer Tikka (100 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1 cup) + Naan (1) + Carrot Halwa (1/2 small serving)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/2 cup) + Naan (1)",
//                         "Aloo Gobhi (1/2 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/2 cup) + Rice (1/2 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1 cup)",
//                         "Mutton Rogan Josh (1/2 cup) + Tandoori Roti (1)"
//                     ],
//                     'snack': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/2 cup) + Rice (1/2 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/2 cup) + Chapati (1)",
//                         "Chicken Tikka (100 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/2 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/2 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Aloo Paratha (1/2) + Curd (1/3 cup) + Mango Pickle (1 tablespoon)",
//                         "Chole (1/3 cup) + Bhature (1) + Salad (1/3 bowl)",
//                         "Paneer Tikka (50 grams) + Green Chutney (2 tablespoons) + Mixed Veg Raita (1 cup)",
//                         "Rajma (1/2 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Dal Makhani (1/2 cup) + Naan (1) + Carrot Halwa (1/3 small serving)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Paneer Butter Masala (1/3 cup) + Naan (1)",
//                         "Aloo Gobhi (1/3 cup) + Chapati (1) + Boondi Raita (1 cup)",
//                         "Chicken Curry (1/3 cup) + Rice (1/3 cup) + Mixed Vegetable Salad (1 bowl)",
//                         "Palak Paneer (1/2 cup) + Jeera Rice (1/2 cup)",
//                         "Mutton Rogan Josh (1/3 cup) + Tandoori Roti (1)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Dal Tadka (1/3 cup) + Rice (1/3 cup) + Cucumber Salad (1 bowl)",
//                         "Baingan Bharta (1/3 cup) + Chapati (1)",
//                         "Chicken Tikka (70 grams) + Mint Chutney (2 tablespoons) + Salad (1 bowl)",
//                         "Paneer Bhurji (1/3 cup) + Paratha (1)",
//                         "Kadhai Paneer (1/3 cup) + Jeera Rice (1/2 cup)"
//                     ]
//                 }
//             },
//             'south': {
//                 '3': {
//                     'breakfast': [
//                         "Dosa (2) + chutney (50 grams) + banana (1)",
//                         "Idli (3) + Sambar (1 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1 cup) + Curd (1 cup) + Papaya (1 slice)",
//                         "Pongal (1 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1 cup) + Mango (1 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1 cup) + Papad (2) + Curd (1 cup)",
//                         "Fish Curry (1 cup) + Rice (1 cup) + Veg Poriyal (1 bowl)",
//                         "Lemon Rice (1 cup) + Coconut Chutney (50 grams) + Curd (1 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1 cup) + Rice (1 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (2) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1 cup) + Pickle (1 tablespoon) + Papad (2)",
//                         "Vegetable Biryani (1 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (2)",
//                         "Egg Curry (1 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (50 grams) + banana (1)",
//                         "Idli (2) + Sambar (1/2 cup) + Coconut Chutney (50 grams)",
//                         "Upma (1/2 cup) + Curd (1/2 cup) + Papaya (1 slice)",
//                         "Pongal (1/2 cup) + Coconut Chutney (50 grams) + Orange (1)",
//                         "Masala Dosa (1) + Sambar (1/2 cup) + Mango (1/2 slice)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/2 cup) + Papad (1) + Curd (1/2 cup)",
//                         "Fish Curry (1/2 cup) + Rice (1 cup) + Veg Poriyal (1/2 bowl)",
//                         "Lemon Rice (1/2 cup) + Coconut Chutney (25 grams) + Curd (1/2 cup)",
//                         "Rasam (1 cup) + Rice (1 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/2 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (50 grams) + Tomato Chutney (50 grams)",
//                         "Curd Rice (1/2 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/2 cup) + Raita (1 cup)",
//                         "Avial (1 cup) + Rice (1 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1 cup) + Spinach Poriyal (1 bowl)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Dosa (1) + chutney (25 grams) + banana (1)",
//                         "Idli (1) + Sambar (1/3 cup) + Coconut Chutney (25 grams)",
//                         "Upma (1/3 cup) + Curd (1/3 cup) + Papaya (1 slice)",
//                         "Pongal (1/3 cup) + Coconut Chutney (25 grams) + Orange (1/2)",
//                         "Masala Dosa (1) + Sambar (1/3 cup) + Mango (1/2 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Sambar Rice (1/3 cup) + Papad (1) + Curd (1/3 cup)",
//                         "Fish Curry (1/3 cup) + Rice (1/2 cup) + Veg Poriyal (1/3 bowl)",
//                         "Lemon Rice (1/3 cup) + Coconut Chutney (25 grams) + Curd (1/3 cup)",
//                         "Rasam (1 cup) + Rice (1/2 cup) + Beetroot Thoran (1 bowl)",
//                         "Chicken Chettinad (1/2 cup) + Rice (1/3 cup) + Cucumber Raita (1 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Pesarattu (1) + Coconut Chutney (25 grams) + Tomato Chutney (25 grams)",
//                         "Curd Rice (1/3 cup) + Pickle (1 tablespoon) + Papad (1)",
//                         "Vegetable Biryani (1/3 cup) + Raita (1 cup)",
//                         "Avial (1/2 cup) + Rice (1/2 cup) + Appalam (1)",
//                         "Egg Curry (1/2 cup) + Rice (1/2 cup) + Spinach Poriyal (1/2 bowl)"
//                     ]
//                 }
//             },
//             'active': {
//                 '3': {
//                     'breakfast': [
//                         "Oatmeal (1 cup) + Almonds (10) + Apple (1)",
//                         "Greek Yogurt (1 cup) + Blueberries (1/2 cup)",
//                         "Scrambled Eggs (3) + Whole Wheat Toast (2 slices)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Poached Egg (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1 cup)",
//                         "Turkey Sandwich on Whole Wheat + Carrot Sticks",
//                         "Lentil Soup (1 cup) + Mixed Green Salad",
//                         "Salmon (1 fillet) + Brown Rice (1 cup) + Broccoli (1 cup)",
//                         "Vegetable Stir Fry + Tofu (1 cup)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1 fillet) + Sweet Potato (1) + Asparagus (1 cup)",
//                         "Chicken Breast (1) + Couscous (1 cup) + Green Beans (1 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1 cup)",
//                         "Quinoa Bowl + Black Beans (1 cup) + Corn (1 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (3)"
//                     ]
//                 },
//                 '4': {
//                     'breakfast': [
//                         "Oatmeal (3/4 cup) + Almonds (8) + Apple (1)",
//                         "Greek Yogurt (3/4 cup) + Blueberries (1/3 cup)",
//                         "Scrambled Eggs (2) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice) + Boiled Egg (1)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (3/4 cup)",
//                         "Turkey Sandwich on Whole Wheat + Celery Sticks",
//                         "Lentil Soup (3/4 cup) + Mixed Green Salad",
//                         "Salmon (3/4 fillet) + Brown Rice (3/4 cup) + Broccoli (3/4 cup)",
//                         "Vegetable Stir Fry + Tofu (3/4 cup)"
//                     ],
//                     'snack': [
//                         "Fruit Salad (1 cup) + Yogurt (1/2 cup)",
//                         "Mixed Nuts (1/4 cup) + Apple (1)",
//                         "Granola Bar (1) + Orange (1)",
//                         "Vegetable Sticks (1 cup) + Hummus (1/4 cup)",
//                         "Smoothie (1 cup) + Banana (1)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (3/4 fillet) + Sweet Potato (3/4) + Asparagus (3/4 cup)",
//                         "Chicken Breast (3/4) + Couscous (3/4 cup) + Green Beans (3/4 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (3/4 cup)",
//                         "Quinoa Bowl + Black Beans (3/4 cup) + Corn (3/4 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (2)"
//                     ]
//                 },
//                 '5': {
//                     'breakfast': [
//                         "Oatmeal (1/2 cup) + Almonds (5) + Apple (1/2)",
//                         "Greek Yogurt (1/2 cup) + Blueberries (1/4 cup)",
//                         "Scrambled Eggs (1) + Whole Wheat Toast (1 slice)",
//                         "Smoothie (Banana, Spinach, Almond Milk)",
//                         "Avocado Toast (1 slice)"
//                     ],
//                     'snack1': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'lunch': [
//                         "Grilled Chicken Salad + Quinoa (1/2 cup)",
//                         "Turkey Sandwich on Whole Wheat + Cucumber Slices",
//                         "Lentil Soup (1/2 cup) + Mixed Green Salad",
//                         "Salmon (1/2 fillet) + Brown Rice (1/2 cup) + Broccoli (1/2 cup)",
//                         "Vegetable Stir Fry + Tofu (1/2 cup)"
//                     ],
//                     'snack2': [
//                         "Fruit Salad (1/2 cup) + Yogurt (1/4 cup)",
//                         "Mixed Nuts (1/8 cup) + Apple (1/2)",
//                         "Granola Bar (1/2) + Orange (1/2)",
//                         "Vegetable Sticks (1/2 cup) + Hummus (2 tablespoons)",
//                         "Smoothie (1/2 cup) + Banana (1/2)"
//                     ],
//                     'dinner': [
//                         "Baked Cod (1/2 fillet) + Sweet Potato (1/2) + Asparagus (1/2 cup)",
//                         "Chicken Breast (1/2) + Couscous (1/2 cup) + Green Beans (1/2 cup)",
//                         "Beef Stir Fry + Mixed Vegetables (1/2 cup)",
//                         "Quinoa Bowl + Black Beans (1/2 cup) + Corn (1/2 cup)",
//                         "Pasta with Marinara Sauce + Meatballs (1)"
//                     ]
//                 }
//             }
//         },
//         // Add more calorie categories and meal options based on the provided document
//     };

//     return options[calorieCategory][type][numberOfMeals][meal].map(option => `<option value="${option}">${option}</option>`).join('');
// }

// function generatePlan() {
//     const meals = document.getElementById('meals').value;

//     const dietPlanDetails = document.getElementById('diet-plan-details');
//     dietPlanDetails.innerHTML = `<p>Category: ${calorieCategory} kcal</p><p>Meals: ${meals}</p>`;

//     const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
//     if (meals == 4) {
//         mealLabels.splice(1, 0, 'Snack');
//     } else if (meals == 5) {
//         mealLabels.splice(1, 0, 'Snack1');
//         mealLabels.splice(3, 0, 'Snack2');
//     }

//     mealLabels.forEach(label => {
//         const mealType = activityLevel === 'sedentary' ? (document.getElementById(`north-${label.toLowerCase()}-select`).value || document.getElementById(`south-${label.toLowerCase()}-select`).value) : document.getElementById(`active-${label.toLowerCase()}-select`).value;
//         dietPlanDetails.innerHTML += `<p>${label}: ${mealType}</p>`;
//     });

//     document.getElementById('diet-plan').classList.remove('hidden');
// }

// function calculateCalories(height, weight, gender) {
//     return (10 * weight) + (6.25 * height) - (5 * 25) + (gender === 'male' ? 5 : -161);
// }

// document.querySelectorAll('.meal-select').forEach(select => {
//     select.addEventListener('change', (event) => {
//         const selectedMeal = event.target.id.split('-')[1]; // breakfast, lunch, dinner
//         const selectedType = event.target.id.split('-')[0]; // north, south, active
//         const value = event.target.value;

//         if (value) {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//             }
//         } else {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//             }
//         }
//     });
// });





// document.getElementById('sedentary').addEventListener('click', () => {
//     showForm('sedentary');
// });

// document.getElementById('active').addEventListener('click', () => {
//     showForm('active');
// });

// document.querySelectorAll('#height, #weight, #gender, #meals').forEach(input => {
//     input.addEventListener('input', () => {
//         if (isFormFilled()) {
//             calculateAndShowMeals();
//         }
//     });
// });

// document.getElementById('diet-form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     generatePlan();
// });

// let activityLevel = '';
// let maintenanceCalories = 0;
// let calorieCategory = '2000';

// function showForm(level) {
//     activityLevel = level;
//     document.getElementById('form-container').classList.remove('hidden');
//     document.getElementById('meal-options').classList.add('hidden');
//     document.getElementById('north-indian').classList.add('hidden');
//     document.getElementById('south-indian').classList.add('hidden');
//     document.getElementById('active-meals').classList.add('hidden');
// }

// function isFormFilled() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;
//     const meals = document.getElementById('meals').value;
//     return height && weight && gender && meals;
// }

// function calculateAndShowMeals() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;

//     maintenanceCalories = calculateCalories(height, weight, gender);
//     if (maintenanceCalories < 2000) {
//         maintenanceCalories = 2000;
//     } else if (maintenanceCalories > 3500) {
//         maintenanceCalories = 3500;
//     }

//     if (maintenanceCalories > 3200) {
//         calorieCategory = '3500';
//     } else if (maintenanceCalories > 2700) {
//         calorieCategory = '3000';
//     } else if (maintenanceCalories > 2200) {
//         calorieCategory = '2500';
//     } else {
//         calorieCategory = '2000';
//     }

//     updateMealOptions();
//     document.getElementById('meal-options').classList.remove('hidden');
// }

// function updateMealOptions() {
//     const northBreakfastSelect = document.getElementById('north-breakfast-select');
//     const northLunchSelect = document.getElementById('north-lunch-select');
//     const northDinnerSelect = document.getElementById('north-dinner-select');

//     const southBreakfastSelect = document.getElementById('south-breakfast-select');
//     const southLunchSelect = document.getElementById('south-lunch-select');
//     const southDinnerSelect = document.getElementById('south-dinner-select');

//     const activeBreakfastSelect = document.getElementById('active-breakfast-select');
//     const activeLunchSelect = document.getElementById('active-lunch-select');
//     const activeDinnerSelect = document.getElementById('active-dinner-select');

//     if (activityLevel === 'sedentary') {
//         document.getElementById('north-indian').classList.remove('hidden');
//         document.getElementById('south-indian').classList.remove('hidden');

//         northBreakfastSelect.innerHTML = getOptions('North Breakfast');
//         northLunchSelect.innerHTML = getOptions('North Lunch');
//         northDinnerSelect.innerHTML = getOptions('North Dinner');

//         southBreakfastSelect.innerHTML = getOptions('South Breakfast');
//         southLunchSelect.innerHTML = getOptions('South Lunch');
//         southDinnerSelect.innerHTML = getOptions('South Dinner');
//     } else {
//         document.getElementById('active-meals').classList.remove('hidden');

//         activeBreakfastSelect.innerHTML = getOptions('Active Breakfast');
//         activeLunchSelect.innerHTML = getOptions('Active Lunch');
//         activeDinnerSelect.innerHTML = getOptions('Active Dinner');
//     }
// }

// function getOptions(mealType) {
//     const options = {
//         '2000': [`${mealType} 1`, `${mealType} 2`, `${mealType} 3`],
//         '2500': [`${mealType} 1 (2500)`, `${mealType} 2 (2500)`, `${mealType} 3 (2500)`],
//         '3000': [`${mealType} 1 (3000)`, `${mealType} 2 (3000)`, `${mealType} 3 (3000)`],
//         '3500': [`${mealType} 1 (3500)`, `${mealType} 2 (3500)`, `${mealType} 3 (3500)`]
//     };

//     return options[calorieCategory].map(option => `<option value="${option}">${option}</option>`).join('');
// }

// function generatePlan() {
//     const meals = document.getElementById('meals').value;

//     const dietPlanDetails = document.getElementById('diet-plan-details');
//     dietPlanDetails.innerHTML = `<p>Category: ${calorieCategory} kcal</p><p>Meals: ${meals}</p>`;

//     const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
//     if (meals == 4) {
//         mealLabels.splice(2, 0, 'Snack1');
//     } else if (meals == 5) {
//         mealLabels.splice(2, 0, 'Snack1');
//         mealLabels.push('Snack2');
//     }

//     mealLabels.forEach(label => {
//         const mealType = activityLevel === 'sedentary' ? (document.getElementById(`north-${label.toLowerCase()}-select`).value || document.getElementById(`south-${label.toLowerCase()}-select`).value) : document.getElementById(`active-${label.toLowerCase()}-select`).value;
//         dietPlanDetails.innerHTML += `<p>${label}: ${mealType}</p>`;
//     });

//     document.getElementById('diet-plan').classList.remove('hidden');
// }

// function calculateCalories(height, weight, gender) {
//     return (10 * weight) + (6.25 * height) - (5 * 25) + (gender === 'male' ? 5 : -161);
// }

// document.querySelectorAll('.meal-select').forEach(select => {
//     select.addEventListener('change', (event) => {
//         const selectedMeal = event.target.id.split('-')[1]; // breakfast, lunch, dinner
//         const selectedType = event.target.id.split('-')[0]; // north, south, active
//         const value = event.target.value;

//         if (value) {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = true;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = true;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = true;
//             }
//         } else {
//             if (selectedType === 'north') {
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'south') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`active-${selectedMeal}-select`).disabled = false;
//             } else if (selectedType === 'active') {
//                 document.getElementById(`north-${selectedMeal}-select`).disabled = false;
//                 document.getElementById(`south-${selectedMeal}-select`).disabled = false;
//             }
//         }
//     });
// });



// document.getElementById('sedentary').addEventListener('click', () => {
//     showForm('sedentary');
// });

// document.getElementById('active').addEventListener('click', () => {
//     showForm('active');
// });

// document.getElementById('meals').addEventListener('change', () => {
//     showMealOptions();
// });

// document.getElementById('diet-form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     generatePlan();
// });

// let activityLevel = '';

// function showForm(level) {
//     activityLevel = level;
//     document.getElementById('form-container').classList.remove('hidden');
//     if (activityLevel === 'sedentary') {
//         document.getElementById('meal-options').classList.remove('hidden');
//         document.getElementById('north-indian').classList.remove('hidden');
//         document.getElementById('south-indian').classList.remove('hidden');
//     } else {
//         document.getElementById('meal-options').classList.remove('hidden');
//         showActiveOptions();
//     }
// }

// function showMealOptions() {
//     if (activityLevel === 'sedentary') {
//         document.getElementById('north-indian').classList.remove('hidden');
//         document.getElementById('south-indian').classList.remove('hidden');
//     }
// }

// function showActiveOptions() {
//     const mealOptions = document.getElementById('meal-options');
//     mealOptions.innerHTML = '';

//     const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
//     const meals = document.getElementById('meals').value;

//     if (meals == 4) {
//         mealLabels.splice(2, 0, 'Snack1');
//     } else if (meals == 5) {
//         mealLabels.splice(2, 0, 'Snack1');
//         mealLabels.push('Snack2');
//     }

//     mealLabels.forEach(label => {
//         const div = document.createElement('div');
//         div.innerHTML = `<label>${label} (Active):</label><select id="${label.toLowerCase()}-active" required>${getActiveOptions()}</select>`;
//         mealOptions.appendChild(div);
//     });

//     mealOptions.classList.remove('hidden');
// }

// function getActiveOptions() {
//     const activeOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
//     return activeOptions.map(option => `<option value="${option}">${option}</option>`).join('');
// }

// function generatePlan() {
//     const height = document.getElementById('height').value;
//     const weight = document.getElementById('weight').value;
//     const gender = document.getElementById('gender').value;
//     const meals = document.getElementById('meals').value;
    
//     let maintenanceCalories = calculateCalories(height, weight, gender);
//     if (maintenanceCalories < 2000) {
//         maintenanceCalories = 2000;
//     } else if (maintenanceCalories > 3500) {
//         maintenanceCalories = 3500;
//     }

//     let category = '2000';
//     if (maintenanceCalories > 2200) category = '2500';
//     if (maintenanceCalories > 2700) category = '3000';
//     if (maintenanceCalories > 3200) category = '3500';

//     const dietPlanDetails = document.getElementById('diet-plan-details');
//     dietPlanDetails.innerHTML = `<p>Category: ${category} kcal</p><p>Meals: ${meals}</p>`;

//     const mealLabels = ['Breakfast', 'Lunch', 'Dinner'];
//     if (meals == 4) {
//         mealLabels.splice(2, 0, 'Snack1');
//     } else if (meals == 5) {
//         mealLabels.splice(2, 0, 'Snack1');
//         mealLabels.push('Snack2');
//     }

//     mealLabels.forEach(label => {
//         const mealType = activityLevel === 'sedentary' ? (document.getElementById(`north-${label.toLowerCase()}-select`).value || document.getElementById(`south-${label.toLowerCase()}-select`).value) : document.getElementById(`${label.toLowerCase()}-active`).value;
//         dietPlanDetails.innerHTML += `<p>${label}: ${mealType}</p>`;
//     });

//     document.getElementById('diet-plan').classList.remove('hidden');
// }

// function calculateCalories(height, weight, gender) {
//     // Placeholder calculation for maintenance calories
//     return (10 * weight) + (6.25 * height) - (5 * 25) + (gender === 'male' ? 5 : -161);
// }

// document.querySelectorAll('.meal-select').forEach(select => {
//     select.addEventListener('change', (event) => {
//         const selectedMeal = event.target.id.split('-')[0];
//         const value = event.target.value;

//         if (value) {
//             if (selectedMeal === 'north') {
//                 document.getElementById(`south-${selectedMeal.split('-')[1]}-select`).disabled = true;
//             } else if (selectedMeal === 'south') {
//                 document.getElementById(`north-${selectedMeal.split('-')[1]}-select`).disabled = true;
//             }
//         } else {
//             if (selectedMeal === 'north') {
//                 document.getElementById(`south-${selectedMeal.split('-')[1]}-select`).disabled = false;
//             } else if (selectedMeal === 'south') {
//                 document.getElementById(`north-${selectedMeal.split('-')[1]}-select`).disabled = false;
//             }
//         }
//     });
// });
