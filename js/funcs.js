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

/*
function DutchieAPI_GET(filterString, itemType) {
    if (type == 'menu'){
        return 'foo'
    }
    return
}
*/