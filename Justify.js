/*Quick random number generator so I don't have to keep writing them*/
var Randomizer = function(min, max)
{
  return parseInt(Math.random() * (max - min) + min); //parseInt ensures an int return
}

/*Prints the reference numbers for testing purposes, works up to Justify('...', 9999), breaks with some word wrapping in output*/
var ReferenceNumbers = function(length)
{
  //print the ones place numbers
  for(var i = 1; i <= length; i++)
  {
    process.stdout.write('' + i % 10);
  }
  console.log('');	//newline
  
  //print the tens/hundreds/thousands place numbers, properly spaced
  for(var i = 1; i <= length / 10; i++)
  {
    if(i < 1001)
    {
      process.stdout.write(' ');
    }
    if(i < 101)
    {
      process.stdout.write(' ');
    }
    if(i < 11)
    {
      process.stdout.write(' ');
    }
    
    process.stdout.write('      ' + i);
  }
  console.log('');	//newline
}

var Justify = function(line, length)
{
  //if the string is already length, no more work is needed
  if(line.length == length)
    return line;
  //if the length is shorter than the string, throw an error
  else if(length < line.length)
  {
    return null;
  }
  
  var word          = line.split(' ');                        //Split the string into an array around " " (this causes strange behaviour around strings with more than one space in a row, but as far as I'm concerned, the output still lines up with expectation
  var totalWords    = word.length;                            //the number of words in the string
  var totalSpaces 	= totalWords - 1;                         //the number of spaces in the original string
  var characters    = line.length - totalSpaces;              //the number of non-space characters in the original string
  var difference    = length - characters;                    //the difference between the new justify position and the number of non-space characters (ie, the number of spaces that need inserted)
  var spacePerWord  = difference / totalSpaces;               //the number of spaces that need to be between each word
  var overflow      = spacePerWord - parseInt(spacePerWord);  //the decimal number of spaces per word, used for even distribution of spacing in non-clean cases
  spacePerWord      = parseInt(spacePerWord);                 //set spacePerWord to an int
  var extraSpaces   = Math.round(overflow * totalSpaces);     //how many uneven spaces need to be placed
  var frontSpaces   = parseInt(extraSpaces / 2);              //extra  spaces  to  be placed toward the front of the string
  var endSpaces     = frontSpaces;                            //extra spaces to be placed toward the end  of  the  string
  
  //if extraSpaces is odd, add one to frontSpaces to make up the difference
  if(extraSpaces % 2 != 0 && extraSpaces != 0)
  {
    frontSpaces++;
  }
      
  var jString = '';	//the string to build the justifed text into
  
  //return null if the string is empty (based on being split around ' ')
  if(totalWords < 1)
  {
    return null;
  }
  //if there is only one word, add all the required spaces on the front of the string, then concatenate the word last
  else if(totalWords === 1)
  {
    for(var i = 0; i < difference; i++)
    {
      jString += ' ';
    }
    jString += word[0];
    
    return jString;
  }

  //this loop puts the extra spaces in between words
  for(var i = 0, spacesRemaining = totalSpaces; i < totalSpaces; i++, spacesRemaining--)	//spacesRemaining = number of spaces left to insert leftovers into
  {
    jString += word[i];	//concatenate the next word
    for(var j = 0; j < spacePerWord; j++)	//add the spaces that will be between each word
    {
      jString += ' ';
      
      //if there are front spaces, insert them one at a time until none remain
      if(frontSpaces > 0)
      {
        jString += ' ';
        frontSpaces--;
      }
      //if there are end spaces, insert them one at a time
      if(endSpaces === spacesRemaining)
      {
        jString += ' ';
        endSpaces--;
      }
    }
  }
  jString += word[word.length - 1];	//add the last word
  
  return jString;	//return the string
}

/*Holds variables for tweaking testing*/
var StressTest = function()
{
  var numberOfTestsPer    = 1000;	//number of strings to test in each segement
  var numberOfLengthsPer  = 5;		//number of test lengths for each string
  var averageWordLength   = 5;		//sorta kinda determines average word length in generated strings
  var testLengthScalar    = 3;		//sets the max for test lengths to (string.length() * testLengthScalar)
  
  var stats = [0, 0, 0];	//[totalTests, passes, fails]
  
  //make sure none of these is smaller than one it needs to be bigger than
  var shortStringMin	= 10;		//minimum length of short string tests, try not to set < 1
  var shortStringMax	= 25;		//max of short, min-1 of med
  var medStringMax		= 100;	//max of med, min-1 of long
  var longStringMax		= 1000;	//max of long
  var fewSpaceMin			= 1;		//minimum spaces in few space tests, try not to set < 1
  var fewSpaceMax			= 4;		//max of few, min-1 of some
  var someSpaceMax		= 10;		//max of some, min-1 of many
  var manySpaceMax		= 50;		//max of many
  
  /*SHORT STRINGS******************************************************************************/
  console.log('Short string tests (' + shortStringMin + '-' + shortStringMax + ')');
  
  stats = TestLengths(numberOfTestsPer, shortStringMin, shortStringMax, averageWordLength, numberOfLengthsPer, testLengthScalar, stats);
  
  /*MEDIUM STRINGS*****************************************************************************/
  console.log('Medium string tests (' + (shortStringMax + 1) + '-' + medStringMax + ')');
  
  stats = TestLengths(numberOfTestsPer, shortStringMax + 1, medStringMax, averageWordLength, numberOfLengthsPer, testLengthScalar, stats);
  
  /*LONG STRINGS*******************************************************************************/
  console.log('Long string tests (' + (medStringMax + 1) + '-' + longStringMax + ')');
  
  stats = TestLengths(numberOfTestsPer, medStringMax + 1, longStringMax, averageWordLength, numberOfLengthsPer, testLengthScalar, stats);
  
  /*FEW SPACES*********************************************************************************/
  console.log('Few space tests (' + fewSpaceMin + '-' + fewSpaceMax + ')');
  
  stats = TestSpaces(numberOfTestsPer, fewSpaceMin, fewSpaceMax, averageWordLength, numberOfLengthsPer, testLengthScalar, stats);
  
  /*SOME SPACES********************************************************************************/
  console.log('Some space tests (' + (fewSpaceMax + 1) + '-' + someSpaceMax + ')');
  
  stats = TestSpaces(numberOfTestsPer, fewSpaceMax + 1, someSpaceMax, averageWordLength, numberOfLengthsPer, testLengthScalar, stats);
  
  /*MANY SPACES********************************************************************************/
  console.log('Many space tests (' + (someSpaceMax + 1) + '-' + manySpaceMax + ')');
  
  stats = TestSpaces(numberOfTestsPer, someSpaceMax + 1, manySpaceMax, averageWordLength, numberOfLengthsPer, testLengthScalar, stats);
  
  //FINAL STATS//
  console.log('\n' + stats[1] + '/' + stats[0] + ' passed.');
  console.log(stats[2] + '/' + stats[0] + ' failed.');
}

/*Tests revolving around generated string length are here*/
var TestLengths = function(numberOfTestsPer, minLength, maxLength, averageWordLength, numberOfLengthsPer, testLengthScalar, stats)
{
  var testString = '';        //test string to be generated
  var testStringLength;       //the length of that string (after generation)
  var justifiedString = '';   //the justified test string
  var justifiedStringLength;  //it's length after generation
  
  var randStringLength; //will hold randomized length of string to generate
  var randLength;       //used for generating random word lengths, then the randomized test length for Justify
  
  var run	  = 0;  //total segment tests
  var pass	= 0;  //total segment successes
  var fail	= 0;  //total segment failures
  
  for(var i = 0; i < numberOfTestsPer; i++)
  {
    //randomizes the length of the string
    randStringLength = Randomizer(minLength, maxLength); 
    testString = 'A';	//adds an 'A ' at the start of the string
    
    //generates a string of 'rand' length
    //j starts at 3 because every string will start with an 'A' + ' ' and end with a ';'
    for(var j = 3; j < randStringLength; j++)
    {
      randLength = Randomizer(0, averageWordLength); //~1 in 6 chance for space
      
      //
      if(randLength === 0)
      {
        testString += ' a';
        j++;	//because 2 letters were concatonated this time to ensure no double spaces
      }
      else
      {
        testString += 'a';
      }
    }
    testString += ';';	//ends the string with ';'
    testStringLength = testString.length;	//store the length for debugging
    
    //test that string numberOfLengthsPer times with randomized lengths
    for(var j = 0; j < numberOfLengthsPer; j++)
    {
      //the randomized test length
      randLength = parseInt(Randomizer(testStringLength + 1, testStringLength * testLengthScalar));
      
      //keeping track of tests run
      run++;
      stats[0]++;
      
      //justify and store the string, and get it's length
      justifiedString = Justify(testString, randLength);
      justifiedStringLength = justifiedString.length;
      
      //if the length matches the test length
      if(justifiedStringLength === randLength)
      {
        // incriment successes
        pass++;
        stats[1]++;
      }
      else
      {
        // otherwise print out the failed strings for review
        console.log('Failed:\n' + testString);
        
        console.log('Justified:\n' + justifiedString);
        ReferenceNumbers(randLength);
        
        console.log('Length:  ' + justifiedStringLength);
        
        console.log('TestLen: ' + randLength);
        //and incriment failures
        fail++;
        stats[2]++;
      }
    }
  }
  //print out successes and failures for the run
  console.log(pass + '/' + run + ' passed.');
  console.log(fail + '/' + run + ' failed.');
  return stats;
}

/*Tests revolving around space count are here*/
var TestSpaces = function(numberOfTestsPer, minLength, maxLength, averageWordLength, numberOfLengthsPer, testLengthScalar, stats)
{
  var testString = '';        //test string to be generated
  var testStringLength;       //the length of that string (after generation)
  var justifiedString = '';   //the justified test string
  var justifiedStringLength;  //it's length after generation
  
  var randSpaceCnt; //will hold string with randomized number of spaces
  var randLength;   //used for generating random word lengths, then the randomized test length for Justify
  
  var run	  = 0;  //total segment tests
  var pass	= 0;  //total segment successes
  var fail	= 0;  //total segment failures
  
  for(var i = 0; i < numberOfTestsPer; i++)
  {
    //randomizes the length of the string
    randSpaceCnt	= Randomizer(minLength, maxLength); 
    testString		= 'A';	//adds an 'A' at the start of the string
    
    //generates a string of 'rand' length
    //
    for(var spcs = 0; spcs < randSpaceCnt; spcs)
    {
      randLength = Randomizer(0, averageWordLength); //~1 in 5 chance for space
      
      //
      if(randLength === 0)
      {
        testString += ' a';
        spcs++;	//incriment here when we add a space
      }
      else
      {
        testString += 'a';
      }
    }
    testString += ';';	//ends the string with ';'
    testStringLength = testString.length;	//store the length for debugging
    //test that string numberOfLengthsPer times with randomized lengths
    for(var j = 0; j < numberOfLengthsPer; j++)
    {
      //the randomized test length
      randLength = parseInt(Randomizer(testStringLength + 1, testStringLength * testLengthScalar));
      
      //keeping track of tests run
      run++;
      stats[0]++;
      
      //justify and store the string, and get it's length
      justifiedString = Justify(testString, randLength);
      justifiedStringLength = justifiedString.length;
      
      //if the length matches the test length
      if(justifiedStringLength = randLength)
      {
        // incriment successes
        pass++;
        stats[1]++;
      }
      else
      {
        // otherwise print out the failed strings for review
    
        console.log('Failed:\n' + testString);
        
        console.log('Justified:\n' + justifiedString);
        ReferenceNumbers(randLength);
        
        console.log('Length:  ' + justifiedStringLength);
        
        console.log('TestLen: ' + randLength);
        //and incriment failures
        fail++;
        stats[2]++;
      }
    }
  }
  //print out successes and failures for the run
  console.log(pass + '/' + run + ' passed.');
  console.log(fail + '/' + run + ' failed.');
  return stats;
}

var main = function()
{
  /*Manual test interface*/
  
  var textToJustify;		//to hold user-input text
  var textToJustifyLength;	//length of the above
  var justifyPosition;		//how long to justify the string to
  var justifiedText;		//the output text
  
  //read text in using a scanner, then store its length
  /*
  console.log('Enter a string to justify: ');
  Scanner scanner = new Scanner(System.in);
  textToJustify = scanner.nextLine();
  textToJustifyLength = textToJustify.length();

  //if the string is empty, inform the user and get a new one
  while(textToJustifyLength <= 0)
  {
    console.log('That is an empty string. Please enter a non-empty string: ');
    textToJustify = scanner.nextLine();
    textToJustifyLength = textToJustify.length();
  }
  
  //get the length to justify the string to
  console.log('Good. The length of that string is ' + textToJustifyLength + '. Please enter a number greater than ' + textToJustifyLength + ':');
  justifyPosition = scanner.nextInt();
  
  //if the justify position isn't bigger than the length of the original string, inform the user and get a new one
  while(justifyPosition <= textToJustifyLength)
  {
    console.log(justifyPosition +' is not greater than ' + textToJustifyLength + '. Please enter a number greater than ' + textToJustifyLength + ':');
    justifyPosition = scanner.nextInt();
  }
  */
  /*var tempString = 'The quick brown fox jumps over the lazy dog.';
  var tempPosition = 46;
  textToJustify = tempString;
  justifyPosition = tempPosition;

  //get the justified text
  justifiedText = Justify(textToJustify, justifyPosition);

  //print out the originial string and the justified (with numbered counter) for comparison
  
  console.log('The original string is:');
  console.log(textToJustify);
  console.log('The justified string is:');
  console.log(justifiedText);
  ReferenceNumbers(justifyPosition);*/
  
  
  /*use this for stress testing with variable settings*/
  StressTest();
}

main();