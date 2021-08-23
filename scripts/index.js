const clearFormBtn = document.getElementById('clear-form-btn');
const submitFormBtn = document.getElementById('submit-form-btn');
const swapLangBtn = document.getElementById('swap-lang-btn');

const textArea = document.getElementById('textarea');
const textOutput = document.getElementById('text-output');

let selectedOutputLang = 'dolphin';
let dialect = 'orca';

window.onload = () => {
    displayConsoleArt();
}

const handleClick = ( e ) => {
    if ( e.target === clearFormBtn ) {
        textArea.value = '';
        textArea.focus();
    } else if ( e.target === submitFormBtn ) {
        const translation = translate( selectedOutputLang, dialect, textArea.value );
        displayTranslation( translation );
    } else if ( e.target === swapLangBtn ) {
        toggleOutputLang();
    } else if ( e.target.hasAttribute( 'data-dialect' )) {
        setDialect( e.target.getAttribute( 'data-dialect') );
    }
}

const translate = ( lang, dialect, input ) => {
    let result;

    let charArray = input.split( '' );

    if ( lang === 'dolphin') {
        switch ( dialect ){
            case 'orca':
                result = encodeOrca( charArray );
                break;
            // case 'bottlenose':
            //     result = encodeBottlenose( charArray );
            //     break;
        }
    } else if ( lang === 'english' ) {
        switch ( dialect ) {
            case 'orca':
                result = decodeOrca(charArray);
                break;
            // case 'bottlenose':
            //     result = decodeBottlenose(charArray);
            //     break;
        }
    }

    return result.join('');
};

/////////////////* BOTTLENOSE *///////////////////
/*
* Return a space if input char is a space
* Encode input to ASCII
* Use modulo on the ASCII value to determine e or E
* */
// todo: refactor, use encodeAscii()
const encodeBottlenose = ( input ) => {
    return input.map( ( character ) => {
        if ( character === ' ' ) {
            return character;
        } else {
            return character.charCodeAt( 0 ) % 2 === 0 ? 'e' : 'E'
            // todo: impossible to decode back to Eng like this ^
        }
    });
};

/////////////////* ORCA *///////////////////
const encodeOrca = ( input ) => {
    return input.map( ( character ) => {
        if ( character === ' ' ) {
            return character;
        } else {
            const binaryArray = encodeToBinary( character ).split('');
            return binaryArray.map(( str ) => str === '1' ? 'e' : 'E' ).join('');
        }
    });
};

// todo: refactor + decodeBinary
const decodeOrca = ( input ) => {
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


/////////////////* EN/DECODE *///////////////////

// todo: docs & remaining en/decode functions
const encodeToBinary = ( char ) => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
};

// encodeAscii = () => {}
// decodeAscii = () => {}
// decodeBinary = () => {}

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
};

// todo: refactor all of this nicely
const toggleOutputLang = () => {
    selectedOutputLang = selectedOutputLang === 'dolphin' ? 'english' : 'dolphin';

    if ( selectedOutputLang === 'dolphin' ) {
        submitFormBtn.innerText = 'Dolphinate!';
        textArea.setAttribute( 'placeholder', 'Type something...');
    } else {
        submitFormBtn.innerText = 'Humanise!';
        textArea.setAttribute( 'placeholder', `${translate( 'dolphin', dialect, 'Type something' )}...`);
    }

    textArea.value = '';
}

const setDialect = ( newDialect ) => {
    dialect = newDialect;

    document.querySelectorAll('a[data-dialect]').forEach( btn => btn.classList.remove( 'btn-primary' ) );
    document.querySelectorAll('a[data-dialect]').forEach( btn => btn.classList.add( 'btn-primary-inverse' ) );
    switch ( newDialect ) {
        case 'bottlenose':
            document.querySelector('a[data-dialect="bottlenose"]').classList.add( 'btn-primary' );
            document.querySelector('a[data-dialect="bottlenose"]').classList.remove( 'btn-primary-inverse' );
            break;
        case 'orca':
            document.querySelector('a[data-dialect="orca"]').classList.add( 'btn-primary' );
            document.querySelector('a[data-dialect="orca"]').classList.remove( 'btn-primary-inverse' );
            break;
    }
}

document.addEventListener('click', handleClick );
