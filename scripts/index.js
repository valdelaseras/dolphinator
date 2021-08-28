const nav = document.getElementById('nav');
const navScriptBtns = nav.querySelectorAll('[data-script]');

const clearTextareaBtn = document.getElementById('clear-textarea-btn');
const submitFormBtn = document.getElementById('submit-form-btn');
const swapDirectionBtn = document.getElementById('swap-direction-btn');

const textArea = document.getElementById('textarea');
const translationOutput = document.getElementById('translation-output');

// opposite option is 'human'
let lang = 'dolphin';
// other option is 'Japanese'
let script = 'latin';
let interval;

window.onload = () => {
    displayConsoleArt();
    updateTextareaPlaceholder();

    if ( screen.width >= 768 ){
        displayTranslation( translate( 'dolphin', 'latin', 'w e l c o m e' ));
    }
}

const handleKeyUp = ( e ) => {
    if ( e.key === 'Enter' ) {
        eventHandler( e );
        e.preventDefault();
    }
};

const eventHandler = ( e ) => {
    if ( e.target === clearTextareaBtn) {
        textArea.value = '';
        textArea.focus();

    } else if ( e.target === submitFormBtn) {
        clearOutput();
        e.target.blur();
        displayTranslation( translate( lang, script, textArea.value) );

    } else if (e.target === swapDirectionBtn || e.target === swapDirectionBtn.querySelector('img') ) {
        swapTranslationDirection();

    } else if ( e.target.hasAttribute('data-script')){
        updateScript( e );
    }
}

const updateScript = ( e ) => {
    // handle script button classes
    removeClassOnElements( 'selected', navScriptBtns );
    e.target.classList.add('selected');

    // set script to target script
    script = e.target.getAttribute( 'data-script');

    // update the textarea accordingly
    updateTextareaPlaceholder();
    textArea.value = '';
    textArea.focus();

    clearOutput();
}

/*
* Clear the translation output field and any interval that may or may not be
* running
*/
const clearOutput = () => {
    translationOutput.innerText = '';
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

/*
* Switch cases to handle the correct en/decoders based on the
* selected lang ( human or dolphin ), script ( japanese or latin alphabets )
* to translate the input
*/
const translate = ( lang, script, input ) => {
    let result;
    let charArray = input.split( '' );

    if ( lang === 'human') {
        switch( script ) {
            case 'latin':
                result = decodeFromLatinDolphin( charArray );
                break
            case 'japanese':
                result = decodeFromJapaneseDolphin( charArray );
                break
        }
    } else if ( lang === 'dolphin' ) {
        switch( script ){
            case 'latin':
                result = encodeToLatinDolphin( charArray );
                break
            case 'japanese':
                result = encodeToJapaneseDolphin( charArray );
                break
        }
    }

    return result.join('');
};




/////////////////* START ENCODE TO BINARY *///////////////////
/*
* Encode latin alphabet to binary. Default padding is 8,
* but Japanese chars for example need 24 padding
*/
const encodeToBinary = ( char, padding = 8 ) => {
    return char.charCodeAt(0).toString(2).padStart( padding, '0');
};
/////////////////* END ENCODE TO BINARY *///////////////////




/////////////////* START EN/DECODE LATIN ALPHABET *///////////////////
/*
* Decode Latin dolphin via binary to latin alphabet
*/
const decodeFromLatinDolphin = (input ) => {
    const binaryArray = [];
    for ( const char of input ) {
        if ( char === ' ' ) {
            binaryArray.push(...[ 0, 0, 1, 0, 0, 0, 0, 0 ]);
        } else {
            binaryArray.push( char === 'e' ? 1 : 0 );
        }
    }

    const byteArray = [];
    for ( let i = 0;  i < binaryArray.length; i += 8 ) {
        byteArray.push(binaryArray.slice(i, i + 8).join(''))
    }

    return byteArray.map( byte => String.fromCharCode(parseInt( byte , 2 )) );
};

/*
* Encode latin alphabet to latin dolphin via binary encoding
*/
const encodeToLatinDolphin = ( input ) => {
    return input.map( ( character ) => {
        if ( character === ' ' ) {
            return character;
        } else {
            const binaryArray = encodeToBinary( character ).split('');
            return binaryArray.map(( str ) => str === '1' ? 'e' : 'E' ).join('');
        }
    });
};
/////////////////* END EN/DECODE LATIN ALPHABET*///////////////////




/////////////////* START EN/DECODE JAPANESE ALPHABET*///////////////////
/*
* Encode Japanese dolphin to human Japanese via binary decoding
*/
const decodeFromJapaneseDolphin = ( input ) => {
    const binaryArray = [];
    for ( const char of input ) {
        binaryArray.push( char === 'エ' ? 1 : 0 );
    }

    const byteArray = [];
    for ( let i = 0;  i < binaryArray.length; i += 24 ) {
        byteArray.push(binaryArray.slice(i, i + 24).join(''))
    }

    return byteArray.map( byte => String.fromCharCode(parseInt( byte , 2 )) );
}

/*
* Encode human Japanese to dolphin Japanese via binary encoding
*/
const encodeToJapaneseDolphin = ( input ) => {
    return input.map( ( character ) => {
        const binaryArray = encodeToBinary( character, 24 ).split('');
        return binaryArray.map(( str ) => str === '1' ? 'エ' : 'え' ).join('');
    });
}
/////////////////* END EN/DECODE JAPANESE ALPHABET*///////////////////




/////////////////* START OUTPUT TOGGLE *///////////////////
/*
* Switch from Human to Dolphin and vice versa.
*/
const swapTranslationDirection = () => {
    lang = lang === 'dolphin' ? 'human' : 'dolphin';
    updateTextareaPlaceholder();
    textArea.value = '';
};

const updateTextareaPlaceholder = ()  => {
    if ( lang === 'dolphin' ) {
        if ( script === 'japanese' ){
            textArea.setAttribute('placeholder', 'テキストを入力してください。。。');
        } else {
            textArea.setAttribute( 'placeholder', 'Type something...');
        }
    } else {
        if ( script === 'japanese' ){
            textArea.setAttribute( 'placeholder', `${translate( 'dolphin', 'japanese', 'テキストを入力してください' )}。。。`);
        } else {
            textArea.setAttribute( 'placeholder', `${translate( 'dolphin', 'latin', 'Type something' )}...`);
        }
    }
}
/////////////////* END OUTPUT TOGGLE *///////////////////




/////////////////* START DISPLAY *///////////////////
/*
* Display the translation character by character
* with a slight interval to create a typewriter
* effect
*/
const displayTranslation = ( translation ) => {
    let counter = 0;

    interval = setInterval(() => {
        const character = translation.charAt( counter );
        if ( character === ' ' ) {
            translationOutput.innerHTML += '&nbsp;';
        } else {
            translationOutput.innerText += character;
        }

        counter++;

        if ( counter === translation.length ) {
            clearInterval( interval );
        }
    }, 5);
};

/*
* Remove a class on a collection of elements
*/
removeClassOnElements = ( className, elementArray ) => {
    for ( let i = 0; i < elementArray.length; i++ ){
        elementArray[i].classList.remove( className );
    }
}

/*
 * Just display some extra dolphins in console :3
 */
const displayConsoleArt = () => {
    console.log(
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '                                  __\n' +
        '                               _.-~  )\n' +
        '                    _..--~~~~,\'   ,-/     _\n' +
        '                 .-\'. . . .\'   ,-\',\'    ,\' )\n' +
        '               ,\'. . . _   ,--~,-\'__..-\'  ,\'\n' +
        '             ,\'. . .  (@)\' ---~~~~      ,\'\n' +
        '            /. . . . \'~~             ,-\'\n' +
        '           /. . . . .             ,-\'\n' +
        '          ; . . . .  - .        ,\'\n' +
        '         : . . . .       _     /\n' +
        '        . . . . .          `-.:\n' +
        '       . . . ./  - .          )\n' +
        '      .  . . |  _____..---.._/ ____ Seal _\n' +
        '~---~~~~----~~~~             ~~\n' +
        '\n' +
        '\n'
    );
};
/////////////////* END DISPLAY *///////////////////

document.addEventListener('click', eventHandler );
document.addEventListener('keydown', handleKeyUp );
