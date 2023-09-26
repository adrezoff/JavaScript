var alphstr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz :.,;'?!()-1234567890"
var mass = alphstr.split('')
var mass_len = mass.length
var alph = { }
for (var i = 0; i < mass_len; i++) {
    alph[mass[i]] = 0;
}
var FSO = new ActiveXObject("Scripting.FileSystemObject");
f = FSO.OpenTextFile("1-4 vol.txt", 1);
var fileContent = f.ReadAll()
f.close();
S = fileContent.split('');

var count = 0;
var len = S.length;
for (var i = 0; i < len; i++){
    if (S[i] in alph){
        count += 1;
        alph[S[i]] += 1;
    }
}
for ( i in alph){
    alph[i] = alph[i] / count;
    WSH.Echo(i + "|" + alph[i])
}