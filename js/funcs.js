function addZeroes(num) {
    const dec = (num + '').split('.')[1]
    const len = dec && dec.length > 2 ? dec.length : 2
    return Number(num).toFixed(len)
}

function addTaxToPrice(thePrice){
    var gst = 0.05; //5%
    var pst = 0.08; //8%
    thePrice = thePrice * (1 + gst + pst);
    thePrice = ((''+thePrice).endsWith('9') ? Math.round(thePrice + 0.01) : thePrice);
    thePrice = ((''+thePrice).endsWith('1') ? Math.round(thePrice - 0.01) : thePrice);
    thePrice = (Math.round(thePrice * 100) / 100).toFixed(2);
    return thePrice;
}

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}

function potencySanityCheck(fieldVal) {
    if (fieldVal && fieldVal.indexOf('%') > 0 && fieldVal.indexOf('-') < 0) { // excluding percentage ranges
        try {
            fieldVal = fieldVal.replace(/\s/g, '')// remove spaces
            var checkFieldVal = fieldVal.substr(0, fieldVal.indexOf('%')); // assumes '%' IS ALWAYS RIGHT OF NUMBER VALUE
            /*if (fieldVal.indexOf(fieldVal.match(/\d/)) > 0){ // if any digits
                fieldVal = fieldVal.substr(fieldVal.indexOf(fieldVal.match(/\d/)), fieldVal.length);
            }else{
                return fieldVal
            }*/
            // all sanity checks to be done here:
            if (Number(checkFieldVal) > 99) return ''; // if percent is above 99, wipe the cell value 

        } catch (err) {
            console.log(err)
            return fieldVal
        }
        return fieldVal
    } else {
        return fieldVal
    }
}

function stripAndMoveUnitsFromNames(fieldVal) {
    if (fieldVal && fieldVal.indexOf('|') > 0) {
        try {
            var unitStr = fieldVal.split('|')[1];
            var nameStr = fieldVal.split('|')[0];
            // TODO: set the thc_potency_cell = unitStr for this table only, 
            // ie need to gen ids for cells when building TRs

            return nameStr;
        }
        catch (err) {
            console.log(err)
            return fieldVal
        }
    } else {
        return fieldVal
    }
}