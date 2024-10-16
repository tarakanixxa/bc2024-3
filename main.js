const fs = require('fs');
const { Command } = require('commander');

const program = new Command();

program
  .option('-i, --input <path>', 'input file path');

program.parse(process.argv);

const options = program.opts();


if (!options.input) {
  console.error("Please, specify input file.");
  process.exit(1);
}

const inputFilePath = options.input;

try {

  const data = fs.readFileSync(inputFilePath, 'utf8');


  const formattedData = `[${data.replace(/}\s*{/g, '},{')}]`; 


  const jsonData = JSON.parse(formattedData);
  

  console.log("Data loaded from JSON:");
  jsonData.flat().forEach(item => {
    console.log(`ku: ${item.ku}, value: ${item.value}`);
  });


  const filteredValues = jsonData.flat().filter(item => item.ku === "13" && item.value > 5);


  const outputValues = filteredValues.map(item => item.value);

 
  if (outputValues.length > 0) {
    console.log("Filtered values (value > 5 and ku = 13):");
    outputValues.forEach(value => console.log(value));
  } else {
    console.log("No matching values found.");
  }

} catch (err) {

  if (err.code === 'ENOENT') {
    console.error("Cannot find input file.");
  } else if (err instanceof SyntaxError) {
    console.error("Error parsing JSON:", err.message);
  } else {
    console.error("Error reading input file:", err.message);
  }
}
