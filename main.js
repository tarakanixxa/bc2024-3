const fs = require('fs');
const { Command } = require('commander');

const program = new Command();

program
  .option('-i, --input <path>', 'input file path');

program.parse(process.argv);

const options = program.opts();

// Перевірка, чи заданий файл введення
if (!options.input) {
  console.error("Please, specify input file.");
  process.exit(1);
}

const inputFilePath = options.input;

try {
  // Зчитування вмісту файлу
  const data = fs.readFileSync(inputFilePath, 'utf8');

  // Форматування даних: спроба конвертувати в JSON
  const formattedData = `[${data.replace(/}\s*{/g, '},{')}]`; // Додаємо коми між об'єктами

  // Парсинг даних у JSON
  const jsonData = JSON.parse(formattedData);
  
  // Виведення для діагностики
  console.log("Data loaded from JSON:");
  jsonData.flat().forEach(item => {
    console.log(`ku: ${item.ku}, value: ${item.value}`);
  });

  // Фільтрування даних за умовами
  const filteredValues = jsonData.flat().filter(item => item.ku === "13" && item.value > 5);

  // Виведення лише значень поля value
  const outputValues = filteredValues.map(item => item.value);

  // Виведення результату в консоль
  if (outputValues.length > 0) {
    console.log("Filtered values (value > 5 and ku = 13):");
    outputValues.forEach(value => console.log(value));
  } else {
    console.log("No matching values found.");
  }

} catch (err) {
  // Обробка помилок
  if (err.code === 'ENOENT') {
    console.error("Cannot find input file.");
  } else if (err instanceof SyntaxError) {
    console.error("Error parsing JSON:", err.message);
  } else {
    console.error("Error reading input file:", err.message);
  }
}
