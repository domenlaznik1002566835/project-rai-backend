var IngredientModel = require('../models/ingredientModel.js');

/**
 * ingredientController.js
 *
 * @description :: Server-side logic for managing ingredients.
 */
module.exports = {

    /**
     * ingredientController.list()
     */
    list: function (req, res) {
        IngredientModel.find(function (err, ingredients) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting ingredient.',
                    error: err
                });
            }

            return res.json(ingredients);
        });
    },

    /**
     * ingredientController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        IngredientModel.findOne({_id: id}, function (err, ingredient) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting ingredient.',
                    error: err
                });
            }

            if (!ingredient) {
                return res.status(404).json({
                    message: 'No such ingredient'
                });
            }

            return res.json(ingredient);
        });
    },

    /**
     * ingredientController.create()
     */
    create: async function (req, res) {
        const {name, calories, vegetarian} = req.body;

        const ingredient = new IngredientModel({
            name: name,
            calories: calories,
            vegetarian: vegetarian
        });

        try {
            await ingredient.save();
            return res.json(ingredient);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating ingredient',
                error: err
            });
        }
    },

    /**
     * ingredientController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        IngredientModel.findOne({_id: id}, function (err, ingredient) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting ingredient',
                    error: err
                });
            }

            if (!ingredient) {
                return res.status(404).json({
                    message: 'No such ingredient'
                });
            }

            ingredient.name = req.body.name ? req.body.name : ingredient.name;
			ingredient.calories = req.body.calories ? req.body.calories : ingredient.calories;
			ingredient.vegeterian = req.body.vegeterian ? req.body.vegeterian : ingredient.vegeterian;
			
            ingredient.save(function (err, ingredient) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating ingredient.',
                        error: err
                    });
                }

                return res.json(ingredient);
            });
        });
    },

    /**
     * ingredientController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        IngredientModel.findByIdAndRemove(id, function (err, ingredient) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the ingredient.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
