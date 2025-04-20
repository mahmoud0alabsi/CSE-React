const languageByExtensions = {
    js: "JavaScript",
    jsx: "JavaScript (React)",
    ts: "TypeScript",
    tsx: "TypeScript (React)",
    py: "Python",
    rb: "Ruby",
    php: "PHP",
    java: "Java",
    c: "C",
    cpp: "C++",
    cs: "C#",
    go: "Go",
    rs: "Rust",
    swift: "Swift",
    kt: "Kotlin",
    kts: "Kotlin Script",
    scala: "Scala",
    sh: "Shell",
    bash: "Bash",
    zsh: "Zsh",
    ps1: "PowerShell",
    html: "HTML",
    htm: "HTML",
    css: "CSS",
    scss: "Sass",
    less: "Less",
    json: "JSON",
    yaml: "YAML",
    yml: "YAML",
    xml: "XML",
    md: "Markdown",
    markdown: "Markdown",
    sql: "SQL",
    dockerfile: "Dockerfile",
    docker: "Docker",
    toml: "TOML",
    ini: "INI",
    cfg: "Configuration File",
    config: "Configuration File",
    txt: "Text",
    log: "Log File",
    makefile: "Makefile",
    mk: "Makefile",
    gradle: "Gradle",
    bat: "Batch",
    vue: "Vue.js",
    svelte: "Svelte",
    elm: "Elm",
    dart: "Dart",
    r: "R",
    jl: "Julia",
    lua: "Lua",
    pl: "Perl",
    groovy: "Groovy",
    vb: "Visual Basic",
    asp: "ASP.NET",
    coffee: "CoffeeScript",
    clj: "Clojure",
    cljc: "Clojure",
    edn: "Clojure EDN",
    lisp: "Lisp",
    scm: "Scheme",
    ex: "Elixir",
    exs: "Elixir Script",
    erl: "Erlang",
    hs: "Haskell",
    ml: "OCaml",
    mli: "OCaml Interface",
    fs: "F#",
    fsx: "F# Script",
    tex: "LaTeX",
    bib: "BibTeX",
    sql: "SQL",
    csv: "CSV",
    tsv: "TSV",
    db: "Database",
    env: "Environment Variables",
    properties: "Java Properties",
    proto: "Protocol Buffers",
    thrift: "Thrift",
    apex: "Apex",
    cls: "Apex Class",
    trigger: "Apex Trigger",
    feature: "Cucumber",
    story: "Storybook",
    feature: "Gherkin",
    solidity: "Solidity",
    asm: "Assembly",
    nasm: "Assembly (NASM)",
    vhd: "VHDL",
    verilog: "Verilog",
    sv: "SystemVerilog"
};


export const getLanguageByExtension = (extension) => {
    return languageByExtensions[extension] || "Unknown";
};

const extensionColorMap = {
    js: "#f7df1e",         // JavaScript (yellow)
    jsx: "#61dafb",        // React JSX (blue)
    ts: "#3178c6",         // TypeScript (blue)
    tsx: "#3178c6",        // TypeScript JSX
    py: "#3572A5",         // Python (blue)
    rb: "#701516",         // Ruby (dark red)
    php: "#4F5D95",        // PHP (blue-gray)
    java: "#b07219",       // Java (brown)
    c: "#555555",          // C (gray)
    cpp: "#f34b7d",        // C++ (pink)
    cs: "#178600",         // C# (green)
    go: "#00ADD8",         // Go (teal)
    rs: "#dea584",         // Rust (light brown)
    swift: "#ffac45",      // Swift (orange)
    kt: "#A97BFF",         // Kotlin (purple)
    kts: "#A97BFF",
    scala: "#c22d40",      // Scala (dark red)
    sh: "#89e051",         // Shell (green)
    bash: "#89e051",
    zsh: "#89e051",
    ps1: "#012456",        // PowerShell (dark blue)
    html: "#e34c26",       // HTML (orange)
    htm: "#e34c26",
    css: "#563d7c",        // CSS (purple)
    scss: "#c6538c",       // Sass (pink)
    less: "#1d365d",       // Less (blue)
    json: "#cbcb41",       // JSON (yellow)
    yaml: "#cb171e",       // YAML (red)
    yml: "#cb171e",
    xml: "#0060ac",        // XML (blue)
    md: "#083fa1",         // Markdown (blue)
    markdown: "#083fa1",
    sql: "#e38c00",        // SQL (orange)
    dockerfile: "#384d54", // Docker (gray blue)
    docker: "#384d54",
    toml: "#9c4221",       // TOML (brown)
    ini: "#6e6e6e",        // INI (gray)
    txt: "#cccccc",        // Plain text (light gray)
    log: "#999999",        // Log file (gray)
    vue: "#42b883",        // Vue.js (green)
    svelte: "#ff3e00",     // Svelte (orange-red)
    elm: "#60B5CC",        // Elm (blue)
    dart: "#00B4AB",       // Dart (cyan)
    r: "#198CE7",          // R (blue)
    jl: "#a270ba",         // Julia (purple)
    lua: "#000080",        // Lua (navy)
    pl: "#0298c3",         // Perl (cyan)
    groovy: "#4298b8",     // Groovy (blue)
    vb: "#945db7",         // Visual Basic (purple)
    asp: "#6a40fd",        // ASP.NET (purple)
    coffee: "#244776",     // CoffeeScript (dark blue)
    clj: "#db5855",        // Clojure (red)
    lisp: "#3fb68b",       // Lisp (green)
    ex: "#6e4a7e",         // Elixir (purple)
    exs: "#6e4a7e",
    erl: "#b83998",        // Erlang (magenta)
    hs: "#5e5086",         // Haskell (purple)
    ml: "#e37933",         // OCaml (orange)
    fs: "#b845fc",         // F# (purple)
    tex: "#3D6117",        // LaTeX (green)
    bib: "#008000",        // BibTeX (green)
    csv: "#cfcfcf",        // CSV (gray)
    tsv: "#cfcfcf",        // TSV (gray)
    env: "#6e6e6e",        // Env vars (gray)
    properties: "#aa0000", // Java Properties (red)
    proto: "#d10000",      // Protocol Buffers (red)
    thrift: "#f0e68c",     // Thrift (khaki)
    solidity: "#4e5f6d",   // Solidity (gray blue)
    asm: "#6E4C13",        // Assembly (brown)
    vhd: "#adb2cb",        // VHDL (gray)
    verilog: "#b2b7f8",    // Verilog (light blue)
    sv: "#b2b7f8"          // SystemVerilog
};

export const getFileColorByExtension = (extension) => {
    return extensionColorMap[extension] || "#9e9e9e";
}