var UserLang = 'en';    //<- General UI Language (en,es,de,fr,ru)
var UserDeck = 'Marsella';   //<- Design of the Card Deck
var CardCount = 6;      //<- How many Cards should we draw
var LANG = null;        //<- UI Translations
var MyDeck = null;      //<- Data of all cards
var MyCards = [];       //<- Random Cards currently chosen

$('#cboLanguage').on('change', function () {
    UserLang = $(this).val(); //<- Valor Seleccionado
    setCookie("UserLang", UserLang, 7); //<- Remembers User's choice for 7 days
    TranslateUI(UserLang);
});
$('#cboUserDeck').on('change', function () {
    UserDeck = $(this).val();
    setCookie("UserDeck", UserDeck, 7); //<- Remembers User's choice for 7 days
    ShuffleCards();
});
$('#cboCardCount').on('change', function () {
    CardCount = $(this).val();
    setCookie("CardCount", CardCount, 7); //<- Remembers User's choice for 7 days
    ShuffleCards();
});

$(document).on("click", "#cmdDrawCards", function (evt) {
    console.log('Boton cmdDrawCards');
    ShuffleCards();
}); 
$(document).on("click", "#cmdFlipCards", function (evt) {
    console.log('Boton cmdFlipCards');

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
    var button = event.relatedTarget; //<- Button that triggered the modal  
    var jsonData = button.getAttribute('data-bs-info'); //<- Extract info from data-bs-* attributes
    if (jsonData != null) {
        const CardData = JSON.parse(jsonData); console.log(CardData);

        var modalTitle = CardInfo.querySelector('.modal-title');
            modalTitle.textContent = CardData.name;

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
})

Iniciar();
function Iniciar() {
    try {
        UserLang = NVL(getCookie("UserLang"), 'en'); //console.log(UserLang);
        UserDeck = NVL(getCookie("UserDeck"), 'Marsella');
        CardCount= NVL(getCookie("CardCount"), 6);

        $.getJSON('assets/ui_translations.json', function (data) {
            LANG = data;
            TranslateUI(UserLang);
        });
        $.getJSON('decks/Cards.json', function (data) {
            MyDeck = data;
            ShuffleCards();
        });

    } catch (e) {
        $.alert({ title: e.name, content: e.message, useBootstrap: false });
    }
}

function TranslateUI(lang) {
    if (LANG != null) {
        $('#cboLanguage').val(UserLang); 
        $('#cboUserDeck').val(UserDeck); 
        $('#cboCardCount').val(CardCount);

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

        // TODO: El pie de pagina
    }
}

function ShuffleCards() {
    if (MyDeck != null) {
        MyCards = [];

        // Hide all Cards
        for (let index = 1; index <= 9; index++) {
            const myCard = document.getElementById('Card-0'+ index +'-div');
            if (!hasClass(myCard, "invisible")) {
                myCard.className += " invisible";
            }
        }

        // 1. Get random IDs for the cards chosen:
        const randomCards = [];
        for (let i = 1; i <= CardCount; i++) {
            randomCards.push(getRandomUnique(0, 8, randomCards)); //TODO: reemplazar el 8 x el total de cartas
        }

        // 2. Get the Actual cards from the chosen IDs:
        if (randomCards != null && randomCards.length > 0) {
            randomCards.forEach(number => {
                try {
                    var MyCard = MyDeck[number].translations[UserLang]; //<- Translated to the selected language
                    MyCard.id = MyDeck[number].type + '-' + MyDeck[number].id; //<- Name for the Picture
                    MyCard.number = MyDeck[number].number;
                    MyCard.is_inverted = getRandom(0, 12) < 5; //<- 40% chance of being inverted
                    MyCards.push(MyCard);
                } catch { }
            });
        }
        console.log(MyCards);

        // 3. Add the cards to the deck
        for (let index = 1; index <= MyCards.length; index++) {
            //Add the Data to each card
            $("#Card-0" + index).attr("data-bs-info", JSON.stringify(MyCards[index - 1]));  
            $("#Card-0" + index + "-img").attr("src", "decks/"+ UserDeck +"/background.jpg"  );  
            
            //Make the Card Visible again
            const myCard = document.getElementById('Card-0'+ index +'-div');
                  myCard.className = myCard.className.replace(" invisible", "");
        }
    }
}
function FlipCards() {
    try {
        
    } catch (error) {
        
    }
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
    return element.className.split(" ").indexOf(className) !== -1;
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

