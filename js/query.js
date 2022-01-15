function postToDutchie(requestKey, retailerId, queryFilterTableIdKey) {

    var pageFileName = window.location.pathname.split("/").pop().replace(/\.[^/.]+$/, "");
    var cfgObj = eval(pageFileName + '_Options') // use current page name to get this menu's config:

    if (cfgObj.showLoadingMessage()){
        $("#resultsDiv").html('loading....');
    }

    var Q;
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
        query filteredMenuQuery {
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
                                
                                var $tr = $('<tr '+((special) ? ' style="color: '+cfgObj.legendColorSale+';font-weight: bold;" ' : '')+'>').append(
                                    ((cfgObj.includeProductShot) ? $('<td class="' + ((special) ? 'image_sale_cell' : 'image_cell') + '">').html('<img style="height: 30%; width: 30%;" src="' + item.image + '">') : null),
                                    $('<td class="' + ((special) ? 'brand_sale_cell' : 'brand_cell') + '">').text(item.brand.name),
                                    $('<td class="' + ((special) ? 'name_sale_cell' : 'name_cell') + '">').text(stripAndMoveUnitsFromNames(item.name)),
                                    ((cfgObj.showCBDPotencyColumn) ? $('<td class="' + ((special) ? 'cbd_potency_sale_cell' : 'cbd_potency_cell') + '">').text(potencySanityCheck(item.potencyCbd.formatted)) : null),
                                    ((cfgObj.showTHCPotencyColumn) ? $('<td class="' + ((special) ? 'thc_potency_sale_cell' : 'thc_potency_cell') + '">').text(potencySanityCheck(item.potencyThc.formatted)) : null),
                                    ((cfgObj.showStrainTypeColumn) ? $('<td class="' + ((special) ? 'strainType_sale_cell' : 'strainType_cell') + '">').text(toTitleCase(item.strainType.replace(/_/g, ' ')).replace('Cbd', 'CBD').replace('Thc', 'THC')) : null),
                                    ((cfgObj.ignoreNAUnitSize && item.variants[0].option.startsWith('N')) ? $('<td class="' + ((special) ? 'weight_sale_cell' : 'weight_cell') + '">').text('') : $('<td class="' + ((special) ? 'weight_sale_cell' : 'weight_cell') + '">').text(item.variants[0].option)),
                                    $('<td class="' + ((special) ? 'price_sale_cell' : 'price_cell') + '">').text('$ ' + addZeroes(thePrice))

                                ).appendTo('#records_' + tableFilterKeyArray[Q]); // keys must match records_* table id suffix

                                if (cfgObj.enableSplitMenu) {
                                    $('#records_' + tableFilterKeyArray[Q]).wrap("<div id='columnedContainer'></div>");
                                }
                                if (cfgObj.enableStripedTables) { // only when run on final table does it matter
                                    $("tr:even").css("background-color", "#eeeeee");
                                    $("tr:odd").css("background-color", "#ffffff");
                                }
                            }
                        });
                    } 
                });
            }
        });
    }
    if (cfgObj.showLoadingMessage()){
        $("#resultsDiv").html('');
    }
}

/*
TODO:
    cfgObj.legendColorLimited
    cfgObj.enablePotencyAsIcons
*/