/**
 * PipOS Terminal Built-In Man Pages (man <cmd>)
 * Formatted manual pages for POSIX shell commands with syntax, flags, and examples.
 * Zero external dependencies. IEEE IGDTUW Open Source Week 10.0.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PipMan = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const MAN_PAGES = {
    help: {
      name: 'help - display shell command index',
      synopsis: 'help',
      description: 'Lists all available builtin commands in PipOS Midnight Shell.',
      examples: ['help']
    },
    man: {
      name: 'man - format and display manual pages',
      synopsis: 'man <command>',
      description: 'Displays the reference manual for the specified PipOS shell command.',
      examples: ['man ls', 'man cat', 'man grep']
    },
    ls: {
      name: 'ls - list directory contents',
      synopsis: 'ls [-l] [-a] [path]',
      description: 'List information about files in the current directory or specified path.',
      examples: ['ls', 'ls -l', 'ls /home/pip']
    },
    cat: {
      name: 'cat - concatenate files and print on standard output',
      synopsis: 'cat <file> [file...]',
      description: 'Reads files sequentially, writing them to standard output.',
      examples: ['cat readme.txt', 'cat notes.txt']
    },
    echo: {
      name: 'echo - display a line of text',
      synopsis: 'echo [string...]',
      description: 'Write arguments to standard output, separated by single space.',
      examples: ['echo "Goodnight stars"', 'echo hello world > note.txt']
    },
    clear: {
      name: 'clear - clear the terminal screen',
      synopsis: 'clear',
      description: 'Clears terminal display buffer and resets cursor to top-left.',
      examples: ['clear']
    },
    pwd: {
      name: 'pwd - print name of current/working directory',
      synopsis: 'pwd',
      description: 'Print the full filename of the current working directory in PipFS.',
      examples: ['pwd']
    },
    mkdir: {
      name: 'mkdir - make directories',
      synopsis: 'mkdir <directory...>',
      description: 'Create directory or directories, if they do not already exist.',
      examples: ['mkdir lullabies', 'mkdir /home/pip/dreams']
    },
    rm: {
      name: 'rm - remove files or directories',
      synopsis: 'rm <file...>',
      description: 'Removes files from PipFS virtual filesystem.',
      examples: ['rm old_note.txt']
    },
    touch: {
      name: 'touch - change file timestamps or create empty file',
      synopsis: 'touch <file...>',
      description: 'Creates empty files or touches existing files in PipFS.',
      examples: ['touch diary.txt']
    },
    grep: {
      name: 'grep - print lines that match patterns',
      synopsis: 'grep [-i] [-v] <pattern> [file]',
      description: 'Searches for pattern in standard input or files, printing matching lines.',
      examples: ['cat story.txt | grep Pip', 'grep -i moon dreams.txt']
    },
    wc: {
      name: 'wc - print newline, word, and byte counts',
      synopsis: 'wc [-l] [-w] [-c] [file]',
      description: 'Print newline, word, and byte counts for each file or standard input stream.',
      examples: ['cat story.txt | wc -w', 'wc -l notes.txt']
    },
    sort: {
      name: 'sort - sort lines of text files',
      synopsis: 'sort [-r] [-n] [file]',
      description: 'Write sorted concatenation of all files to standard output.',
      examples: ['cat names.txt | sort', 'cat scores.txt | sort -r']
    },
    calc: {
      name: 'calc - evaluate arithmetic expressions',
      synopsis: 'calc <expression>',
      description: 'Evaluates arithmetic and algebraic math expressions directly in shell.',
      examples: ['calc 24 * 7', 'calc sqrt(144)']
    },
    theme: {
      name: 'theme - get or set PipOS desktop theme',
      synopsis: 'theme [day|night|contrast]',
      description: 'Switches the desktop theme mode or prints the active theme.',
      examples: ['theme', 'theme night', 'theme contrast']
    }
  };

  function formatManPage(entry) {
    if (!entry) return null;
    return [
      `NAME`,
      `    ${entry.name}`,
      ``,
      `SYNOPSIS`,
      `    ${entry.synopsis}`,
      ``,
      `DESCRIPTION`,
      `    ${entry.description}`,
      ``,
      `EXAMPLES`,
      ...entry.examples.map(ex => `    $ ${ex}`),
      ``
    ].join('\n');
  }

  function getManPage(cmd) {
    if (!cmd || typeof cmd !== 'string') return null;
    const cleanCmd = cmd.trim().toLowerCase();
    const entry = MAN_PAGES[cleanCmd];
    return entry ? formatManPage(entry) : null;
  }

  return {
    MAN_PAGES,
    formatManPage,
    getManPage
  };
});
