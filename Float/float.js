function toBin(number) { // представление числа в бинарном виде, два случая: целое и целое+дробное
    var num = Number(number)
    if ((num - Math.floor(num)) == 0) { // целое
        var binary = new Array()
        if (num == 0) binary[0] = 0;
        for (var i = 0; num > 0 && i < 129; i++) {
            binary[i] = num % 2;
            num = Math.floor(num / 2);
        }
        return (binary.reverse().join('')+".00000000000000000000000")
    }
    if ((num - Math.floor(num)) > 0) { // целое + дробное
        var numCeil = Math.floor(num)
        var binaryCeil = new Array()

        if (numCeil == 0) binaryCeil[0] = 0;
        for (var i = 0; numCeil > 0 && i < 129; i++) {
            binaryCeil[i] = numCeil % 2;
            numCeil = Math.floor(numCeil / 2);
        }

        var numFract = num - Math.floor(num)
        var binaryFract = new Array()
        var j = 0

        while (numFract > 0 && j < 215 && numFract != 1) {
            numFract = numFract * 2
            if (numFract >= 1) {
                numFract = numFract - 1;
                binaryFract[j++] = 1;
            }
            else{
                binaryFract[j++] = 0;
            }
        }
        return (binaryCeil.reverse().join('') + '.' + binaryFract.join(''))
    }
}
//--------------Представление порядка в бинарке------------
function toBinPoradok(number) {// представление порядка в бинарном виде (с незначащими нулями)
    var num = Number(number)
    var binary = new Array()
    if (num == 0) binary[0] = 0;
    for (var i = 0; num > 0 && i < 8; i++) {
        binary[i] = num % 2;
        num = Math.floor(num / 2);
    }
    if (binary.length < 8){
        for (var i = binary.length; i < 8; i++)
            binary[i] = 0
    }
    return binary.reverse().join('')
}
//--------------Перевод из бинарного вида в десятичный------------
function toDec(number){ // перевод в из bin в dec
    var dec = 0
    if (Number(number.split('.')[1]) == 0) {
        var rez = 0;
        var c = (number.split('.')[0]).split('')
        var clen = c.length
        for (var n = 0; n < clen; n++) {
            rez += Math.pow(2, clen - n - 1) * Number(c[n])
        }
        return rez;
    }
        else {
        var a = Math.floor(Number(number))
        var b = (number.toString().split('.')[1]).split('')
        for (var x = 0; x < b.length; x++){
            dec += (1/Math.pow(2, x+1)) * Number(b[x]);
        }
        var rez = 0;
        var c = (number.split('.')[0]).split('')
        var clen = c.length
        for (var n = 0; n < clen; n++) {
            rez += Math.pow(2, clen - n - 1) * Number(c[n])
        }
    }
    return (rez + dec)
}
//--------------Основная часть кода переводящая число в формат с плавающей точкой------------
function IEEE754 (){
    var b = WSH.StdIn.ReadLine()
    if (isNaN(b) == true) { // Проверка на isNaN
        var znak = 0;
        if (b.toString().split('')[0] == '-') {
            znak = 1
        }
        return znak.toString() + " 11111111 11110000000000000000000"
    }
    var znak = 0;
    if (b.toString().split('')[0] == '-') { // представление бита знака
        znak = 1
        b = b.substring(1, b.length)
    }

    var binNumber = toBin(b)
    if (Number(binNumber.split('.')[0]) != 0){ // представление числа в Q больше 1
        var mantis = new Array(23)
        var p = binNumber.split('.')[0].split('').length - 1
        var i = 1

        if (p + 127 < 255){
            for (; (i <= p+1) && (i-1 < 23); i++) // сдвиг цифр со 2 по последнюю позицию в целой части числа, в матнтису
                mantis[i-1] = (binNumber.split('.')[0]).split('')[i];

            if (i-1 < 23){ // дописывание дробной части числа в мантису после сдвига целой части
                for (var j = 0; (i-1 + j) < 24; j++)
                    mantis[i-1 + j] = (binNumber.split('.')[1]).split('')[j]
            }
            if (mantis.join('').split('').length < 23){ // дописывание нулей
                for (var j = i; (i-1 + j) < 24; j++)
                    mantis[j] = 0
            }
        }
        else { // заполнение мантисы нулями
            for (var l = 0; l < 24; l++)
                mantis[l] = 0
        }

        if (p >= 127) p = 128; // eсли при построенни числа, порядок вышел за пределы

        var poradok = toBinPoradok(127 + p)// представлние порядка в бинарке
        return (znak.toString() + " " + poradok + " " + mantis.join(''));
    }
    if (Number(binNumber.split('.')[0]) == 0){ // нормализация числа от 0 до 1
        var mantis = new Array(23)
        var p = 0

        if (Number(binNumber.split('.')[1]) != 0 ) { // если дробная часть числа в бинарке не ровна нулю
            for (; p < 127 && (binNumber.split('.')[1]).split('')[p] != 1; p++) ; // счёт порядка
            for (var j = p + 1; j < p + 24; j++) {
                mantis[j - p] = (binNumber.split('.')[1]).split('')[j]
            }
        }
        if (Number(binNumber.split('.')[0]) == 0 && Number(binNumber.split('.')[1]) == 0){ // если дробная часть ровна нулю и число на интервале от 0 до 1
            p = 126
            for (var l = 0; l < 23; l++) mantis[l] = 0;
        }
        var poradok = toBinPoradok(126 - p)

        return (znak.toString() + " " + poradok + " " + mantis.join(''));
    }

}
//--------------Перевод из числа с плавающей точкой в число в дестичной СС------------
function fromFloat(str) { // перевод из числа с плавающей точкой, в рациональное предстваление в 10чной СС
    var float = str;
    var poradok = float.split(' ')[1]
    var mantis = float.split(' ')[2].split('')
    var znak = float.split(' ')[0]


    var backP = Math.abs(parseInt(Number(poradok), 2))
    if (backP >= 127 && backP < 255) { // числа на полуинтервале от (+\-) 1 до (+\-) infinity, с дробными частями
        backP1 = Math.abs(127 - backP)

        var cnt = 0;
        rez = "1" // вынесение скртого бита в ответ
        for (var j = 0; j < backP1 && j < 23; j++) { // раскрытие мантисы в целую часть бинарного числа
            rez = rez + mantis[j].toString();
            mantis.push(0)
            cnt += 1
        }

        for (var j = 0; j < backP1; j++) { // отчистка мантисы от вынесеных цифр
            mantis.shift();
        }
        for (var j = 0; j < backP1 - cnt; j++) { // если мантиса закончилась, а порядок > 127, дабы сохранить примерное число, заменяем 0-ми
            rez = rez + '0'
        }
        return(Math.pow(-1, znak) * toDec(rez.toString() + "." + mantis.join('')))
    }
    if (backP <= 126 && backP > 0) { // числа на поулинтервале от 0 до 1
        backP1 = Math.abs(126 - backP)
        mantis.unshift(1) // вынесение секретного бита в ответ
        for (var m = 0; m < backP1; m++) { // добавление нулей т.к. подяок < 126
            mantis.unshift(0)
        }
        return(Math.pow(-1, znak) * Number(toDec("0." + mantis.join(''))))
    }
    if (backP == 0 && Number(mantis.join('')) != 0) { // близкие к нулю
        for (var m = 0; m < 128; m++) { // добавление нулей т.к. подяок < 126
            mantis.unshift(0)
        }
        return(Math.pow(-1, znak) * Number(toDec("0." + mantis.join(''))))
    }

    if (backP > 254 && Number(mantis.join('')) == 0) { // (+/-) бесконечности
        if (znak == 1) return('-infinity')
        else return('+infinity')
    }
    if (backP <= 0 && Number(mantis.join('')) == 0) { // (+/-) нули
        if (znak == 1) return('-0');
        else return('+0');
    }
    if (backP > 254 && Number(mantis.join('')) > 0) { // (+/-) Nan
        if (znak == 1) return('-NaN');
        else return ('+NaN');
    }
}
//--------------Сумма двух чисел с плавающей точкой и пеевод результата в десятичную СС------------
function SumFloat(){ // сумма двух чисел в формале с плавающей точкой

    var x = IEEE754().split(' ')
    var y = IEEE754().split(' ')
    WSH.Echo(x.join(' ') + "\n" + y.join(' '))

    if (Math.abs(fromFloat(x.join(' '))) < Math.abs(fromFloat(y.join(' ')))){ // x >= y ПО МОДУЛЮ ОБА ЧИСЛА, для быстродействия арифметики
        var g = x;
        x = y;
        y = g;
    }
// проверка на случаи с денормализоваными числами
    if (fromFloat(x.join(' ')) == "+infinity" || fromFloat(y.join(' ')) == "+infinity"){
        return("+infinity")
    }
    if (fromFloat(x.join(' ')) == "-infinity" || fromFloat(y.join(' ')) == "-infinity"){
        return("-infinity")
    }
    if (fromFloat(x.join(' ')) == "-NaN" || fromFloat(y.join(' ')) == "-NaN"){
        return("-Nan")
    }
    if (fromFloat(x.join(' ')) == "+NaN" || fromFloat(y.join(' ')) == "+NaN"){
        return("+Nan")
    }
    if ((fromFloat(x.join(' ')) == "+0" && fromFloat(y.join(' ')) == "-0") || (fromFloat(x.join(' ')) == "-0" && fromFloat(y.join(' ')) == "+0")) {
        return("0")
    }
    if ((fromFloat(x.join(' ')) == "-0" && fromFloat(y.join(' ')) == "-0") || (fromFloat(x.join(' ')) == "+0" && fromFloat(y.join(' ')) == "+0")){
        return(fromFloat(x.join(' ')))
    }

    if (x[0] == y[0]){ // если знак одинаковый, то сумма
        var otvet = ""
        var mantisx = x[2].split('')
        var mantisy = y[2].split('')
        var zamopnit = 0;

        mantisy.unshift(1) // дабовляем незначащий бит в арифиметику
        mantisx.unshift(1)

        correct = Number(toDec(x[1].toString() + ".0")) - Number(toDec(y[1].toString() + ".0")) //находим разницу порядком x и y (x >= y)
        for (var h = 0; h < correct; h++) { // корректируем мантису числа y
            mantisy.pop()
            mantisy.unshift(0)
        }

        for (var c = 23; c >= 0 ; c--){ // побитовая арифметика сложения
            if (Number(mantisx[c]) + Number(mantisy[c]) + zamopnit == 2) {
                otvet = "0" + otvet
                zamopnit = 1
            }
            else if (Number(mantisx[c]) + Number(mantisy[c]) + zamopnit == 3) {
                otvet = "1" + otvet
                zamopnit = 1
            }
            else if (Number(mantisx[c]) + Number(mantisy[c]) + zamopnit < 2){
                otvet = (Number(mantisx[c]) + Number(mantisy[c]) + zamopnit).toString() + otvet
                zamopnit = 0

            }
        }
        var correctP;
        if(zamopnit == 0) { // если после арифметики НЕ осталось число в "уме"
            correctP = toBinPoradok(Number(toDec(x[1].toString() + ".0"))).toString()
        }
        else { // если после арифметики осталось число в "уме"
            otvet = zamopnit.toString() + otvet
            correctP = toBinPoradok(Number(toDec(x[1].toString() + ".0")) + 1).toString()
        }
        otvet = otvet.substring(1,24)
        return((x[0].toString() + " " + correctP + " " + otvet) + '\n' + (fromFloat(x[0].toString() + " " + correctP + " " + otvet)))
    }
    if (x[0] != y[0]) { // если знаки разные, помним что у нас x >= y ПО МОДУЛЮ ОБА ЧИСЛА
        var otvet = ""
        var mantisx = x[2].split('')
        var mantisy = y[2].split('')

        mantisy.unshift(1) // дабовляем незначащий бит в арифиметику
        mantisx.unshift(1)

        if (x[1] != y[1]){ // если порядки разные происходит корректировка мантисы y
            correct = Number(toDec(x[1].toString() + ".0")) - Number(toDec(y[1].toString() + ".0"))
            for (var h = 0; h < correct; h++) {
                mantisy.pop()
                mantisy.unshift(0)
            }
        }

        for (var f = 24; f >= 0; f--){ // побитовая арифметика вычитания
            if (Number(mantisx[f]) - Number(mantisy[f]) == 0) otvet = "0" + otvet;
            if (Number(mantisx[f]) - Number(mantisy[f]) == 1) otvet = "1" + otvet;
            if (Number(mantisx[f]) < Number(mantisy[f])){
                var j = f-1;
                for (; mantisx[j] != 1; j--){
                    mantisx[j] = 1;
                }
                mantisx[j] = 0;
                mantisx[f] = 2;
                f++
            }
        }

        correctP2 = x[1].toString()
        if (otvet.split('')[0] == 0 && Number(otvet) != 0){ // нормализация результата со сдвигом мантисы влево
            correctP2 = toBinPoradok(Number(toDec(correctP2.toString() + ".0")) - 1)
            otvet = otvet + "0"
            otvet = otvet.substring(2,25)
        }
        else if (otvet.split('')[0] == 0 && Number(otvet) == 0){
            correctP2 = toBinPoradok(Number(toDec("0.0")) )
            otvet = otvet.substring(1,24)
        }
        else {
            otvet = otvet.substring(1,24)
        }
        return((x[0].toString() + " " + correctP2 + " " + otvet) + '\n' + fromFloat(x[0].toString() + " " + correctP2 + " " + otvet))
    }
}

// ----------CODE----------------
WSH.Echo("------------IEEE 754----------\n" + "Select operating mode:\n" + "1) Representation in float\n" + "2) The sum of two numbers")
var symbol = WSH.StdIn.ReadLine()
if (symbol == '1') {
    var M = IEEE754()
    WSH.Echo(M)
    WSH.Echo(fromFloat(M))
}
if (symbol == '2') {
    WSH.Echo(SumFloat())
}
