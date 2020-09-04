// Load classes
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

// Load modules
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

// Path variables
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

// Load render method
const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");

// Array of teammembers
let teamInfo = [];
const defaultQuestions = [{
    type: "input",
    name: "name",
    message: "Enter the team member's name: ",
    validate: function(arg_input) {
        // Only letters and spaces in the name
        return (arg_input.trim().match("[^A-Za-z\\s']") == undefined) ? true : "Name must only contain letters, spaces, and apostrophes";
    }
}, {
    type: "input", // WARNING: using a validate on a number input will lock the user out of deleting the previously entered text
    name: "id",
    message: "Enter the team member's Id: ",
    validate: function(arg_input){
        // Get all siblings 
        let t_siblings = teamInfo.find((arg_employee) => { return arg_employee.id === arg_input; });

        //  If no siblings found
        if(t_siblings == undefined){
            return true;
        }
        // Else refuse validation
        else{
            return "A User with this ID already exists";
        }
    }
},{
    type: "input",
    name: "email",
    message: "Enter the team member's email: ",
    validate: function(arg_input){
        // Matches email format
        let t_email = arg_input.trim().match("[A-Za-z\#\!\?\\\-_\\\.0-9]+\@[A-Za-z0-9]{2,}\\\.[a-z]{2,4}"); 

        // No email found
        if(t_email == undefined){
            return "Submission is not in a valid email format";
        }
        // Submission matches email match
        else if(t_email == arg_input.trim()){
            return true;
        }

        // Email format found but does not match the total input
        return "Submission contains extraneous text";
    }
}];

/** Sort the employees by category and name */
function sortEmployees(){
    // Helper arrays
    let t_managers = [], t_engineers = [], t_interns = [];

    // For each employee
    for(let i = 0; i < teamInfo.length; i++){
        // Sort employee by role
        switch(teamInfo[i].role){
            case "Manager":
                t_managers.push(teamInfo[i]);
                break;
            case "Engineer":
                t_engineers.push(teamInfo[i]);
                break;
            case "Intern":
                t_interns.push(teamInfo[i]);
                break;
        }
    }

    // Sort the arrays by name
    t_managers.sort((a, b) => { return a.name > b.name; }); 
    t_engineers.sort((a, b) => { return a.name > b.name; }); 
    t_interns.sort((a, b) => { return a.name > b.name; });

    // Join arrays
    teamInfo = t_managers.concat(t_engineers, t_interns);
}

/** Builds a string to display the current team information to the user in the powershell */
function displayTeamInfo(){
    // If no employees have been added
    if(teamInfo.length === 0){
        return "There are no team members added"
    }

    // Create return var
    let t_return = "=".repeat(62) + " Current Team Members " + "=".repeat(64) + "\n";

    // Sort the teamInfo
    sortEmployees();
    
    // For each block of 6 employee's necessary
    for(let i = 0; i < Math.ceil(teamInfo.length / 6); i++){
        // Add top to table
        t_return += "-".repeat(150) + "\n";

        // Declare helper strings to eveventually display to the console
        let t_names = "  |", t_ids = "  |", t_emails = "  |", t_roles = "  |", t_info = "  |";

        // For each employee in the block of 6
        for(let j = 0; j < 5; j++){
            // Return if there are no more team members left
            if(6*i + j === teamInfo.length){
                // Add new line characters
                t_names += "\n"; 
                t_roles += "\n";
                t_ids += "\n"; 
                t_emails += "\n"; 
                t_info += "\n";

                //Append block to return string
                t_return += t_names + t_roles + t_ids + t_emails + t_info;

                // Add bottom table line
                t_return += "-".repeat(150) + "\n";
                return t_return;
            }

            // For each property
            for(let k of Object.keys(teamInfo[6*i + j])){
                // Append the info to the appropriate row
                switch(k){
                    case "name":
                        t_names += teamInfo[6*i + j].name.substring(0,25) + " ".repeat(Math.max(0, 25 - teamInfo[6*i + j].name.length)) + "|";
                        break;
                    case "id":
                        t_ids += teamInfo[6*i + j].id + " ".repeat(Math.max(0, 24 - Math.floor(Math.log10(teamInfo[6*i + j].id)))) + "|";
                        break;
                    case "email":
                        t_emails += teamInfo[6*i + j].email.substring(0,25) + " ".repeat(Math.max(0, 25 - teamInfo[6*i + j].email.length)) + "|";
                        break;
                    case "role":
                        t_roles += teamInfo[6*i + j].role.substring(0,25) + " ".repeat(Math.max(0, 25 - teamInfo[6*i + j].role.length)) + "|";
                        break;
                    default:
                        t_info += teamInfo[6*i + j][k].substring(0,25) + " ".repeat(Math.max(0,25 - teamInfo[6*i + j][k].length)) + "|";
                        break;
                }
            }

        }

        // Add new line characters
        t_names += "\n"; 
        t_roles += "\n";
        t_ids += "\n"; 
        t_emails += "\n"; 
        t_info += "\n";

        //Append block to return string
        t_return += t_names + t_roles + t_ids + t_emails + t_info;
    }

    // Add bottom table line
    t_return += "-".repeat(150) + "\n";
    return t_return;
}

/** Loops through calls of getTeamMemberInfo until the user indicates that they don't want to add more team members */
async function getTeamInfo(){
    // Helper var to track loop
    let t_running = true;

    // While the user wants to keep running
    while(t_running){
        // Get team member info
        teamInfo.push(await getTeamMemberInfo(),()=>{}); 

        // Get continue confirmation
        console.clear();
        ({confirmation: t_running} = await inquirer.prompt({
            type: "confirm",
            name: "confirmation",
            message: displayTeamInfo() + "Would you like to add more team members?",
        }));
    }
}

/** Prompts the user in the Powershell for Employee information */
async function getTeamMemberInfo(){
    let return_info = {};
    console.clear();

    // Get the selected category
    let { role: t_category } = await inquirer.prompt({
        type: "list",
        name: "role",
        message: "Which category of employee do you want to add?",
        choices: ["Manager", "Engineer", "Intern"]
    });

    // Ask default employee information
    let t_info = await inquirer.prompt(defaultQuestions);

    // Gather the custom property
    let t_customProp;
    switch(t_category){
        case "Manager":
            t_customProp = "officeNumber";
            break;
        case "Engineer":
            t_customProp = "github";
            break;
        case "Intern":
            t_customProp = "school";
            break;
    }

    // Update custom property
    let { property : t_customValue } = await inquirer.prompt({
        type: "input",
        name: "property",
        message: `What is the Employee's ${t_customProp}?`
    });
    t_info[t_customProp] = t_customValue;

    // Construct the object
    switch(t_category){
        case "Manager":
            return_info = new Manager(t_info.name, t_info.id, t_info.email, t_info.officeNumber);
            break;
        case "Engineer":
            return_info = new Engineer(t_info.name, t_info.id, t_info.email, t_info.github);
            break;
        case "Intern":
            return_info = new Intern(t_info.name, t_info.id, t_info.email, t_info.school);
            break;
    }

    // Return the constructed employee object
    return return_info;
}

/** Gathers information and writes the rendered html to teampage.html */
async function buildPage(){
    // Get the employee information
    await getTeamInfo();

    // Generate html
    const t_html = render(teamInfo);
    
    // Write html to file
    fs.writeFile("teampage.html",t_html,() => {});
}

// Prompt the user for information to build the page
buildPage();

// Export the build page function
module.exports = buildPage;