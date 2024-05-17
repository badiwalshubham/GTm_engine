const readline = require('readline');

const Reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let link1Data, link2Data;

const getInputLinks = () => {
    return new Promise((resolve, reject) => {
        Reader.question("Enter the Input spreadsheet link : ", link1 => {
            link1Data = link1;
            resolve();
        });
    });
};

const getOutputLinks = () => {
    return new Promise((resolve, reject) => {
        Reader.question("Enter the Output spreadsheet link : ", link2 => {
            link2Data = link2;
            resolve();
        });
    });
};

const exportData = () => {
    return { link1: link1Data, link2: link2Data };
};

const run = async () => {
    await getInputLinks();
    await getOutputLinks();

    console.log("Input and output links captured successfully.");
    Reader.close();
};

run();

module.exports = { Reader, getInputLinks, getOutputLinks, exportData };
