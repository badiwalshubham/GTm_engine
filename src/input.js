const readline = require('readline');
const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

reader.question("Enter the Input spreadsheet link : ", link1 => {
    console.log(`Input spreadsheet link is : ${link1}`);
    
    reader.question("Enter the Output spreadsheet link : ", link2 => {
        console.log(`Output spreadsheet link is : ${link2}`);
        reader.close();
    });
});

