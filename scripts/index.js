const clearFormBtn = document.getElementById('clear-form-btn');
const submitFormBtn = document.getElementById('submit-form-btn');
const swapLangBtn = document.getElementById('swap-lang-btn');

const textArea = document.getElementById('textarea');
const textOutput = document.getElementById('text-output');

const defaultDolphinTextOutput = textOutput.value = 'EeeEeEEEEeeEEeEeEeeEeeEEEeeEeeEEEeeEeeee EeEEeEEe EeeEEEEeEeeEeeEe EeeEEeEEEeeEeeeeEeeEeeEEEeeeEEEEEeeEeEEEEeeEeEEeEeeEeeeE';
const defaultHumanTextOutput = textOutput.value = 'Hello, I am dolphin';

let selectedOutputLang = 'dolphin';
let dialect = 'orca';
let interval;

window.onload = () => {
    displayConsoleArt();

    if ( screen.width >= 768 ){
        if ( selectedOutputLang === 'dolphin' ){
            displayTranslation( defaultDolphinTextOutput );
        } else {
            displayTranslation( defaultHumanTextOutput );
        }
    }
}

const handleKeyUp = ( e ) => {
    if ( e.key === 'Enter' ) {
        eventHandler( e );

        e.preventDefault();
    }
};

const eventHandler = ( e ) => {
    if ( e.target === clearFormBtn) {
        textArea.value = '';
        textArea.focus();
    } else if ( e.target === submitFormBtn) {
        textOutput.innerText = '';
        submitFormBtn.blur();

        if (interval) {
            clearInterval(interval);
            interval = null;
        }

        const translation = translate(selectedOutputLang, dialect, textArea.value);
        displayTranslation(translation);
    } else if (e.target === swapLangBtn) {
        toggleOutputLang();
        textArea.focus();
    }
}

/*
* Switch to translate in the intended language ( which is either ENG > Dolphin or
* vice versa ). The dialects ( dolphin species ) have different en/decode methods,
* resulting in different dolphin language outputs.
*/
const translate = ( lang, dialect, input ) => {
    let result;
    let charArray = input.split( '' );

    if ( lang === 'dolphin') {
        switch ( dialect ){
            case 'orca':
                result = encodeToOrca( charArray );
                break;
        }
    } else if ( lang === 'english' ) {
        switch ( dialect ) {
            case 'orca':
                result = decodeFromOrca( charArray );
                break;
        }
    }

    return result.join('');
};

/////////////////* START EN/DECODE *///////////////////
/*
* Encode English to binary
*/
const encodeToBinary = ( char ) => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
};

/*
* Decode orca dialect via binary to English
*/
const decodeFromOrca = ( input ) => {
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
* Encode English to orca dialect via binary encoding
*/
const encodeToOrca = ( input ) => {
    return input.map( ( character ) => {
        if ( character === ' ' ) {
            return character;
        } else {
            const binaryArray = encodeToBinary( character ).split('');
            return binaryArray.map(( str ) => str === '1' ? 'e' : 'E' ).join('');
        }
    });
};
/////////////////* END EN/DECODE *///////////////////

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
            textOutput.innerHTML += '&nbsp;';
        } else {
            textOutput.innerText += character;
        }

        counter++;

        if ( counter === translation.length ) {
            clearInterval( interval );
        }
    }, 5);
};

/*
 * Just display some extra dolphins in console :3
 */
const displayConsoleArt = () => {
    console.log(
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '                                    _\n' +
        '                               _.-~~.)\n' +
        '         _.--~~~~~---....__  .\' . .,\'\n' +
        '       ,\'. . . . . . . . . .~- ._ (\n' +
        '      ( .. .g. . . . . . . . . . .~-._\n' +
        '   .~__.-~    ~`. . . . . . . . . . . -.\n' +
        '   `----..._      ~-=~~-. . . . . . . . ~-.\n' +
        '             ~-._   `-._ ~=_~~--. . . . . .~.\n' +
        '              | .~-.._  ~--._-.    ~-. . . . ~-.\n' +
        '               \\ .(   ~~--.._~\'       `. . . . .~-.                ,\n' +
        '                `._\\         ~~--.._    `. . . . . ~-.    .- .   ,\'/\n' +
        '_  . _ . -~\\        _ ..  _          ~~--.`_. . . . . ~-_     ,-\',\'`  .\n' +
        '             ` ._           ~                ~--. . . . .~=.-\'. /. `\n' +
        '       - . -~            -. _ . - ~ - _   - ~     ~--..__~ _,. /   \\  - ~\n' +
        '              . __ ..                   ~-               ~~_. (  `\n' +
        ')`. _ _               `-       ..  - .    . - ~ ~ .    \\    ~-` ` `  `. _\n' +
        '      _ Seal _\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        'All awesome ASCII art by Seal \n' +
        '\n' +
        '\n'
    );
};
/////////////////* END DISPLAY *///////////////////

/////////////////* START OUTPUT LANG TOGGLE *///////////////////
/*
* Switch from English to Dolphin and vice versa.
* The dialect indicates dolphin species and a different en/decoder method
*/
const toggleOutputLang = () => {
    selectedOutputLang = selectedOutputLang === 'dolphin' ? 'english' : 'dolphin';

    if ( selectedOutputLang === 'dolphin' ) {
        submitFormBtn.innerText = 'dolphinate!';
        textArea.setAttribute( 'placeholder', 'Type something...');
    } else {
        submitFormBtn.innerText = 'humanise!';
        textArea.setAttribute( 'placeholder', `${translate( 'dolphin', dialect, 'Type something' )}...`);
    }

    textArea.value = '';
};
/////////////////* END OUTPUT LANG TOGGLE *///////////////////

document.addEventListener('click', eventHandler );
document.addEventListener('keydown', handleKeyUp );
