function Hemming() {
     var S_str = WSH.StdIn.ReadLine()
     var S = S_str.split('')
     var mass = []
     var k = S.length;
     var stepen = 1;
     var cnt = 0
     var point = 1;
     while (k > 0) {
         if (point == stepen) {
             stepen = stepen << 1;
             cnt++;
             point++;
         } else {
             mass[point] = S[k - 1]
             k--;
             point++;
         }
     }
     var bits = new Array(cnt)
     var goodbits = new Array(cnt)
     for (var t = 0; t < cnt; t++) {
         bits[t] = 0;
         goodbits[t] = 0;
     }

     for (var i = 1; i <= mass.length; i++) {
         if (mass[i] == '0' || mass[i] == undefined) {
             continue;
         } else if (mass[i] == '1') {
             var binnum = i.toString(2)
             if (binnum.split('').length < cnt) {
                 for (var j = Number(binnum.split('').length); j < cnt; j++) {
                     binnum = "0" + binnum;
                 }
             }
             for (var n = 0; n < cnt; n++) {
                 bits[n] = (bits[n] + Number(binnum.split('')[n])) % 2
             }
         }
     }
     var a = 2
     for (var i = 0; i < cnt; i++){
         if (i == 0){
             mass[1] = bits[cnt - i - 1]
         }
         else{
             mass[a] = bits[cnt - i - 1]
             a *= 2;
         }
     }
    var rez = "" // переворачиваем массив - ответ для ясной картины
    for (var j = mass.length-1; j > 0; j--)
        rez =  rez + mass[j];

     WSH.Echo(rez)


    /*
    var a = "11110100111"
    var S_str = ""  // переворачиваем массив - ответ для ясной картины
    for (var j = a.split('').length-1; j >= 0; j--)
        S_str = S_str + a.split('')[j];
    var S = S_str.split('')
    var k = S.length;
    var stepen = 1;
    var x = 2
    while (x < k) {
        x *= 2;
        stepen++;
    }

    var goodbits = new Array(stepen)
    for (var t = 0; t < stepen; t++)
        goodbits[t] = 0;

    for (var i = 0; i < S.length; i++) {
        if (S[i] == '0') {
            continue;
        } else if (S[i] == '1') {
            var binnum = (i + 1).toString(2)
            if (binnum.split('').length < stepen) {
                for (var j = Number(binnum.split('').length); j < stepen; j++) {
                    binnum = "0" + binnum;
                }
            }
            for (var n = 0; n < stepen; n++)
                goodbits[n] = (goodbits[n] + Number(binnum.split('')[n])) % 2;
        }

    }

    if (parseInt(goodbits.join(''), 2) > 0) {
        if (S[parseInt(goodbits.join(''), 2) - 1] > S.length) {
            reciever.value = "count error's > 1"
            return 0;
        }
        if (S[parseInt(goodbits.join(''), 2) - 1] == '0')
            S[parseInt(goodbits.join(''), 2) - 1] = '1';
        else if (S[parseInt(goodbits.join(''), 2) - 1] == '1')
            S[parseInt(goodbits.join(''), 2) - 1] = '0';
    }

    var rez = "" // переворачиваем массив - ответ для ясной картины
    for (var j = S.length-1; j >= 0; j--)
        rez =  rez + S[j];

    WSH.Echo(rez)// передаём значение след. полю */
}

Hemming()