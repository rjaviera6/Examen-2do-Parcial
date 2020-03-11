var ObjectID = require('mongodb').ObjectID;

function employeeModel(db){
  var lib = {};
  var empColl = db.collection('emps');
  lib.getEmployees = (handler)=>{
    empColl.find({}).toArray(handler);
  }

  lib.getEmployeesById = (id, handler) => {
    var query = {"_id" : new ObjectID(id)};
    var projection = {"email":1, "phone":1, "name":1, "age":1, "_id":0};
    empColl.findOne(
      query,
      {"projection": projection},
      (err, user)=>{
        if(err){
          return handler(err, null);
        }
        return handler(null, user);
      }
    );
  }

  lib.getEmployeesByCompany = (company, handler) => {
    var query = {"company":company};
    var projection = {"name":1, "email":1, "company":1, "_id":0};
    empColl.findOne(
      query,
      {"projection": projection},
      (err, doc)=>{
        if(err){
          return handler(err, null);
        }
        return handler(null, doc);
      }
    );
  }

  lib.getEmployeesByAgeRange = (ageLowLimit, ageHighLimit, handler) => {
    var query = {$and : [
      {"age" : {$gte : ageLowLimit}},
      {"age" : {$lte : ageHighLimit}} ]};
    var projection = {"name":1, "age":1, "email":1, "_id":0};
    empColl.find(query,projection).toArray((err, doc)=>{
      if(err){
        console.log(err);
        return handler(err, null);
      }
      console.log(doc);
      return handler(null, doc);
    });
  }

  lib.getEmployeesByTag = (tag, handler) => {
    var query = {"tags": tag};
    var projection = {"name":1, "email":1, "tags":1, "_id":0};
    empColl.find(query,projection).toArray(handler);
  }

  lib.addEmployeeATag = ( tag, id, handler) => {
    var tag_ = tag;
    var query = {"_id": new ObjectID(id)};
    var updateCommand = {
      $push:{
        "tags": tag_
      }
    };
    empColl.findOneAndUpdate(
      query,
      updateCommand,
      {returnNewDocument: true},
      (err, doc)=>{
        if(err){
          return handler(err, null);
        }
        console.log(doc);
        return handler(null, doc);
      }
    );
  }

  lib.removeEmployee = (id, handler) => {
    var query = {"_id": new ObjectID(id)};
    empColl.deleteOne(
      query,
      (err, doc)=>{
        if(err){
          return handler(err, null);
        }
        return handler(null, doc);
      }
    );
  }

  lib.increaseAgeToAll = (ageDelta, handler) => {
    var updateCommand = {
      "$inc" : {
        "age" : ageDelta
      }
    }
    empColl.updateMany(
      {},
      updateCommand,
      (err, doc)=>{
        if(err){
          return handler(err, null);
        }
        return handler(null, doc);
      }
    )
  }
  return lib;
}

module.exports = employeeModel;
