/** Michał Wójcik 2021 */
/**
 * L-System zaimplementowany w języku javascript z wykorzystaniem
 * HTML5 Canvas i turtle-graphics-js [https://www.npmjs.com/package/turtle-graphics-js]
 *
 * Program przyjmuje parametry przez pola tekstowe na stronie
 * a następnie rysuje po wciśnięciu przycisku "rysuj"
 *
 * Składnia reguł:
 * Znak:Wartosc_do_zamiany;Znak:Wartosc_do_zamiany;
 * Dowolna liczba reguł
 *
 * Operacje:
 *  - F - idź do przodu i rysuj
 *  - f - idź do przodu (nie rysuj)
 *  - + - obrót w prawo
 *  - - - obrót w lewo
 *  - [ - odłóż pozycję i rotację na stos
 *  - ] - zdejmij pozycję i rotację ze stosu
 *  - C - losuj nowy kolor
 *  - L - zwiększ długość rysowanej linii
 */

var stack = [];

var turtle = new Turtle(document.getElementById("canvas"));
turtle.pen.color = "#000";
turtle.pen.width = 2;
turtle.moveTo(400, 300);
var initLoc = JSON.parse(JSON.stringify(turtle.loc));

/**Attributes */

var lineLength = 1;
var rotation = 90;
var axiom = "";
var rules = "";
var iterations = 5;

/**DOM references */
var lengthInput = document.getElementById("length");
var rotationInput = document.getElementById("rotation");
var iterationsInput = document.getElementById("iterations");
var axiomInput = document.getElementById("axiom");
var rulesInput = document.getElementById("rules");
var drawButton = document.getElementById("drawButton");

var inter = null;

drawButton.addEventListener("click", () => {
  clearAll();
  drawLSystem();
});

/**Functions */
const drawLSystem = function () {
  getAttributes();
  let ruleObjectsArray = interpretRules(rules);
  axiom = applyRules(axiom, ruleObjectsArray, iterations);

  var i = 0;
  inter = setInterval(() => {
    if (i > axiom.length) {
      clearInterval(inter);
      return;
    }
    drawSign(axiom.charAt(i));
    i++;
  }, 6);
};

const getAttributes = function () {
  lineLength = lengthInput.value !== undefined ? lengthInput.value : lineLength;
  rotation = rotationInput.value !== undefined ? rotationInput.value : rotaion;
  iterations =
    iterationsInput.value !== undefined ? iterationsInput.value : iterations;
  axiom = axiomInput.value.length > 0 ? axiomInput.value : axiom;
  rules = rulesInput.value.length > 0 ? rulesInput.value : rules;
};

/**Rule structure:
 * {
 *  sign: string;
 *  value: string;
 * }
 */

const interpretRules = function (rules) {
  let ruleArray = rules.split(";");
  let ruleObjectsArray = ruleArray.map((ruleString) => {
    let arr = ruleString.split(":");
    return { sign: arr[0], value: arr[1] };
  });
  return ruleObjectsArray;
};

const applyRules = function (axiom, ruleObjectsArray, iterations) {
  let result = axiom;
  for (let i = 0; i < iterations; i++) {
    ruleObjectsArray.forEach((rule) => {
      result = result.replaceAll(rule.sign, rule.value);
    });
  }
  return result;
};

const drawSign = function (sign) {
  switch (sign) {
    case "F":
      turtle.penDown();
    case "f":
      turtle.forward(lineLength);
      turtle.penUp();
      break;

    case "+":
      turtle.right(rotation);
      break;

    case "-":
      turtle.left(rotation);
      break;

    case "[":
      stack.push(JSON.parse(JSON.stringify(turtle.loc)));
      break;

    case "]":
      let loc = stack.pop();
      turtle.loc = loc;
      break;
    case "C":
      turtle.pen.color = getRandomColor();
      break;
    case "L":
      lineLength++;
      break;
    default:
      break;
  }
  return;
};

const getRandomColor = function () {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

function clearAll() {
  clearInterval(inter);
  stack = [];
  turtle.moveTo(400, 300);
  turtle.angle = 0;
  turtle.pen.color = "#000";
  turtle.ctx.clearRect(
    0,
    0,
    canvas.width || canvas.style.width,
    canvas.height || canvas.style.height
  );
}
