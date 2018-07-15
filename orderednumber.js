/**
 * Ordered number challenge PSL - NGColombia
 * Author: Cristian Múnera
*/

console.time('Executed in');

var fs = require('fs');
var path = require('path');
var inputFile = process.argv[2];
const encoding = 'ascii';

// If not inputFile provided, use 'entrada.txt' by default
inputFile = inputFile ? inputFile : 'entrada.txt';

console.time('File readed in');

// The process starts reading the file with the incoming data
fs.readFile(inputFile, encoding, (err, inputContent) => {
    console.timeEnd('File readed in');
    if (err) {
        console.error(`[Ordered Numbers] Error reading the file: ${inputFile}`);
        console.error(err);
        return;
    }

    console.time('Split incoming data in');
    const linesOfTheInputFile = getLinesOfFile(inputContent);
    console.timeEnd('Split incoming data in');
    // The first line of the file indicates the amount of data that should be processed
    const amountOfNumbersToCalculate = linesOfTheInputFile[0];
    var outputContent = '';   // Holds the content of the file that should be printed in the output file

    console.time('Ordered numbers calculated in');
    for(var currentInputNumberIndex = 1; currentInputNumberIndex <= amountOfNumbersToCalculate; currentInputNumberIndex++) {
        let currentInputNumber = safeLineRead(linesOfTheInputFile[currentInputNumberIndex]);
        let correspondingOrderedNumber = calculateCorrespondingOrderedNumber(currentInputNumber);
        outputContent += `Caso ${currentInputNumberIndex}: N=${currentInputNumber}, O=${correspondingOrderedNumber}\n`;
    }
    console.timeEnd('Ordered numbers calculated in');

    saveResults(outputContent);
});

/**
 * Reads a line in a safe way. The purpose is to avoid a possible automatic cast of the input as number
 * @param {string} line - The incomming line to be readed
 * @return {string} - Line readed as string
 */
function safeLineRead(line) {
    return ''+line;
}

/**
 * Returns an array of the lines of the file
 * @param {string} inputContent - The incomming content of the input file
 * @return {string[]} - Array of the lines of the incomming file
 */
function getLinesOfFile(inputContent) {
    return inputContent.split(/\n/);
}

/**
 * Stores the results of the calculated ordered numbers in a file called 'salida.txt'
 * The file will be saved in the same folder of the input file provided
 * @param {string} outputContent - The content of the results that will be saved in the file
 */
function saveResults(outputContent) {
    console.time('Results saved in');
    var outputFile = path.join(path.dirname(inputFile), 'salida.txt');
    fs.writeFile(outputFile, outputContent, encoding, (err) => {
        console.timeEnd('Results saved in');
        if (err) {
            console.error(`[Ordered Numbers] Error saving results in: ${outputFile}`);
            console.error(err);
            return;
        } else {
            console.log(`[Ordered Numbers] You can now check results in: ${outputFile}`);
            console.log('I hope that the result can take me to NGColombia!');
            console.log('Thanks for test this!');
            console.log('Cristian Múnera');
            console.timeEnd('Executed in');
            return;
        }
    });
}

/**
 * Calculates the ordered number that correspond to the provided number
 * @param {number} string - The input number used to calculate the ordered number
 * @return {number} - Corresponding ordered number
 */
function calculateCorrespondingOrderedNumber(number) {
    if (+number < 10) return number; // Number lest than 10 is actually an ordered number. Happy path!
    if (isNaN(number)) return '';

    var listOfDigits;               // The digits of the provided number
    var previousDigit = 0;          // Used to check the previoust digit (as number) against the current
    var currentDigit;               // Stores the current digit (as number) to be validated in the sequence
    var sequenceHasFailed = false;  // Flag to control when is necessary to fix the sequence of digits
    // If the previous digits are repeated and the sequence fails, we should start the fix from a previous point
    var previousDigitsRepeated = 0; 

    listOfDigits = convertNumberToArrayOfDigits(number);
    
    // Now, lets start the validation of the digits
    for (var currentDigitIndex = 0; currentDigitIndex < listOfDigits.length; currentDigitIndex++) {
        if (sequenceHasFailed) {
            // When the sequence has already fail, every next digit should be '9'
            listOfDigits[currentDigitIndex] = '9';
        } else {
            currentDigit = +listOfDigits[currentDigitIndex];
            sequenceHasFailed = sequenceShouldBeFixedFromHere(currentDigit, previousDigit);
            if (sequenceHasFailed) {
                // The fix starts reducing the first digit of repeated sequence in 1 and changing from the next repeated to 9
                listOfDigits[currentDigitIndex - (previousDigitsRepeated + 1)] = `${previousDigit - 1}`;
                // We should reset the index of iteration from the first repeated to fix from the first digit repeated
                currentDigitIndex = currentDigitIndex - previousDigitsRepeated;
                listOfDigits[currentDigitIndex] = '9';
            } else {
                // Stores the current digit to validate the next digit
                previousDigitsRepeated = calculatePreviousDigitsRepeated(currentDigit, previousDigit, previousDigitsRepeated);
                previousDigit = currentDigit;
            }
        }
    }
    return convertArrayOfDigitsToNumberString(listOfDigits);
}

/**
 * Calculates how many times the current digit is repeated compared with the previous
 * @param {number} currentDigit - Current evaluated digit
 * @param {number} previousDigit - Previous digit
 * @param {number} previousDigitsRepeated - Times that the previous digit is repeated until now
 * @return {number} - If repeated, increments the amount of times that the previous digit is repeated
 */
function calculatePreviousDigitsRepeated(currentDigit, previousDigit, previousDigitsRepeated) {
    return (currentDigit === previousDigit) ? previousDigitsRepeated + 1 : 0;
}

/**
 * Converts a number into an array of digits. Every digit is provided as string.
 * @param {number} number - The input number that should be converted into an array of digits
 * @return {string[]} - The array of digits
 */
function convertNumberToArrayOfDigits(number) {
    return (''+number).split('');
}

/**
 * Converts an array of digits into a number
 * @param {string[]} digits - The input array of digits that should be converted into a number
 * @return {number} - Number that corresponds to the array of digits
 */
function convertArrayOfDigitsToNumberString(digits) {
    return digits.join('');
}

/**
 * Determines if the sequence of digits should be fixed starting from the current and previous digits
 * @param {number} currentDigit - The current digit of the sequence
 * @param {number} previousDigit - The previous digit of the sequence
 * @return {number} - Result of the validation to start the fix of the sequence
 */
function sequenceShouldBeFixedFromHere(currentDigit, previousDigit) {
    return currentDigit < previousDigit;
}
