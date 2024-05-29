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
    list: async function (req, res) {
        try {
            const clients = await MealModel.find();
            return res.json(clients);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting client.',
                error: err
            });
        }
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
    create: async function (req, res) {
        const {name, calories, price, image, ingredients} = req.body;

        const meal = new MealModel({
            name: name,
            calories: calories,
            price: price,
            image: image,
            ingredients: ingredients
        });

        try {
            await meal.save();
            return res.json(meal);
        } catch(err) {
            return res.status(500).json({
                message: 'Error when creating meal',
                error: err
            });
        }
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
