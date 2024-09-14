var UserLang = 'en';    //<- General UI Language (en,es,de,fr,ru)
var UserDeck = 'Marsella';   //<- Design of the Card Deck
var CardCount = 6;      //<- How many Cards should we draw
var LANG = null;        //<- UI Translations
var MyDeck = null;      //<- Data of all cards
var DeckConfig = null;  //<- Config of Current Deck
var MyCards = [];       //<- Random Cards currently chosen
var FlippedCards = false; //<- true if cards are flipped over

var popMessg = new bootstrap.Popover(document.getElementById('cmdDrawCards'), {
    animation: true,
    placement: 'bottom',
    trigger: 'focus',
    template: '<div class="popover" role="tooltip"><div class="popover-arrow" ></div><h3 class="popover-header"></h3><div class="popover-body" ></div></div>',
    customClass: '',
    title: 'Title',
    content: 'Message'
});

$('#cboLanguage').on('change', function () {
    UserLang = $(this).val(); //<- Valor Seleccionado
    setCookie("UserLang", UserLang, 7); //<- Remembers User's choice for 7 days
    TranslateUI(UserLang);
});
$('#cboUserDeck').on('change', function () {
    UserDeck = $(this).val();
    setCookie("UserDeck", UserDeck, 7); //<- Remembers User's choice for 7 days
    LoadDeck(UserDeck);
    ShuffleCards();
});
$('#cboCardCount').on('change', function () {
    CardCount = $(this).val(); //console.log(CardCount);
    setCookie("CardCount", CardCount, 7); //<- Remembers User's choice for 7 days
    ShuffleCards();
});

$(document).on("click", "#cmdDrawCards", function (evt) {
    ShuffleCards();
    FlipCards();
}); 
$(document).on("click", "#cmdFlipCards", function (evt) {
    FlipCards();
});

/* ****  EVENTOS DE LAS CARTAS  */
$(document).on("click", "#Card-01", function (evt) {
    //console.log('Boton Card-01');
});
$(document).on("click", "#Card-02", function (evt) {
    //console.log('Boton Card-02')
});
$(document).on("click", "#Card-03", function (evt) {
    //console.log('Boton Card-03')
});
$(document).on("click", "#Card-04", function (evt) {
    //console.log('Boton Card-04')
});
$(document).on("click", "#Card-05", function (evt) {
    //console.log('Boton Card-05')
});
$(document).on("click", "#Card-06", function (evt) {
    //console.log('Boton Card-06')
});

/* EVENTO AL ABRIR EL DETALLE DE LA CARTA */
var CardInfo = document.getElementById('CardInfo')
CardInfo.addEventListener('show.bs.modal', function (event) {
    try {
        var button = event.relatedTarget; //<- Button that triggered the modal  
        var jsonData = button.getAttribute('data-bs-info'); //<- Extract info from data-bs-* attributes
        if (jsonData != null) {
            const CardData = JSON.parse(jsonData); console.log(CardData);

            var modalTitle = CardInfo.querySelector('.modal-title');
                modalTitle.textContent = CardData.name + ' [' + CardData.id + ']';

            const myImage = document.getElementById("imgCardFull");
                myImage.setAttribute('src', 'decks/'+ UserDeck +'/'+ CardData.id +'.png'); //<- usar la baraja indicada x el usuario

            if (CardData.is_inverted) {
                // Carta Invertida:
                if (!hasClass(myImage, "inverted-image")) {
                    myImage.className += " inverted-image";
                }
                $("#cardText").html( CardData.inverted[0]);
                $("#cardText2").html(CardData.inverted[1]);
            } else {
                // Imagen Normal:
                myImage.className = myImage.className.replace(" inverted-image", "");
                $("#cardText").html( CardData.normal[0]);
                $("#cardText2").html(CardData.normal[1]);
            }       
        }
    } catch (error) { console.log(error) }  
})

Iniciar();
function Iniciar() {
    try {
        // 1. Get the User Choices from the Cookies, use default values if unset/expired
        UserLang = NVL(getCookie("UserLang"), 'en'); 
        UserDeck = NVL(getCookie("UserDeck"), 'Rider');
        CardCount= NVL(getCookie("CardCount"), 3); //console.log('Cookie: ' + CardCount);

        $.getJSON('decks/available-decks.json?version=1', function (data) {
            var ListVar = $("#cboUserDeck");
            ListVar.empty();
            data.forEach(function(deck) {
                //<option selected value="3">3</option>
                var opt = $("<option>" + deck.desc + "</option>").attr("value", deck.name );                
                ListVar.append(opt);
            });
        });
        $.getJSON('assets/ui_translations.json?version=1', function (data) {
            LANG = data;
            TranslateUI(UserLang);
        });
        $.getJSON('decks/Cards.json?version=1', function (data) {
            MyDeck = data;
            LoadDeck(UserDeck);
        });

    } catch (error) { console.log(error) }   
}

function LoadDeck(deckName) {
    try {
        $.getJSON('decks/'+ deckName + '/deck-config.json?version=1', function (data) {
           // console.log(data);
            DeckConfig = data;            
            $("#mainContainer").attr( "style", 
            "background: url('decks/"+ DeckConfig.pageBackImg + "'); background-repeat: no-repeat; background-position:center; background-size:cover;");           
            ShuffleCards(); 
        });
    } catch (error) { console.log(error) }   
}

function TranslateUI(lang) {
    try {
        if (LANG != null) {
            $('#cboLanguage').val(UserLang); 
            $('#cboUserDeck').val(UserDeck);             
    
            $("#lblcboLanguage").html(LANG.translations.find((element) => element.key === 'cboLanguage').lang[lang]);
            $("#lblcboUserDeck").html(LANG.translations.find((element) => element.key === 'cboUserDeck').lang[lang]);
            $("#lblcboCardCount").html(LANG.translations.find((element) => element.key === 'cboCardCount').lang[lang]);
    
            $("#lbContact").html(LANG.translations.find((element) => element.key === 'lbContact').lang[lang]); txtUserQuery
    
            $("#lbGithub").html(LANG.translations.find((element) => element.key === 'lbGithub').lang[lang]);
            $("#lbEmail").html(LANG.translations.find((element) => element.key === 'lbEmail').lang[lang]);
            $("#lbBuyaBeer").html(LANG.translations.find((element) => element.key === 'lbBuyaBeer').lang[lang]);
    
            $("#lblWelcome").html(LANG.translations.find((element) => element.key === 'main-welcome').lang[lang]);
            $("#lblIntroduction").html(LANG.translations.find((element) => element.key === 'main-intro').lang[lang]);
            $("#cmdDrawCards").html(LANG.translations.find((element) => element.key === 'main-button').lang[lang]);
            $("#cmdFlipCards").html(LANG.translations.find((element) => element.key === 'main-button2').lang[lang]);
    
            $("#txtUserQuery").attr("placeholder", LANG.translations.find((element) => element.key === 'UserQuery').lang[lang]);
    
            const ComboCountCards = (LANG.translations.find((element) => element.key === 'cboCardCountEx').lang[lang]).split('|'); 
            var ListVar = $("#cboCardCount");
                ListVar.empty();
                ComboCountCards.forEach(function(data) {
                    const KeyValue = data.split('-');
                    ListVar.append($("<option>" + data + "</option>").attr("value", KeyValue[0].trim() ));
                });
                ListVar.val(CardCount);
    
            // TODO: El pie de pagina
        }
    } catch (error) { console.log(error) }    
}

function ShuffleCards() {
    if (MyDeck != null) {
        MyCards = [];
        
        for (let index = 1; index <= 6; index++) {
            // Hide all Cards
            const myCard = document.getElementById('Card-0'+ index +'-div');
            if (!hasClass(myCard, "invisible")) {
                myCard.className += " invisible";
            }
            //Color for the Box of each card:
            $('#Card-0'+ index +'-div').attr("style", "background-color: rgba(" + 
                DeckConfig.cardBoxRgba[0] + ", "+ DeckConfig.cardBoxRgba[1] +", "+ DeckConfig.cardBoxRgba[2] +", "+ DeckConfig.cardBoxRgba[3] +");");

            //Back Image for Cards:
            $("#Card-0" + index + "-img").attr("src", "decks/" + DeckConfig.cardBackImg  );  
            $("#Card-0" + index + "-img").attr("style", "width:200px");
        }
        FlippedCards = false;
        HideAlert();

        // 1. Get random IDs for the cards chosen:
        const randomCards = [];
        for (let i = 1; i <= CardCount; i++) {
            randomCards.push(getRandomUnique(0, 77, randomCards)); //total de cartas: 78 (77+0)
        }

        // 2. Get the Actual cards from the chosen IDs:
        if (randomCards != null && randomCards.length > 0) {
            randomCards.forEach(number => {
                try {
                    var MyCard = MyDeck[number].translations[UserLang]; //<- Translated to the selected language
                        MyCard.id = MyDeck[number].type + '-' + MyDeck[number].number; //<- Name for the Picture
                        MyCard.number = MyDeck[number].number;

                    const invChance = getRandom(1, 100);

                    MyCard.is_inverted = invChance <= 30; //<- 30% chance of being inverted
                    MyCard.points = MyCard.is_inverted ? MyDeck[number].Points[1] : MyDeck[number].Points[0];
                    MyCards.push(MyCard);

                    console.log(MyCard.id + ', Inverted: ' + MyCard.is_inverted + ' (' + invChance + '%), ' +  MyCard.points + ' Points.');               
                } catch (error) {
                    console.log(error);
                }
            });
        }
        //console.log(MyCards);

        // 3. Add the cards to the deck
        if (CardCount == 1) {
            console.log("1 carta!");

            //Add the Data to each card
            $("#Card-02").attr("data-bs-info", JSON.stringify(MyCards[0]));  
            $("#Card-02-img").attr("alt", MyCards[0].id  ); 
            console.log(MyCards[0]);
            
            //Make the Card Visible again
            const myCard = document.getElementById('Card-02-div');
                myCard.className = myCard.className.replace(" invisible", "");
        }
        if (CardCount == 3) {
            console.log("3 cartas!");
            for (let index = 1; index <= 3; index++) {
                //Add the Data to each card
                $("#Card-0" + index).attr("data-bs-info", JSON.stringify(MyCards[index - 1]));  
                $("#Card-0" + index + "-img").attr("alt", MyCards[index - 1].id  ); 
                console.log(MyCards[index - 1]);
                
                //Make the Card Visible again
                const myCard = document.getElementById('Card-0'+ index +'-div');
                    myCard.className = myCard.className.replace(" invisible", "");
            }
        }
        if (CardCount == 5) {
            console.log("5 cartas!");
            for (let index = 1; index <= 5; index++) {
                const i = index <= 1 ? index : index + 1;
                //Add the Data to each card
                $("#Card-0" + i).attr("data-bs-info", JSON.stringify(MyCards[index - 1]));  
                $("#Card-0" + i + "-img").attr("alt", MyCards[index - 1].id  ); 
                console.log(MyCards[index - 1]);

                //Make the Card Visible again
                const myCard = document.getElementById('Card-0'+ i +'-div');
                    myCard.className = myCard.className.replace(" invisible", "");
            }
        }
    }
}

function FlipCards() {
    /* This turns the cards over alternately on each call */
    try {
        if (FlippedCards == true) {           
            // Turn the cards over so that the back side is showing.
            console.log(DeckConfig);
            for (let index = 1; index <= 9; index++) {
                try {                    
                    $("#Card-0" + index + "-img").attr("src", "decks/"+ DeckConfig.cardBackImg  );  
                    $("#Card-0" + index + "-img").attr("style", "width:350px");
                } catch {}
            }
            FlippedCards = false;   
            HideAlert();         
        } else {
            
            // Turn the cards over so that the front side is showing.
            var DeckPoints = [];
            for (let index = 1; index <= 6; index++) {
                try {
                   // console.log(index); console.log(DeckPoints);
                    const data = JSON.parse($("#Card-0" + index).attr('data-bs-info')); //<- Extract info from data-bs-* attributes
                    if (data != null && data !== undefined) {
                        DeckPoints.push(data.points);
                        //console.log('decks/'+ UserDeck +'/'+ data.id +'.png');

                        const myImage = document.getElementById("Card-0" + index + "-img");
                            myImage.setAttribute('src', 'decks/'+ UserDeck +'/'+ data.id +'.png');
                            myImage.setAttribute("style", "width:180px; opacity:1.0;");

                        if (data.is_inverted) {     // Only if the class hasnt been already set                    
                            if (!hasClass(myImage, "inverted-image")) {
                                myImage.className += " inverted-image"; // Carta Invertida:
                            }
                        } else {
                            // Carta Normal:
                            myImage.className = myImage.className.replace(" inverted-image", "");
                        }
                    }                                         
                } catch (e) { }
            }
            FlippedCards = true; 
            ShowAlertEx(SumarPuntos(DeckPoints));    
        }
    } catch (e) { console.log(e) }
}

function ShowAlertEx(points = 0) {

    console.log('Points: ' + points);
    var Messages = [];  
    var className = '';   
    
    if (CardCount == 1) {
        if (points >= 10) {
            className = 'popBack-Green';
            Messages = (LANG.translations.find((element) => element.key === 'YesNoMessage_1').lang[UserLang]).split('|');            
        } else if (points >= 5) {
            className = 'popBack-Blue';
            Messages = (LANG.translations.find((element) => element.key === 'YesNoMessage_3').lang[UserLang]).split('|');  
        } else if (points >= 1) {
            className = 'popBack-Yellow';
            Messages = (LANG.translations.find((element) => element.key === 'YesNoMessage_4').lang[UserLang]).split('|');  
        } else {
            className = 'popBack-Red';
            Messages = (LANG.translations.find((element) => element.key === 'YesNoMessage_5').lang[UserLang]).split('|');  
        }
    }
    if (CardCount == 3) {
        if (points >= 30) {
            className = 'popBack-Green';
            Messages = (LANG.translations.find((element) => element.key === 'GreenMsg').lang[UserLang]).split('|');            
        } else if (points >= 15) {
            className = 'popBack-Blue';
            Messages = (LANG.translations.find((element) => element.key === 'BlueMsg').lang[UserLang]).split('|');  
        } else if (points >= 10) {
            className = 'popBack-Yellow';
            Messages = (LANG.translations.find((element) => element.key === 'YellowMsg').lang[UserLang]).split('|');  
        } else {
            className = 'popBack-Red';
            Messages = (LANG.translations.find((element) => element.key === 'RedMsg').lang[UserLang]).split('|');  
        }
    }
    if (CardCount == 5) {
        if (points >= 40) {
            className = 'popBack-Green';
            Messages = (LANG.translations.find((element) => element.key === 'GreenMsg').lang[UserLang]).split('|');            
        } else if (points >= 25) {
            className = 'popBack-Blue';
            Messages = (LANG.translations.find((element) => element.key === 'BlueMsg').lang[UserLang]).split('|');  
        } else if (points >= 10) {
            className = 'popBack-Yellow';
            Messages = (LANG.translations.find((element) => element.key === 'YellowMsg').lang[UserLang]).split('|');  
        } else {
            className = 'popBack-Red';
            Messages = (LANG.translations.find((element) => element.key === 'RedMsg').lang[UserLang]).split('|');  
        }  
    }

    popMessg._config.title = Messages[0];
    popMessg._config.content = Messages[1];
    popMessg.show();
}

function ShowAlert(points = 0) {
    console.log('Points: ' + points);
    
    const myCard = document.getElementById('Alert-Div');
    var Messages = "";
                
    if (CardCount == 3) {
        if (points >= 30) {
            myCard.className = "alert alert-success";
            Messages = (LANG.translations.find((element) => element.key === 'GreenMsg').lang[UserLang]).split('|');            
        } else if (points >= 20) {
            myCard.className = "alert alert-info";
            Messages = (LANG.translations.find((element) => element.key === 'BlueMsg').lang[UserLang]).split('|');  
        } else if (points >= 10) {
            myCard.className = "alert alert-warning";
            Messages = (LANG.translations.find((element) => element.key === 'YellowMsg').lang[UserLang]).split('|');  
        } else {
            myCard.className = "alert alert-danger";
            Messages = (LANG.translations.find((element) => element.key === 'RedMsg').lang[UserLang]).split('|');  
        }        
    }
    if (CardCount == 5) {
        if (points >= 50) {
            myCard.className = "alert alert-success";
            Messages = (LANG.translations.find((element) => element.key === 'GreenMsg').lang[UserLang]).split('|');            
        } else if (points >= 25) {
            myCard.className = "alert alert-info";
            Messages = (LANG.translations.find((element) => element.key === 'BlueMsg').lang[UserLang]).split('|');  
        } else if (points >= 10) {
            myCard.className = "alert alert-warning";
            Messages = (LANG.translations.find((element) => element.key === 'YellowMsg').lang[UserLang]).split('|');  
        } else {
            myCard.className = "alert alert-danger";
            Messages = (LANG.translations.find((element) => element.key === 'RedMsg').lang[UserLang]).split('|');  
        }  
    }
    if (CardCount == 9) {
        if (points >= 90) {
            myCard.className = "alert alert-success";
            Messages = (LANG.translations.find((element) => element.key === 'GreenMsg').lang[UserLang]).split('|');            
        } else if (points >= 60) {
            myCard.className = "alert alert-info";
            Messages = (LANG.translations.find((element) => element.key === 'BlueMsg').lang[UserLang]).split('|');  
        } else if (points >= 20) {
            myCard.className = "alert alert-warning";
            Messages = (LANG.translations.find((element) => element.key === 'YellowMsg').lang[UserLang]).split('|');  
        } else {
            myCard.className = "alert alert-danger";
            Messages = (LANG.translations.find((element) => element.key === 'RedMsg').lang[UserLang]).split('|');  
        }  
    }

    //console.log(Messages);

    $("#Alert-Title").html(Messages[0]);
    $("#Alert-Msg").html(Messages[1]);
}
function HideAlert() {
    //const myCard = document.getElementById('Alert-Div');
    //myCard.className = "alert invisible";
    //popMessg.hide();
}
function SumarPuntos(DeckPoints) {
    var Positives = 0;
    var Negatives = 0;
    //console.log(DeckPoints);

    if (DeckPoints != null && DeckPoints.length > 0) {
        DeckPoints.forEach(point => {
            try {
                if (point !== undefined) {
                    if (point > 0) {
                        Positives += point;
                    } else {
                        Negatives += Math.abs(point);
                    }
                }                
            } catch {}            
        });
    }
    return Positives - Negatives;
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function NVL(value, defaultValue) {
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    return value;
}

function hasClass(element, className) {
    var _ret = false;
    try {
        _ret = element.className.split(" ").indexOf(className) !== -1;
    } catch {}
    return _ret;
}
function getRandom(min, max) {
    const floatRandom = Math.random();
    const difference = max - min;
    const random = Math.round(difference * floatRandom);
    const randomWithinRange = random + min;
    return randomWithinRange;
}
function getRandomUnique(min, max, existingNumbers) {
    let random;
    do {
        random = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (existingNumbers.includes(random));
    return random;
}

