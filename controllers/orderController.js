var OrderModel = require('../models/orderModel.js');

/**
 * orderController.js
 *
 * @description :: Server-side logic for managing orders.
 */
module.exports = {

    /**
     * orderController.list()
     */
    list: function (req, res) {
        OrderModel.find(function (err, orders) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting order.',
                    error: err
                });
            }

            return res.json(orders);
        });
    },

    /**
     * orderController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        OrderModel.findOne({_id: id}, function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting order.',
                    error: err
                });
            }

            if (!order) {
                return res.status(404).json({
                    message: 'No such order'
                });
            }

            return res.json(order);
        });
    },

    /**
     * orderController.create()
     */
    create: function (req, res) {
        var order = new OrderModel({
			orderedBy : req.body.orderedBy,
			meals : req.body.meals,
			price : req.body.price
        });

        order.save(function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating order',
                    error: err
                });
            }

            return res.status(201).json(order);
        });
    },

    /**
     * orderController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        OrderModel.findOne({_id: id}, function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting order',
                    error: err
                });
            }

            if (!order) {
                return res.status(404).json({
                    message: 'No such order'
                });
            }

            order.orderedBy = req.body.orderedBy ? req.body.orderedBy : order.orderedBy;
			order.meals = req.body.meals ? req.body.meals : order.meals;
			order.price = req.body.price ? req.body.price : order.price;
			
            order.save(function (err, order) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating order.',
                        error: err
                    });
                }

                return res.json(order);
            });
        });
    },

    /**
     * orderController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        OrderModel.findByIdAndRemove(id, function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the order.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
