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

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
  
function postToDutchie(requestKey, retailerId, queryFilterTableIdKey) {
    var Q;
    var pageFileName = window.location.pathname.split("/").pop().replace(/\.[^/.]+$/, "");
    var cfgObj = eval(pageFileName + '_Options') // use current page name to get this menu's config:

        /*
        TODO:
            cfgObj.legendColorSale//: 'rgb(4, 122, 4)',
            cfgObj.legendColorLimited//: 'red',

            cfgObj.enableSplitMenu //: true,
            cfgObj.enablePotencyAsIcons //: false,
        */

    for (Q = 0; Q < cfgObj.queries_maxEntries.length; Q++) {
        // console.log('max entries: '+ cfgObj.queries_maxEntries[Q]);   
        $.ajax({
            url: "https://plus.dutchie.com/plus/2021-07/graphql",
            contentType: "application/json",
            headers: {
                "Authorization": requestKey
            },
            type: 'POST',
            context: this,
            data: JSON.stringify({
                query: `fragment MenuProduct on Product {
         brand {
          name
         }
         category
         subcategory
         description
         id
         image
         name
         potencyCbd {
          formatted
         }
         potencyThc {
          formatted
         }
         strainType
         variants {
          option
          priceRec
          specialPriceRec
         }
        }
        query ExampleMenuQuery {
        menu(sort: { direction: DESC, key: ` + cfgObj.queries_sort_key + ` }
          pagination: { offset: 0, limit: ` + cfgObj.queries_maxEntries[Q] + ` },
          filter: { 
            ` + $.grep([((cfgObj.queries_filter_category[Q] && cfgObj.queries_filter_category[Q] != '') ? `category: ` + cfgObj.queries_filter_category[Q] : ``),
                ((cfgObj.queries_filter_subcategory[Q] && cfgObj.queries_filter_subcategory[Q] != '') ? `subcategory: ` + cfgObj.queries_filter_subcategory[Q] : ``),
                ((cfgObj.queries_filter_strainType[Q] && cfgObj.queries_filter_strainType[Q] != '') ? `strainType: ` + cfgObj.queries_filter_strainType[Q] : ``)],
                    function (n) { return n == 0 || n })
                        .join(`, `) + `
          }, 
          menuType: RECREATIONAL, retailerId: "` + retailerId + `") {
        products {
          ...MenuProduct
        }
        }
        }`
            }), 
            success: function (result) {
                $(function () {
                    var tableFilterKeyArray;
                    var vKey;
                    switch(queryFilterTableIdKey) {
                        case 'subcategory':
                            tableFilterKeyArray = cfgObj.queries_filter_subcategory
                            vKey = result.data.menu.products[0].subcategory;
                          break;
                        case 'category':
                            tableFilterKeyArray = cfgObj.queries_filter_category
                            vKey = result.data.menu.products[0].category;
                          break;
                        case 'strainType':
                            tableFilterKeyArray = cfgObj.queries_filter_strainType
                            vKey = result.data.menu.products[0].strainType;
                            break;
                        default:
                            tableFilterKeyArray = cfgObj.queries_filter_subcategory
                            vKey = result.data.menu.products[0].subcategory;
                      }
                    

                    for (Q = 0; Q < tableFilterKeyArray.length; Q++) {
                        if (cfgObj.enableDebugToConsole) console.log(JSON.stringify(cfgObj)) 
                        if (cfgObj.enableDebugToConsole) console.log(' queries_filter_subcategory: ' + Q + tableFilterKeyArray[Q]);
                        if (vKey == tableFilterKeyArray[Q]) {
                            if (result.data.menu.products.length > 0) {
                                var $tr = $('<tr>').append(
                                    ((cfgObj.includeProductShot) ? $('<td class="image_cell_header">').text('') : null),
                                    $('<td class="brand_cell_header">').text('Brand'),
                                    $('<td class="name_cell_header">').text('Name'),
                                    ((cfgObj.showCBDPotencyColumn) ? $('<td class="cbd_potency_cell_header">').text('CBD %') : null),
                                    ((cfgObj.showTHCPotencyColumn) ? $('<td class="thc_potency_cell_header">').text('THC %') : null),
                                    ((cfgObj.showStrainTypeColumn) ? $('<td class="strainType_cell_header">').text('Type') : null),
                                    $('<td class="size_cell_header">').text('Size'),
                                    $('<td class="price_cell_header">').text('$ +tax Incl.')

                                ).appendTo('#records_' + tableFilterKeyArray[Q]);
                            } else {
                                var $tr = $('<tr>').append(
                                    $('<td class="outOfStockMsg_cell">').text('(None at the moment)'),
                                    $('<td class="brand_cell">').text(' '),
                                    $('<td class="name_cell">').text(' '),
                                    ((cfgObj.showCBDPotencyColumn) ? $('<td class="cbd_potency_cell">').text(' ') : null),
                                    ((cfgObj.showTHCPotencyColumn) ? $('<td class="thc_potency_cell">').text(' ') : null),
                                    ((cfgObj.showStrainTypeColumn) ? $('<td class="strainType_cell">').text(' ') : null),
                                    $('<td class="weight_cell">').text(' '),
                                    $('<td class="price_cell">').text(' ')
                                ).appendTo('#records_' + tableFilterKeyArray[Q]);
                            }
                        }
                        $.each(result.data.menu.products, function (i, item) {
                             // if (cfgObj.enableDebugToConsole) console.log($tr.wrap('<p>').html());
                            var iKey
                             switch(queryFilterTableIdKey) {
                                case 'subcategory':
                                    iKey = item.subcategory
                                  break;
                                case 'category':
                                    iKey = item.category
                                  break;
                                case 'strainType':
                                    iKey = item.strainType
                                    break;
                                default:
                                    iKey = item.subcategory
                              }


                            if (iKey == tableFilterKeyArray[Q]) {
                                var special = item.variants[0].specialPriceRec;
                                if (special && cfgObj.includeLegend) {
                                    $("#legendDiv").html('<span class="blinking">GREEN = SPECIALS!!</span>');
                                }
                                var thePrice = ((special) ? special : item.variants[0].priceRec);
                                if (cfgObj.enableTaxInPricing) thePrice = addTaxToPrice(thePrice);

                                var cellName0 = ((special) ? 'image_sale_cell' : 'image_cell');
                                var cellName = ((special) ? 'brand_sale_cell' : 'brand_cell');
                                var cellName2 = ((special) ? 'name_sale_cell' : 'name_cell');
                                var cellName4 = ((special) ? 'cbd_potency_sale_cell' : 'cbd_potency_cell');
                                var cellName3 = ((special) ? 'thc_potency_sale_cell' : 'thc_potency_cell');
                                var cellName3a = ((special) ? 'strainType_sale_cell' : 'strainType_cell');
                                var cellName5 = ((special) ? 'weight_sale_cell' : 'weight_cell');
                                var cellName6 = ((special) ? 'price_sale_cell' : 'price_cell');

                                var $tr = $('<tr>').append(
                                    ((cfgObj.includeProductShot) ? $('<td class="' + cellName + '">').html('<img style="height: 30%; width: 30%;" src="' + item.image + '">') : null),
                                    $('<td class="' + cellName + '">').text(item.brand.name),
                                    $('<td class="' + cellName2 + '">').text(stripAndMoveUnitsFromNames(item.name)),
                                    ((cfgObj.showCBDPotencyColumn) ? $('<td class="' + cellName4 + '">').text(potencySanityCheck(item.potencyCbd.formatted)) : null),
                                    ((cfgObj.showTHCPotencyColumn) ? $('<td class="' + cellName3 + '">').text(potencySanityCheck(item.potencyThc.formatted)) : null),
                                    ((cfgObj.showStrainTypeColumn) ? $('<td class="' + cellName3a + '">').text(toTitleCase(item.strainType.replace(/_/g, ' ')).replace('Cbd', 'CBD').replace('Thc', 'THC')) : null),
                                    ((cfgObj.ignoreNAUnitSize && item.variants[0].option.startsWith('N')) ? $('<td class="' + cellName5 + '">').text('') : $('<td class="' + cellName5 + '">').text(item.variants[0].option)),
                                    $('<td class="' + cellName6 + '">').text('$ ' + addZeroes(thePrice))

                                ).appendTo('#records_' + tableFilterKeyArray[Q]);

                                if (cfgObj.enableStripedTables) {
                                    $("tr:even").css("background-color", "#eeeeee");
                                    $("tr:odd").css("background-color", "#ffffff");
                                }
                            }
                        });
                    } // end queries_filter_subcategory
                });
            }
        });
    }
}