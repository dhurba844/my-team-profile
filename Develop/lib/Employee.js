/**
 * @class  
 * 
 * @classdesc An Employee object representing a teammember
 * 
 * @property {String} role String representing the employee's function on the team
 * 
 * @method getName returns the employee's name
 * 
 * @method getId returns the employee's Id
 * 
 * @method getEmail returns the employee's email
 * 
 * @method getRole returns the employee's role, defaulted to employee
 */
class Employee{
    // Constructor
    constructor(arg_name, arg_id, arg_email){
        // Parameterized properties
        this.name = arg_name;
        this.id = arg_id;
        this.email = arg_email;

        // Implicit property
        this.role = "Employee";
    }

    // Getter methods
    getName(){ return this.name;}
    getId(){ return this.id; }
    getEmail(){ return this.email; }
    getRole(){ return this.role; }
}

module.exports = Employee;