// buttons
const clearFormBtn = document.getElementById('clear-form-btn');
const submitFormBtn = document.getElementById('submit-form-btn');
const swapLangBtn = document.getElementById('swap-lang-btn');

const textArea = document.getElementById('textarea');
const textOutput = document.getElementById('text-output');

// data-attributes
const selectedDialect = document.getAttribute('data-selected-dialect');
const selectedOutputLang = document.getAttribute('data-selected-output-lang');

window.onload = () => {
    displayConsoleArt();
}

const handleClick = ( e ) => {
    if ( e.target === clearFormBtn ) {
        textArea.value = '';
        textArea.focus();
    } else if ( e.target === submitFormBtn ) {
        const translation = translate( getDialect(), textArea.value );
        displayTranslation( translation );
    }
}

const translate = ( lang, dialect, input ) => {
    let result;

    let charArray = input.split( '' );

    if ( lang === 'dolphin') {
        switch ( dialect ){
            case 'orca':
                result = convertToOrca( charArray );
                break;
            // case 'bottlenose':
            //     result = convertToAscii( charArray );
            //     break;
        }
    } else if ( lang === 'english' ) {
        switch ( dialect ) {
            case 'orca':
                result = revertFromOrca(charArray);
                break;
        }
    }

    return result.join('');
};

const getDialect = () => {
    return nav.getAttribute( 'data-selected-dialect' );
};

const convertToAscii = ( input ) => {
    return input.map( ( character ) => {
        if ( character === ' ' ) {
            return character;
        } else {
            return character.charCodeAt( 0 ) % 2 === 0 ? 'e' : 'E'
        }
    });
};

const convertToOrca = ( input ) => {
    return input.map( ( character ) => {
        if ( character === ' ' ) {
            return character;
        } else {
            const binaryArray = encodeToBinary( character ).split('');
            return binaryArray.map(( str ) => str === '1' ? 'e' : 'E' ).join('');
        }
    });
};

// todo: refactor into some separate funcs
const revertFromOrca = ( input ) => {
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

const encodeToBinary = ( char ) => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
};

const displayTranslation = ( output ) => {
    textOutput.innerText = output;
};

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
}

document.addEventListener('click', handleClick );
