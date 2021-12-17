const textArea = document.getElementById('textarea');
const output = document.getElementById('output');

const clearTextareaBtn = document.getElementById('clear-textarea-btn');
const swapDirectionBtn = document.getElementById('swap-direction-btn');
const submitBtn = document.getElementById('submit-btn');

let lang = 'human';
let theme = 'dark-theme';

window.onload = () => {
    displayConsoleArt();
    displayTranslation( translate( 'human', 'talk to dolpheens!' ));
};

const handleKeyUp = ( e ) => {
    if ( e.key === 'Enter' ){
        eventHandler( e );
        e.preventDefault();
    }
};

const eventHandler = ( e ) => {
    if ( e.target === clearTextareaBtn ){
        textArea.value = '';
        textArea.focus();
    }

    else if ( e.target === submitBtn ){
        clearOutput();
        e.target.blur();
        displayTranslation( translate( lang, textArea.value ) );
    }

    else if ( e.target === swapDirectionBtn || e.target === swapDirectionBtn.querySelector('img')) {
        swapTranslationDirection();
        updateTextareaPlaceholder();
        textArea.value = '';
    }

    else if ( e.target.hasAttribute( 'data-theme' ) ){
        removeClassOnElements( 'selected', document.querySelectorAll('[data-theme]'));
        setTheme( e.target.getAttribute( 'data-theme' ) );
        e.target.classList.add('selected');
    }
};

removeClassOnElements = ( className, elementArray ) => {
    for ( let i = 0; i < elementArray.length; i++ ){
        elementArray[i].classList.remove( className );
    }
}

const translate = ( inputLang, input ) => {
    let result;
    let charArray = input.split('');

    if ( inputLang === 'human' ) {
        result = encodeToDolphin( charArray );
    }

    else if ( inputLang === 'dolphin' ) {
        result = decodeFromDolphin( charArray );
    }

    return result.join('');
};

const encodeToDolphin = ( input ) => {
    return input.map( ( character ) => {
        if ( character === ' ' ) {
            return character;
        } else {
            const binaryArray = encodeToBinary( character ).split('');
            return binaryArray.map(( str ) => str === '1' ? 'e' : 'E' ).join('');
        }
    });
};

const encodeToBinary = ( char, padding = 16 ) => {
    return char.charCodeAt(0).toString(2).padStart( padding, '0');
};

const decodeFromDolphin = ( input ) => {
    const binaryArray = [];
    for ( const char of input ) {
        if ( char === ' ' ) {
            binaryArray.push(...[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ]);
        } else {
            binaryArray.push( char === 'e' ? 1 : 0 );
        }
    }

    const byteArray = [];
    for ( let i = 0;  i < binaryArray.length; i += 16 ) {
        byteArray.push(binaryArray.slice(i, i + 16).join(''))
    }

    return byteArray.map( byte => String.fromCharCode(parseInt( byte , 2 )) );
};

const displayTranslation = ( translation ) => {
    let counter = 0;

    interval = setInterval(() => {
        const character = translation.charAt( counter );
        if ( character === ' ' ) {
            output.innerHTML += '&nbsp;';
        } else {
            output.innerText += character;
        }

        counter++;

        if ( counter === translation.length ) {
            clearInterval( interval );
        }
    }, 2 );
};

const swapTranslationDirection = () => {
    lang = lang === 'dolphin' ? 'human' : 'dolphin';
};

const updateTextareaPlaceholder = () => {
    if ( lang === 'dolphin' ) {
        textArea.setAttribute( 'placeholder', 'EEEEEEEEEeeEEeEEEEEEEEEEEeeEEeEeEEEEEEEEEeeEEEeeEEEEEEEEEeeEeeeeEEEEEEEEEeeEEeEEEEEEEEEEEeeEEeEe');
    } else if ( lang === 'human' ) {
        textArea.setAttribute( 'placeholder', 'Encode to dolphin' );
    }
};

const clearOutput = () => {
    output.innerText = '';

    if (interval) {
        clearInterval(interval);
        interval = null;
    }
};

const setTheme = ( newTheme ) => {
    const body = document.getElementsByTagName( 'BODY' )[0];
    body.classList.remove( theme );
    theme = newTheme;
    body.classList.add( theme );
}

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

document.addEventListener('click', eventHandler );
document.addEventListener('keydown', handleKeyUp );
