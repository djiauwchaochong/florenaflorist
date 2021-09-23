function reverseString(str) {
    var splitString = str.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    return joinArray;
}

function sumRp(data1, data2){
    var data3 = data1 + data2
    var data3 = data3.toString()
    var temp = ''
    var count = 1

    for(var i = data3.length - 1; i >= 0; i--){
        temp = temp + data3[i]
        if(count == 3 && i != 0){
            temp = temp + '.'
            count = 0
        }
        count ++
    }

    temp = reverseString(temp)
    return `Rp. ${temp},00`

}

module.exports = { sumRp, reverseString }