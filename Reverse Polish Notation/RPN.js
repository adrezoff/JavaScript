function RPN () {
    var FSO = new ActiveXObject("Scripting.FileSystemObject");
    f = FSO.OpenTextFile("RPN.txt", 1);
    var fileContent = f.ReadAll()
    f.close();
    var exp = fileContent.split(/[\n\r]/)[0].split('') // создания выражения

    var operation = { // операции
        '-': 0,
        '+': 0,
        '*': 1,
        '/': 1
    }

    var variable = {} // словарь - переменные и их значения
    var mass_len = fileContent.split(/[\n\r]/).length
    for (var i = 1; i < mass_len; i++) {
        var mass = fileContent.split(/[\n\r]/)[i].split(/\s/)
        variable[mass[0]] = mass[2]
    }
    var stack = new Array() // стек
    var rez = new Array()
    var len = exp.length
    var skobki = false //указатель на откытую скобку
    var flag = false

//--------строим ОПН выражения-----------

    for (var i = 0; i < len; i++) {
        if (exp[i] in variable) {
            rez.push(exp[i])
        }
        if (exp[i] == '(') {
            stack.push(exp[i])
            skobki = true
        }
        if (exp[i] == ')') {
            var indexstack = stack.length - 1
            for (; indexstack >= 0 && stack[indexstack] != '('; indexstack--) {
                rez.push(stack[indexstack])
                stack.pop()
            }
            if (indexstack < 0) {
                WSH.Echo("syntax error")
                return 0;
            }
            if (stack[indexstack] == '(') {
                stack.pop()
                skobki = false
            }
        }
        if (exp[i] in operation) { //если знак операции
            var lenstack = stack.length
            if (lenstack == 0) {
                stack.push(exp[i])
            } else if (operation[exp[i]] > operation[stack[lenstack - 1]]) { //если в стеке лежит меньше чем данный в выражении
                stack.push(exp[i])
            } else if (operation[exp[i]] <= operation[stack[lenstack - 1]] && !skobki) { //если в стеке больший или равный, при этом нету открытой скобки перед данной операцией
                while (operation[exp[i]] <= operation[stack[lenstack - 1]]) {
                    rez.push(stack[lenstack - 1])
                    stack.pop()
                }
                stack.push(exp[i])
            } else { // если есть открытая скобка, то сразу в стек
                stack.push(exp[i])
                skobki = false
            }
        }
        if (i == len - 1) { //если выражение закончилось, всё что в стеке в результат
            var lenstack1 = stack.length - 1
            for (var l = lenstack1; l >= 0; l--) {
                if  (stack[l] != '(') {
                    rez.push(stack[l])
                    stack.pop()
                }
                else{
                    WSH.Echo("syntax error")
                    flag = true;
                    break;
                }
            }
        }

    }
    if (!flag) {
        WSH.Echo(exp.join(''))
        WSH.Echo(rez.join(' '))
    }
//---------обратно-----------
    var rez_len = rez.length
    var stack = []
    for (var i = 0; i < rez_len && !flag; i++) {
        if (rez[i] in variable) {
            stack.push(rez[i])
        }
        if (rez[i] in operation) { // разные ситуации
            var stack_len = stack.length - 1
            var vremeno = []
            if (stack[stack_len - 1].split('').length > 1 && stack[stack_len].split('').length > 1 && operation[rez[i]] > 0) { // если два операнда - скобки
                vremeno.unshift(')')
                vremeno.unshift(stack[stack_len])
                vremeno.unshift('(')
                vremeno.unshift(rez[i])
                vremeno.unshift(')')
                vremeno.unshift(stack[stack_len - 1])
                vremeno.unshift('(')
                stack.pop()
                stack.pop()
                stack.push(vremeno.join(''))
            } else if (stack[stack_len - 1].split('').length > 1 && stack[stack_len].split('').length == 1 && operation[rez[i]] > 0) { // если скобка и переменная
                vremeno.unshift(stack[stack_len])
                vremeno.unshift(rez[i])
                vremeno.unshift(')')
                vremeno.unshift(stack[stack_len - 1])
                vremeno.unshift('(')
                stack.pop()
                stack.pop()
                stack.push(vremeno.join(''))
            } else if (stack[stack_len - 1].split('').length == 1 && stack[stack_len].split('').length > 1 && operation[rez[i]] > 0) {// если переменная и скобка
                vremeno.unshift(')')
                vremeno.unshift(stack[stack_len])
                vremeno.unshift('(')
                vremeno.unshift(rez[i])
                vremeno.unshift(stack[stack_len - 1])
                stack.pop()
                stack.pop()
                stack.push(vremeno.join(''))
            } else { // обе переменные
                vremeno.unshift(stack[stack_len])
                vremeno.unshift(rez[i])
                vremeno.unshift(stack[stack_len - 1])
                stack.pop()
                stack.pop()
                stack.push(vremeno.join(''))
            }
        }
        if (i == rez_len - 1) // всё что в стеке всё, в реузльтат
            WSH.Echo(stack);
    }
//-------считаем ответ--------
    var stack_otvet = []
    for (var i = 0; i < rez_len && !flag; i++) {
        if (rez[i] in variable) {
            stack_otvet.push(variable[rez[i]])
        }
        if (rez[i] in operation) {
            var stack_otvet_len = stack_otvet.length - 1
            if (rez[i] == '/' && stack_otvet[stack_otvet_len] == 0) {
                WSH.Echo("division by zero")
                break
            }
            var vremeno = 0
            vremeno = eval(stack_otvet[stack_otvet_len - 1].toString() + rez[i].toString() + stack_otvet[stack_otvet_len].toString())
            stack_otvet.pop()
            stack_otvet.pop()
            stack_otvet.push(vremeno)
        }
        if (i == rez_len - 1)
            WSH.Echo(stack_otvet);
    }
}
RPN()