var MealModel = require('../models/mealModel.js');

/**
 * mealController.js
 *
 * @description :: Server-side logic for managing meals.
 */
module.exports = {

    /**
     * mealController.list()
     */
    list: function (req, res) {
        MealModel.find(function (err, meals) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting meal.',
                    error: err
                });
            }

            return res.json(meals);
        });
    },

    /**
     * mealController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        MealModel.findOne({_id: id}, function (err, meal) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting meal.',
                    error: err
                });
            }

            if (!meal) {
                return res.status(404).json({
                    message: 'No such meal'
                });
            }

            return res.json(meal);
        });
    },

    /**
     * mealController.create()
     */
    create: function (req, res) {
        var meal = new MealModel({
			name : req.body.name,
			calories : req.body.calories,
			price : req.body.price,
			ingredients : req.body.ingredients
        });

        meal.save(function (err, meal) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating meal',
                    error: err
                });
            }

            return res.status(201).json(meal);
        });
    },

    /**
     * mealController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        MealModel.findOne({_id: id}, function (err, meal) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting meal',
                    error: err
                });
            }

            if (!meal) {
                return res.status(404).json({
                    message: 'No such meal'
                });
            }

            meal.name = req.body.name ? req.body.name : meal.name;
			meal.calories = req.body.calories ? req.body.calories : meal.calories;
			meal.price = req.body.price ? req.body.price : meal.price;
			meal.ingredients = req.body.ingredients ? req.body.ingredients : meal.ingredients;
			
            meal.save(function (err, meal) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating meal.',
                        error: err
                    });
                }

                return res.json(meal);
            });
        });
    },

    /**
     * mealController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        MealModel.findByIdAndRemove(id, function (err, meal) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the meal.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
