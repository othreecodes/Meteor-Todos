import { Template } from 'meteor/templating';

import './task.html';

Template.task.helpers({

    isOwner(){
        return this.owner === Meteor.userId();
    }

});


Template.task.events({
    'click .toggle-checked'(event) {

        Meteor.call('tasks.setChecked',this._id,!this.checked);

    },
    'click .delete'() {
        Meteor.call('tasks.remove',this._id);

    },
    'click .toggle-private'(event){

        Meteor.call('task.setPrivate',this._id,!this.private);
    },
});

