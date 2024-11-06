const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .option('-i, --input <path>', 'input file path')
  .option('-o, --output <path>', 'output file path')
  .option('-d, --display', 'display output in console');

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error("Please, specify input file.");
  process.exit(1);
}

const inputFilePath = options.input;
let outputData = "";

try {
  const data = fs.readFileSync(inputFilePath, 'utf8');
  const formattedData = `[${data.replace(/}\s*{/g, '},{')}]`;
  const jsonData = JSON.parse(formattedData);

  const filteredValues = jsonData.flat().filter(item => item.ku === "13" && item.value > 5);

  if (filteredValues.length > 0) {
    outputData = "Filtered values (value > 5 and ku = 13):\n";
    filteredValues.forEach(item => {
      outputData += `ku: ${item.ku}, value: ${item.value}\n`;
    });
  } else {
    outputData = "No matching values found.\n";
  }

  if (options.display) {
    console.log(outputData);
  }

  if (options.output) {
    fs.writeFileSync(options.output, outputData, 'utf8');
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
