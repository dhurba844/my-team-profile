const Employee = require("./Employee");

/**
 * @class
 * 
 * @extends {Employee}
 * 
 * @classdesc An object that represents an Intern
 * 
 * @property {String} school University that the intern is attending
 * 
 * @method getSchool returns the school of the employee
 */
class Intern extends Employee{
    constructor(arg_name, arg_id, arg_email, arg_school){
        super(arg_name, arg_id, arg_email);

        this.school = arg_school;
        this.role = "Intern";
    }

    getSchool(){
        return this.school;
    }
}

module.exports = Intern;