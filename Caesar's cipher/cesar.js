var alphstr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz :.,;'?!()-1234567890"
var mass = alphstr.split('')
var mass_len = mass.length
var alph = { }
for (var i = 0; i < mass_len; i++) {
    alph[mass[i]] = i;
}
WSH.Echo("Write shift:")
var shift = WSH.StdIn.ReadLine()
if (Number(shift) < 0){
    shift = mass_len + Number(shift)
    if (Math.abs(shift) > mass_len)
        shift = (Math.abs(shift) % mass_len);
} else {
    shift = Number(shift)
    if (shift > mass_len)
        shift = shift % mass_len;
}

//-------------кидируем----------------
var S = "qwer"
var S_mass = S.split('')
var rez = ""
for (var j = 0; j < S_mass.length; j++){
    if ((Number(alph[S_mass[j]]) + shift) >= mass_len)
        rez = rez + mass[(alph[S_mass[j]] + shift) % mass_len];
    else
        rez = rez + mass[alph[S_mass[j]] + shift];
}
WSH.Echo(rez)
//-------------обратно----------------
var obratno = ""
var rez_mass = rez.split('')
for (var i = 0; i < rez_mass.length; i++){
    if ((alph[rez_mass[i]] - shift) < 0)
        obratno = obratno + mass[alph[rez_mass[i]] - shift + mass_len];
    else
        obratno = obratno + mass[alph[rez_mass[i]] - shift];
}
WSH.Echo(obratno)
//----------------расшифровка без сдвига------------
var FSO = new ActiveXObject("Scripting.FileSystemObject");
f = FSO.OpenTextFile("symbol rate.txt", 1); // Импортируем глобал. таблицу частот
var fileContent = f.ReadAll()
f.close();
var GT = { }
var mass_len1 = fileContent.split(/[\n\r]/).length
for (var i = 1; i < mass_len1; i++) {
    var mass1 = fileContent.split(/[\n\r]/)[i].split('|')
    GT[mass1[0]] = mass1[1]
}
var LT = { } // заполняем таблицу лок. частот по строке.
var count = 0;
var len = rez_mass.length;
for (var i = 0; i < len; i++){
    if (rez_mass[i] in LT == false){ // если элеммента нету в словаре, то добовлем
        count += 1;
        LT[rez_mass[i]] = 1
    } else {
    count += 1;
    LT[rez_mass[i]] += 1; }
}
for (i in LT) // получаем частоту каждого симовла
    LT[i] = LT[i] / count;

var min_summ = 1000000000000000;
var min_shift = 111111;
for (var k = 1; k < mass_len; k++){ // перебор и собирание сумм.
    var summ = 0;
    for (var l = 0; l < rez_mass.length; l++){
        var position = alph[rez_mass[l]] - k
        if (position < 0)
            position = mass_len + position;
        summ += (GT[mass[position]] - LT[rez_mass[l]]) * (GT[mass[position]] - LT[rez_mass[l]]);
    }

    if (summ < min_summ){ // сравнение сумм
        min_summ = summ;
        min_shift = k;
    }
}
WSH.Echo(min_shift)