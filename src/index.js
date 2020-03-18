function eval() {
  // Do not use eval!!!
  return
}

function expressionCalculator(expr) {
  //    убираю все пробелы
  let reg = /\s/g
  let expression = expr.replace(reg, '')

  let openBracket = 0
  let closeBracket = 0
  let action = []
  let number = ''
  let result = 0
  //    запись строки в массив с учетом десятых, сотых и т.д. чисел:
  //    т.е. строка '(11+68)'  станет как [ '(', '11', '+', '68', ')']
  for (let i = 0; i < expression.length; i++) {
    //    подсчет скобок
    if (expression[i] === '(') {
      if (number === '') {
        action.push(expression[i])
        openBracket++
        continue
      } else {
        action.push(number)
        number = ''
        action.push(expression[i])
        openBracket++
        continue
      }
    } else if (expression[i] === ')') {
      if (number === '') {
        action.push(expression[i])
        closeBracket++
        continue
      } else {
        action.push(number)
        number = ''
        action.push(expression[i])
        closeBracket++
        continue
      }
    }

    if (
      expression[i] === '+' ||
      expression[i] === '-' ||
      expression[i] === '*' ||
      expression[i] === '/'
    ) {
      if (number === '') {
        action.push(expression[i])
        continue
      } else {
        action.push(number)
        number = ''
        action.push(expression[i])
        continue
      }
    }
    number += expression[i]
  }

  if (number !== '') {
    action.push(number)
  }

  //    ессли '(' и ')' скобоки не равны вызвать ExpressionError
  if (openBracket !== closeBracket) {
    throw 'ExpressionError: Brackets must be paired'
  }

  //    самое глубокое вхождение скобок - их подсчет, пока скобки не закончатся
  if (action.lastIndexOf('(') !== -1) {
    while (action.lastIndexOf('(') !== -1) {
      for (let i = action.lastIndexOf('('); i < action.indexOf(')', i); i++) {
        // первые действия в скобках - деление и умножение
        if (action[i] === '/') {
          // при делени на 0, вызвать TypeError
          if (+action[i + 1] === 0) {
            throw 'TypeError: Division by zero.'
          }
          // результат деления
          result = +action[i - 1] / +action[i + 1]
          // заменяю числа которые делил со знаком деления, на результат деления    ['6', '/', '3'] => [2]
          action.splice(i - 1, 3, result)
          i--
        } else if (action[i] === '*') {
          // результат произведения
          result = action[i - 1] * action[i + 1]
          // заменяю числа которые умножал со знаком произведения, на результат произведения [n..., '6', '*', '3',...n] => [n..., 18, ...n]
          action.splice(i - 1, 3, result)
          i--
        }
      }
      // второстепенные действия в скобках - сложение и вычитание, с последующей заменой этих элементов на результат
      for (let i = action.lastIndexOf('('); i < action.indexOf(')', i); i++) {
        if (action[i] === '+') {
          result = +action[i - 1] + +action[i + 1]
          action.splice(i - 1, 3, result)
          i--
        } else if (action[i] === '-') {
          result = action[i - 1] - action[i + 1]
          action.splice(i - 1, 3, result)
          i--
        }
      }

      let item = action.lastIndexOf('(')
      // если в скобках осталось одно число - удаляем скобки слева и справа числа.
      if (action.lastIndexOf('(') === action.indexOf(')', item) - 2) {
        action.splice(action.lastIndexOf('('), 1)
        action.splice(action.indexOf(')', item), 1)
      }
    }
  }
  //   деление и произведение чисел когда не осталось скобок или если их небыло
  for (let i = 0; i < action.length; i++) {
    if (action[i] === '/') {
      if (+action[i + 1] === 0) {
        throw 'TypeError: Division by zero.'
      }
      result = +action[i - 1] / +action[i + 1]
      action.splice(i - 1, 3, result)
      i--
    } else if (action[i] === '*') {
      result = action[i - 1] * action[i + 1]
      action.splice(i - 1, 3, result)
      i--
    }
  }

  for (let i = 0; i < action.length; i++) {
    if (action[i] === '+') {
      result = +action[i - 1] + +action[i + 1]
      action.splice(i - 1, 3, result)
      i--
    } else if (action[i] === '-') {
      result = action[i - 1] - action[i + 1]
      action.splice(i - 1, 3, result)
      i--
    }
  }
  return result
}

module.exports = {
  expressionCalculator,
}
