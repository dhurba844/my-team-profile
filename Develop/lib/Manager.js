const Employee = require("./Employee");

/**
 * @class 
 * 
 * @extends {Employee} 
 * 
 * @classdesc An Employee object representing a team manager
 * 
 * @property {String} officeNumber String representing the office's label
 * 
 * @method getOffice returns the officeNumber property
 */
class Manager extends Employee{
    constructor(arg_name, arg_id, arg_email, arg_officeNumber){
        // Parent constructor
        super(arg_name, arg_id, arg_email);

        // Init class methods
        this.officeNumber = arg_officeNumber;
        this.role = "Manager"; 
    }

    getOfficeNumber(){
        return this.officeNumber;
    }
}

module.exports = Manager;