const clean = equation => equation.filter((element => element !== null))

let operations = new Map();
operations.set("**", (lhs, rhs) => Number(lhs) ** Number(rhs));
operations.set("*", (lhs, rhs) => Number(lhs) * Number(rhs));
operations.set("/", (lhs, rhs) => Number(lhs) / Number(rhs));
operations.set("+", (lhs, rhs) => Number(lhs) + Number(rhs));
operations.set("-", (lhs, rhs) => Number(lhs) - Number(rhs));
operations.set("%", (lhs, rhs) => Number(lhs) % Number(rhs));

function resolve(string) {
  let equation = parse(string);
  if (equation) {
    equation = parentheses(equation);
    equation = detectMinusNumber(equation);
    equation = detectDoubleNegatives(equation);
    operations.forEach((v, k) => {
      try {
        equation = scanner(k, v, equation);
      } catch {
        equation = "Error";
        return;
      }
    });
  } 
  equation = String(equation[0]);
  return /[0-9]+/.test(equation) ? equation : 'Error';
  // return equation[0] === equation[0] ? equation[0] : 'Error'; // NaN != NaN
}

function parse(string) {
  return string.match(/\(.*\)|[0-9.]+|\*{2}|[-+*/%]/g);

  /* 
so what's going on here? Parse scans the input string and creates an array with four kinds of values, separated and prioritised by alternators:
1) First it looks for any sub-expressions within brackets. It works for nested brackets (i.e. matches according to the outside layer of brackets only) - I'm not sure why, maybe because regex is 'greedy'
2) second it looks for any substrings of 1 or more number characters
3) third it looks for any exponent signs **, i.e. two consecutive * symbols
4) fifth it looks for single-digits of any other operators

So if you feed it 5+-92*9**2*(9-2) you will get ["5", "+", "-", "92", "*", "9", "**", "2", "*", "(9-2)"]  
*/
}

function parentheses(equation) { 
    equation = equation.map(element => {
    if (element[0] === "(") {
      try {
        return resolve(element.slice(1, element.length -1));
      } catch {
        return 'Error';
      }
    // } else if (element[1] === "(") { 
    //   return Number("-" + resolve(element.slice(2, element.length - 1)));
    // commented out because program never encounters a negative parenthesis - it calculates them as normal parentheses, then in the next step realises that the result should be negative.
    } else {
      return element;
    }
  })
    return equation;
}

function detectMinusNumber(equation) {
  for(let i = 0; i < equation.length; i++) {
    if (equation[i] === '-') {
      if (equation[i - 1] === undefined || operators.includes(equation[i - 1])) {
        equation[i] += equation[i + 1];
        equation[i + 1] = null;
      }
    }
  }
  return clean(equation);
}

function detectDoubleNegatives(equation) {
  return equation.map((element) => { 
    return element.slice(0, 2) === "--" ? element.slice(2, element.length) : element;
  }) 
}

function scanner(operator, operation, equation) {
  for (let i = 0; i < equation.length; i++) {
    if (equation[i] === operator) {
      equation[i + 1] = operation(equation[i - 1], equation[i + 1]);
      equation[i] = null;
      equation[i - 1] = null;
    }
  }
  return clean(equation);
}