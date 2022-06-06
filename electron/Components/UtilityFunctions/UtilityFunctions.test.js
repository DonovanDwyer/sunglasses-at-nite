const { title, whitespace, parseFilename, escaper } = require('./UtilityFunctions');

describe('The Title function', () => {
    it('capitalizes the first letter of each word in a given string', () => {
        const lowercase = 'the million dollar baby';
        const longLowercase = 'forbid you, good sir, forbid you, good sir, forbid you, good sir, forbid you, good sir';
        expect(title(lowercase)).toMatch(/The Million Dollar Baby/);
        expect(title(longLowercase)).toMatch(/Forbid You, Good Sir, Forbid You, Good Sir, Forbid You, Good Sir, Forbid You, Good Sir/);
    });
    it('always works the same way regardless of the case of a given string', () => {
        const allCaps = 'ALL CAPS WHEN YOU SPELL THE MAN\'S NAME';
        const sarcasmCase = 'rEmEmBeR tO uSe PrOpEr CaPiTaLiZaTiOn In TiTlEs';
        expect(title(allCaps)).toMatch(/All Caps when You Spell the Man's Name/);
        expect(title(sarcasmCase)).toMatch(/Remember to Use Proper Capitalization in Titles/);
    });
    it('always capitalizes the first word of each string', () => {
        const lowercase1 = 'a night to remember';
        const lowercase2 = 'the way she goes';
        expect(title(lowercase1)).toMatch(/A Night to Remember/);
        expect(title(lowercase2)).toMatch(/The Way She Goes/);
    });
    it('does not capitalize articles or conjuctions', () => {
        const tricky2 = 'somewhere under the vast black inasmuch sea';
        const tricky3 = 'the way the boy the girl had an afterschool class with acts is the way a criminal acts'
        const tricky4 = 'for and nor but or yet so for';
        const tricky5 = 'as long as';
        expect(title(tricky2)).toMatch(/Somewhere Under the Vast Black inasmuch Sea/);
        expect(title(tricky3)).toMatch(/The Way the Boy the Girl Had an Afterschool Class with Acts is the Way a Criminal Acts/);
        expect(title(tricky4)).toMatch(/For and nor but or yet so for/);
        expect(title(tricky5)).toMatch(/As Long as/);
    });
    it('capitalizes the first word after a colon or period', () => {
        const colon = 'This is the Way: a Tale as old as Time';
        const period = 'We are aboard the s.s. privilege';
        const sentences = 'threatening voicemails. a way to get what you want.';
        expect(title(colon)).toMatch(/This is the Way: A Tale as Old as Time/);
        expect(title(period)).toMatch(/We Are Aboard the S\.S\. Privilege/);
        expect(title(sentences)).toMatch(/Threatening Voicemails\. A Way to Get What You Want\./);
    });
    it('capitalizes both words in a hyphenated compound (this is against rules, but so what)', () => {
        const hyphen = 'This is my co-owner';
        const hyphen2 = 'I am half-blood';
        expect(title(hyphen)).toMatch(/This is My Co-Owner/);
        expect(title(hyphen2)).toMatch(/I Am Half-Blood/);
    });
});

describe('The Whitespace function', () => {
    it('replaces underscores with a single whitespace character', () => {
        const underscores = 'So_Whatcha_Whatcha_Want';
        const moreUnderscores = 'Um____so_yeah_____';
        expect(whitespace(underscores)).toMatch(/So Whatcha Whatcha Want/);
        expect(whitespace(moreUnderscores)).toMatch(/Um so yeah/);
    });
    it('replaces a given character with a single whitespace character', () => {
        const dot = 'So.Whatcha.Whatcha.Want';
        const moreDots = 'Um.....so.yeah......';
        expect(whitespace(dot, '.')).toMatch(/So Whatcha Whatcha Want/);
        expect(whitespace(moreDots, '.')).toMatch(/Um so yeah/);
    });
    it('replaces single whitespace characters with a given character when prompted', () => {
        const replacey = 'We Cant Have Spaces in a Filename Dude.avi';
        const replacey2 = 'Especially  Double  Spaces    Or  More  I  Mean  Seriously.mpeg';
        expect(whitespace(replacey, ' ', '.')).toMatch(/We.Cant.Have.Spaces.in.a.Filename.Dude.avi/);
        expect(whitespace(replacey2, ' ', '_')).toMatch(/Especially_Double_Spaces_Or_More_I_Mean_Seriously.mpeg/);
    });
});

describe('The Filename Parser function', () => {
    it('isolates the name of a file when given a absolute file path', () => {
        const path = 'C:/documents/what it is/this is the name of a video.avi';
        const path2 = '/usr/John.Smith/Applications/I.Think.This.Should.Work.txt';
        expect(parseFilename(path)).toMatch(/this is the name of a video/);
        expect(parseFilename(path2)).toMatch(/I\.Think\.This\.Should\.Work/);
    });
    it('isolates the filename when provided a filename with a file extension attached', () => {
        const file = 'Right out of the Gate.epub';
        const file2 = 'Sherlock.Holmes.Return.From.The.Dead.mobi';
        const file3 = 'Combination of the S.S. Charles.avi';
        expect(parseFilename(file)).toMatch(/Right out of the Gate/);
        expect(parseFilename(file2)).toMatch(/Sherlock\.Holmes\.Return\.From\.The\.Dead/);
        expect(parseFilename(file3)).toMatch(/Combination of the S\.S\. Charles/);
    });
});

describe('The Escaper function', () => {
    it('properly escapes strings in accordance to what iOS terminal accepts', () => {
        const cliCommand = './Document/File Name With A Bunch Of Spaces In It.txt';
        const cliCommand2 = './Applications/App Name with Spaces (And Parentheses).app';
        expect(escaper(cliCommand)).toMatch('./Document/File\\ Name\\ With\\ A\\ Bunch\\ Of\\ Spaces\\ In\\ It.txt');
        expect(escaper(cliCommand2)).toMatch('./Applications/App\\ Name\\ with\\ Spaces\\ \\(And\\ Parentheses\\).app');
    });
    test.todo('properly escapes strings in accordance to what Windows cmd expects');
    test.todo('escapes strings in order to work with JSON');
    test.todo('escapes strings in order to work with RegEx');
});