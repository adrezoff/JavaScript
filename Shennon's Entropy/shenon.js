var strin = "a"
str = strin.replace(/[\s{2,}]+/g, '').split('');
var N = { }
var alph = []
var i = 0
for (var j = 0; j < str.length; ++j){
    if (str[j] in N){
        N[str[j]] += 1/str.length
    }
    else{
        N[str[j]] = 1/str.length
        alph[i] = str[j]
        i += 1
    }
}
var a = 0
if (alph.length == 1){
    a = 1
}
var rez = 0
for (j = 0; j < i - a ; j++){
    rez += - N[alph[j]] * (Math.log(N[alph[j]]) / Math.log(alph.length))
}
WSH.Echo(rez)