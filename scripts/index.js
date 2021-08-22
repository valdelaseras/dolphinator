const clearFormBtn = document.getElementById('clear-form-btn');
const submitFormBtn = document.getElementById('submit-form-btn');
const textArea = document.getElementById('textarea');
const textOutput = document.getElementById('text-output');
const nav = document.getElementById('nav');
const selectedDialect = nav.getAttribute('data-selected-dialect');

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

const translate = ( dialect, input ) => {
    let result;

    let charArray = input.split( '' );

    switch ( dialect ){
        case 'orca':
            result = convertToBinary( charArray );
            break;
        case 'bottlenose':
            result = convertToAscii( charArray );
            break;
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

const convertToBinary = ( input ) => {
    return input.map( ( character ) => {
        if ( character === ' ' ) {
            return character;
        } else {
            const binaryArray = character.charCodeAt( 0 ).toString(2 ).split('');
            return binaryArray.map((string) => string === '1' ? 'e' : 'E' ).join('');
        }
    });
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
