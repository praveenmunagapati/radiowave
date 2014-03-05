'use strict';

var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

    var Channel = sequelize.define('Channel', {
        // name must be globally unique
        name: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                notNull: true
            }
        }
    }, {
        associate: function (models) {
            models.Channel.hasMany(models.User, {
                through: models.ChannelSubsription,
                as: 'Subscribers'
            });
            models.Channel.hasMany(models.Event);
            models.Channel.hasMany(models.ChannelConfiguration, {
                as: 'Configuration'
            });
        },
        instanceMethods: {
            subscribe: function (user, options) {
                var self = this;
                return new Promise(function(resolve, reject) {

                    // verify parameters
                    if (!user) {
                        reject('wrong parameters');
                    } else {
                        // checkout if the current user is subscriber
                        self.getSubscribers({
                            where: {
                                userid : user.id
                            }
                        }).success(function(users){
                            console.log('found users: '+ JSON.stringify(users));

                            // user is already part of this room
                            if (users && users.length > 0) {
                                var channelSubscriber = users[0];

                                // update data
                                channelSubscriber.ChannelSubsription.affiliation = options.affiliation;
                                channelSubscriber.ChannelSubsription.save();

                                resolve(channelSubscriber);
                            } else {
                                console.log('add user as new subscriber ' + user.jid);
                                // add user to room
                                self.addSubscriber(user, options).success(function (subscriber) {
                                    resolve(subscriber);
                                }).error(function(err){
                                    reject(err);
                                });
                            }
                        }).error(function(err){
                            reject(err);
                        });
                    }
                });
            },
            unsubscribe: function (subscriber) {
                var self = this;
                return new Promise(function(resolve, reject) {
                    // verify parameters
                    if (!subscriber) {
                        reject('wrong parameters');
                    } else {
                        // checkout if the current user is subscriber
                        self.getSubscribers({
                            where: {
                                userid : subscriber.id
                            }
                        }).success(function(users){

                            // user is already part of this room
                            if (users && users.length > 0) {
                                self.removeSubscriber(users[0]);
                            } else {
                                reject('no subscriber');
                            }

                        }).error(function(err){
                            reject(err);
                        });
                    }
                });
            },
            isSubscriber: function (user) {
                var self = this;
                return new Promise(function(resolve, reject) {
                    // checkout if the current user is member
                    self.getSubscribers({
                        where: {
                            userid : user.id
                        }
                    }).success(function(users){
                        console.log('found users: ' + JSON.stringify(users));
                        if (users && users.length > 0) {
                            var user = users[0];
                            if (user) {
                                resolve(user);
                            } else {
                                reject();
                            }
                        } else {
                            reject();
                        }
                    }).error(function(err){
                        reject(err);
                    });
                });
            },
            setConfiguration: function () {
                // TODO implement
                return null;
            }
        }
    });

    return Channel;
};