import { Template } from 'meteor/templating';
import {Tasks} from '../api/tasks.js';
import './body.html';
import './task.html';
import './task';
import {Meteor} from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

// Template.body.onCreated(()=>{
//
//     this.state = new ReactiveDict();
//
// });

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {

      const instance = Template.instance();
      if(instance.state.get('hideCompleted')){
          // If hide completed is checked, filter tasks
          return Tasks.find({ checked: { $ne: true } }, { sort: { date: -1 } });
      }
    return Tasks.find({},{sort:{date:-1}});
  },


    incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },
});

Template.body.events({
   'submit .new-task'(event){
    event.preventDefault();
       var value = event.target.text.value;
       console.log(value);
       console.log(event);

       Meteor.call('tasks.insert',value);

       event.target.text.value = "";
   },
    'change .hide-completed input'(event,instance){
      instance.state.set('hideCompleted',event.target.checked);
    },



});