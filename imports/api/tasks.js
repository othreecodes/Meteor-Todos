import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
    'tasks.insert'(text){
        check(text,String);

        if(!Meteor.userId()){
            throw new Meteor.Error('not-authorized');
        }

        Tasks.insert({
            text,
            date:new Date(),
            owner:Meteor.user()._id,
            username:Meteor.user().username,
        });


    },
    'tasks.remove'(taskId){
        check(taskId,String);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Tasks.remove(taskId);

    },
    'tasks.setChecked'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }


        Tasks.update(taskId, { $set: { checked: setChecked } });
    },
    'task.setPrivate'(taskId, setToPrivate){
        check(taskId,String);
        check(setToPrivate,Boolean);

        const task = Tasks.findOne(taskId);

        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, { $set: { private: setToPrivate } });

    },
});


if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}