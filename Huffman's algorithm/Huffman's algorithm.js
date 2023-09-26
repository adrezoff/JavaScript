function getMin(obj) {//Поиск символа с минимальной вероятностью.
    var max = 100000000000; var kk = '';
    for (var k in obj)
        if ((obj[k].count < max) && (obj[k].use == false)) {
            max = obj[k].count;
            kk = k;
        }
    return kk;
}
function Huffman(S) {
    var s = S.split('');
    var ret = '';
    var obj = {}; //Cловарь -> у кадого элемента 3 параметра
    var alph = [];

    for (var i = 0; i < s.length; i++){ //Считаем вероятности, указываем что нет родителей.
        if (obj[s[i]] == null) {
            alph.push(s[i])
            obj[s[i]] = {count:0, code:'', use:false};
        }
        obj[s[i]].count += 1;
    }

    for (var r in obj) { //Перебор по всем элементам ассоциативного массива, включая добавленные в процессе
        var k11 = getMin(obj); //Ищем 1ый элемент
        if (k11 == '') break;
        obj[k11].use = true;

        var k22 = getMin(obj); //Ищем 2ой элемент
        if (k22 == '') break;
        obj[k22].use = true;

        for (var j = 0; j < k11.length; j++) { //К потомкам первого прибавляем код.
            var k1 = k11.split('')
            obj[k1[j]].code = "1" + obj[k1[j]].code;
        }
        for (var j = 0; j < k22.length; j++) { //К потомкам второго прибавляем код.
            var k2 = k22.split('')
            obj[k2[j]].code = "0" + obj[k2[j]].code;
        }
        //Добавляем новый узел
        obj[k11+k22] = { count:obj[k11].count + obj[k22].count, code:'', use:false };
    }
    if (alph.length == 1){ //если алфавит из 1 символа
        obj[alph[0]].code = '0'
    }
    var unpackcode = { }
    for (var k = 0; k < alph.length; k++){ // вывод алфавита
        WSH.Echo(alph[k] + " : " + obj[alph[k]].code);
        unpackcode[obj[alph[k]].code] = alph[k];
    }
    for (var i = 0; i < s.length; i++) { //Кодируем строку
        ret += obj[s[i]].code;
    }
    WSH.Echo(ret)
    var unpack = ret.split('');
    var str = '';
    var otvet = '';
    for (var n = 0; n < unpack.length; n++) {
        str = str + unpack[n];
        if (str in unpackcode){
            otvet = otvet + unpackcode[str].toString();
            str = '';
        }
    }
    WSH.Echo(otvet)
}
Huffman("abracadabra")
