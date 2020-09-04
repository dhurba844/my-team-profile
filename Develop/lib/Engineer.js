const Employee = require("./Employee");

/**
 * @class
 * 
 * @extends {Employee}
 * 
 * @classdesc A class representing ran Engineering teammember
 * 
 * @property {String} facebook facebook name only 
 * 
 * @method facebookname returns the facebook name  for the engineer's profile
 */
class Engineer extends Employee{
    constructor(arg_name, arg_id, arg_email, arg_facebook){
        super(arg_name, arg_id, arg_email);

        this.facebook = arg_facebook;
        this.role = "Engineer";
    }

    getfacebook(){
        return this.facebook;
    }
}

module.exports = Engineer;