t = ('PrinceAndrew')
m = t.length
alph = new Array()

for (i = 0; i < m; i++){
    alph[t.charAt(i)] = 0
}

del = new Array(m+1)
for(j = 0; j < m; j++){
    del[j] = new Array()
}
for (i in alph){
    del[0][i] = 0
}
for (j = 0; j < m - 1 ; j++){
    prev = del[j][t.charAt(j)]
    del[j][t.charAt(j)] = j+1
    for (i in alph){
        del[j+1][i] = del[prev][i]
    }
}

var FSO = new ActiveXObject("Scripting.FileSystemObject");
f = FSO.OpenTextFile("1-4 vol.txt", 1);
var fileContent = f.ReadAll()
f.close();
s = fileContent.replace(/[\s{2,}]+/g, '').split('');

//S = 'колокольчик и колокол'
//s = S.split('')
var count = 0
var q = 0
for (n in s){
    if (q == m-1){
        count += 1
    }
    if (s[n] in alph == false){
        q = 0
        continue
        }
    if (s[n] in alph){
        q = del[q][s[n]]
    }
}
WSH.Echo(count)