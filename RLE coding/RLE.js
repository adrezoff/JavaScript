var FSO = new ActiveXObject("Scripting.FileSystemObject");
f = FSO.OpenTextFile("default.txt", 1);
var fileContent = f.ReadAll()
f.close();
//----------------------------Поиск самого редкого символа---------------------------------------
var index = Array(255)
var a = fileContent.split('')
var i;
for (i = 0; i < index.length; ++i){
    index[i] = 0
}
for (i = 0; i < a.length; ++i){
    index[a[i].charCodeAt(a[i])] = index[a[i].charCodeAt(a[i])] + 1
}
var minindex = 1000000
for (i = 0; i < index.length; ++i){
    if (index[i] != 0){
        if (index[i] < minindex){
            minindex = index[i]
        }
    }
}
var symbol;
for (i = 0; i < index.length; ++i){
    if (index[i] == minindex){
        symbol = String.fromCharCode(i)
        break
    }
}
//----------------------Кодирование строки с ESCAPE символом------------------------------------
var s = fileContent;//Original String
var esc = new String();
var esc = symbol;//ESC symbol
var escCode=esc.charCodeAt();//Code esc symbol

var j = new String();//ESC EN String
var count = 1;
var i = 0;
while (s.charCodeAt(i)){
    if (s.charCodeAt(i) == escCode){
        j += esc + String.fromCharCode(1) + esc.charAt();
        count=1;
    }
    else if (s.charCodeAt(i+1) == s.charCodeAt(i)){
        count++;
    }
    else if (count > 3){
        var x = Math.floor(count / 255);
        var y = count % 255;
        var m;
        var correctstr = ''
            for (m = 0; m < x; ++m){
                correctstr += (esc + String.fromCharCode(255) + s.charAt(i));
        }
            j += correctstr + (esc + String.fromCharCode(y) + s.charAt(i))
            count = 1;
    }

    else {
        while (count != 0){
            j += s.charAt(i);
            count--;
        }
        count++;
    }
    i++;
}
//----------------------Декодирование строки с ESCAPE символом---------------
var g = new String ();	//ESC DEC String
var i = 0;
var z;
while (j.charCodeAt(i)){
    if (j.charCodeAt(i) == escCode){
        for (z = 0; z < j.charCodeAt(i+1); z++){
            g += j.charAt(i + 2);
        }
        i = i + 3;
    }
    else {
        g += j.charAt(i);
        i++
    }
}
WSH.Echo()
WSH.Echo('----method with ESP symbol----')
WSH.echo('Count in standard line = '+s.length);
WSH.echo('Count in coding line = '+j.length);
WSH.echo('Count in decoding line = '+g.length);
//----------------------Кодирование JUMP методом--------------------------
var k = new String ();
var k2 = new String ();//Temp string for Jump
var r = 0;//Count repeat symbols
var nr = 0;//Count not repeat symbols
i = 0;
while (s.charCodeAt(i)){
    if (s.charCodeAt(i) == s.charCodeAt(i+1)){//Если символ нынешний РАВЕН будущему
        r++;
        if (nr != 0){//Но до этого были НЕ РАВНЫЕ символы
            k += String.fromCharCode(nr + 128) + k2;
            k2 = new String ();
            nr = 0;
        }
    }
    else {//Если символ нынешний НЕ РАВЕН будущему
        if (r != 0){//Но до этого были РАВНЫЕ символы
            var x = Math.floor(r / 127);
            var y = r % 127;
            var m;
            for (m = 0; m < x; ++m){
                k += String.fromCharCode(127) + s.charAt(i);
            }
            k += String.fromCharCode(y+1) + s.charAt(i);
            r = 0;
        }
        else {
            nr++;
            k2 += s.charAt(i);
        }
    }
    i++;
}
if (nr != 0){
    k += String.fromCharCode(nr + 128) + k2;
}
//-----------------Декодирование строки JUMP методом----------------
var h = new String ();
i = 0;
var l = new Number ();
while (k.charCodeAt(i)){
    if (k.charCodeAt(i) >= 128){
        l = k.charCodeAt(i) - 128;
        for (var c = 0; c < l; c++){
            h += k.charAt(i+1);
            i++;
        }
    }
    else {
        l = k.charCodeAt(i);
        for (var c = 0; c < l; c++){
            h += k.charAt(i+1);
        }
        i++;
    }
    i++;
}
WSH.Echo()
WSH.Echo('----method JUMP----')
WSH.echo('Count in standard line = '+s.length);
WSH.echo('Count in coding line = '+k.length);
WSH.echo('Count in decoding line = '+h.length);
//----------------------Запись в файл закодировоной строки-------------------
var fs1 = new ActiveXObject("Scripting.FileSystemObject");
var ts1 = fs1.CreateTextFile("Coding.txt", 2, -1);
ts1.WriteLine('ESP:       ' + j + '\n' + 'JMP:       ' + k);
ts1.Close();
//----------------------Запись в файл дкодированой строки------------------
var fs2 = new ActiveXObject("Scripting.FileSystemObject");
var ts2 = fs2.CreateTextFile("Decoding.txt", 2, -1);
ts2.WriteLine('ESP:       ' + g + '\n' + 'JMP:       ' + h);
ts2.Close();
