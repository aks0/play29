
var Util29 = function() {

    /**
     * Concatenates the string value for each element of the array and returns.
     */
    var toString = function(array) {
        var str = "";
        if (array === null || array.length === 0) {
            return str;
        }
        str = "[" + array[0].toString();
        for(var i = 1; i < array.length; i++) {
            str += ", " + array[i].toString();
        }
        str += "]";
        return str;
    };

    /**
     * Capitalizes the first letter of the given string and rest are lowercase
     */
    var toProperNoun = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    /**
     * Swaps the two indices in the given array
     */
    var swap = function(arr, i, j) {
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    };

    return {
        toString: toString,
        swap: swap,
        toProperNoun: toProperNoun
    };
};

try {
    exports.Util29 = Util29;
} catch (err) {
}
