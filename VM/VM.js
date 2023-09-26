var FS0 = new ActiveXObject("Scripting.FileSystemObject");
var file = WScript.StdIn.ReadLine()
f = FS0.OpenTextFile(file + ".adr", 1)
var fileContent = f.ReadAll()
f.close()

var memory = Array(255);

var mass1 = fileContent.replace(/\s+|\s+$/gm, " ").split(" ");
var ip;
var i;
for (i = 0; i < mass1.length; ++i){
    memory[i] = mass1[i]
}

function search() {
    var j = i + 5
    while (String(memory[j]) != ")") {
        j = j + 1
    }
    i = j
}

for (i = 0; i < memory.length; ++i) {
    ip = memory[i];
// --------------------------------------считывание данных с консоли---------------------------------
    if (ip == "input") {
        var cin = WScript.StdIn.ReadLine();
        if (cin % 1 == 0) {
            var log = String(memory[i + 1]).charCodeAt(0) + 133;
            memory[log] = cin
            continue
        } else {
            WSH.Echo("The number is not integer!")
            break
        }
    }
// -----------------------------присвоение переменной числового значения---------------------------------
    if (ip == "var") {
        if (memory[i + 2] == "=") {
            log2 = String(memory[i + 1]).charCodeAt(0) + 133
            memory[log2] = String(Number(memory[i + 3]))
            continue
        } else {
            WSH.Echo("Error rule VAR!")
            break
        }
    }
// -----------------------------блок уловного оператора if---------------------------------------------
    if (ip == "if") {
        if ((isNaN(memory[i + 1]) == true) && (isNaN(memory[i + 3]) == true)) {
            if (memory[i + 2] == "<=") {
                if ((Number(memory[String(memory[i + 1]).charCodeAt(0) + 133]) <= Number(memory[String(memory[i + 3]).charCodeAt(0) + 133])) == false) {
                    search()
                    continue
                }
                if ((Number(memory[String(memory[i + 1]).charCodeAt(0) + 133]) <= Number(memory[String(memory[i + 3]).charCodeAt(0) + 133])) == true) {
                    continue
                }
                continue
            }
            if (memory[i + 2] == ">=") {
                if ((Number(memory[String(memory[i + 1]).charCodeAt(0) + 133]) >= Number(memory[String(memory[i + 3]).charCodeAt(0) + 133])) == false) {
                    search()
                    continue
                }
                if ((Number(memory[String(memory[i + 1]).charCodeAt(0) + 133]) >= Number(memory[String(memory[i + 3]).charCodeAt(0) + 133])) == true) {
                    continue
                }
                continue
            }
            if (memory[i + 2] == ">") {
                if ((Number(memory[String(memory[i + 1]).charCodeAt(0) + 133]) > Number(memory[String(memory[i + 3]).charCodeAt(0) + 133])) == false) {
                    search()
                    continue
                }
                if ((Number(memory[String(memory[i + 1]).charCodeAt(0) + 133]) > Number(memory[String(memory[i + 3]).charCodeAt(0) + 133])) == true) {
                    continue
                }
                continue
            }
            if (memory[i + 2] == "<") {
                if ((Number(memory[String(memory[i + 1]).charCodeAt(0) + 133]) < Number(memory[String(memory[i + 3]).charCodeAt(0) + 133])) == false) {
                    search()
                    continue
                }
                if ((Number(memory[String(memory[i + 1]).charCodeAt(0) + 133]) < Number(memory[String(memory[i + 3]).charCodeAt(0) + 133])) == true) {
                    continue
                }
                continue
            }
            if (memory[i + 2] == "==") {
                if ((Number(memory[String(memory[i + 1]).charCodeAt(0) + 133]) == Number(memory[String(memory[i + 3]).charCodeAt(0) + 133])) == false) {
                    search()
                    continue
                }
                if ((Number(memory[String(memory[i + 1]).charCodeAt(0) + 133]) == Number(memory[String(memory[i + 3]).charCodeAt(0) + 133])) == true) {
                    continue
                }
                continue
            }
            continue
        }
        continue
    }
// --------------------------------------блок арефмитических оппераций---------------------------------
    if (ip == "=") {
        if (memory[i + 2] == "*") {
            log1 = String(memory[i - 1]).charCodeAt(0) + 133
            memory[log1] = Number(memory[String(memory[i + 1]).charCodeAt(0) + 133]) * Number(memory[String(memory[i + 3]).charCodeAt(0) + 133])
            continue
        }
        if (memory[i + 2] == "+") {
            if ((isNaN(memory[i + 1]) == true) && (isNaN(memory[i + 3]) == false)) {
                log2 = String(memory[i - 1]).charCodeAt(0) + 133
                memory[log2] = Number(memory[String(memory[i + 1]).charCodeAt(0) + 133]) + Number(memory[i + 3])
                continue
            }
        }
        if (memory[i + 2] == "-") {
            if ((isNaN(memory[i + 1]) == true) && (isNaN(memory[i + 3]) == true)) {
                log4 = String(memory[i - 1]).charCodeAt(0) + 133
                memory[log4] = Number(memory[String(memory[i + 1]).charCodeAt(0) + 133]) - Number(memory[String(memory[i + 3]).charCodeAt(0) + 133])
                continue
            }
            continue
        } else {
            if ((isNaN(memory[i - 1]) == true) && (isNaN(memory[i + 1]) == true)) {
                log5 = String(memory[i - 1]).charCodeAt(0) + 133
                memory[log5] = Number(memory[String(memory[i + 1]).charCodeAt(0) + 133])
                continue
            }
            continue
        }
        continue
    }
// --------------------------------------операции безусловного перехода---------------------------------
        if (ip == "jumpback") {
            i = i - Number(memory[i + 1]) - 1
            ip = memory[i]
            continue
        }
        if (ip == "jumpforw") {
            i = i + Number(memory[i + 1])
            ip = memory[i]
            continue
        }
// --------------------------------------вывод данных---------------------------------
        if (ip == "print") {
            if ((isNaN(memory[i + 1]) == true) && (memory[i + 1] != "str:")) {
                WSH.Echo("prog:   " + memory[String(memory[i + 1]).charCodeAt(0) + 133])
                continue
            }
            if (memory[i + 1] == "str:") {
                WSH.Echo("prog:   " + String(memory[i + 2]))
                continue
            }
// --------------------------------------метка окончание алгорима---------------------------------
        }
        if (ip == "end") {
            break
        }
}



//cd C:\Users\Андрей\Desktop