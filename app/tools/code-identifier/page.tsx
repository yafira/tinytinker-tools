"use client";
import { useState } from "react";
import ToolPage from "@/components/ToolPage";

interface Match {
  language: string;
  score: number;
  features: string[];
}

const PATTERNS: {
  language: string;
  patterns: { regex: RegExp; weight: number; label: string }[];
}[] = [
  {
    language: "python",
    patterns: [
      { regex: /def\s+\w+\s*\(/, weight: 10, label: "function definition (def)" },
      { regex: /import\s+\w+|from\s+\w+\s+import/, weight: 8, label: "import statement" },
      { regex: /:\s*\n\s+/, weight: 7, label: "colon + indentation block" },
      { regex: /print\s*\(/, weight: 5, label: "print() call" },
      { regex: /if\s+__name__\s*==\s*['"]__main__['"]/, weight: 10, label: "__main__ guard" },
      { regex: /\[\s*\w+\s+for\s+\w+\s+in/, weight: 9, label: "list comprehension" },
      { regex: /lambda\s+\w+\s*:/, weight: 8, label: "lambda expression" },
      { regex: /class\s+\w+(\s*\(.*\))?\s*:/, weight: 8, label: "class definition" },
      { regex: /#.*$/, weight: 2, label: "# comment" },
      { regex: /elif\s+/, weight: 9, label: "elif keyword" },
    ],
  },
  {
    language: "javascript",
    patterns: [
      { regex: /const\s+\w+\s*=|let\s+\w+\s*=|var\s+\w+\s*=/, weight: 7, label: "const/let/var declaration" },
      { regex: /=>\s*[{(]/, weight: 9, label: "arrow function" },
      { regex: /console\.log\(/, weight: 8, label: "console.log()" },
      { regex: /document\.querySelector|addEventListener/, weight: 10, label: "DOM manipulation" },
      { regex: /require\(|module\.exports/, weight: 9, label: "CommonJS require/exports" },
      { regex: /import\s+.*\s+from\s+['"]/, weight: 8, label: "ES6 import" },
      { regex: /async\s+function|await\s+/, weight: 7, label: "async/await" },
      { regex: /===|!==/, weight: 5, label: "strict equality" },
      { regex: /\$\{.*\}/, weight: 7, label: "template literal" },
      { regex: /\.then\(|\.catch\(|\.finally\(/, weight: 8, label: "promise chain" },
    ],
  },
  {
    language: "typescript",
    patterns: [
      { regex: /:\s*(string|number|boolean|void|any|never|unknown)/, weight: 10, label: "type annotation" },
      { regex: /interface\s+\w+\s*\{/, weight: 10, label: "interface declaration" },
      { regex: /type\s+\w+\s*=/, weight: 9, label: "type alias" },
      { regex: /<\w+>/, weight: 6, label: "generic type" },
      { regex: /as\s+(string|number|boolean|\w+)/, weight: 8, label: "type assertion" },
      { regex: /readonly\s+\w+/, weight: 9, label: "readonly modifier" },
      { regex: /enum\s+\w+\s*\{/, weight: 10, label: "enum declaration" },
      { regex: /\?\s*:/, weight: 7, label: "optional property" },
      { regex: /implements\s+\w+/, weight: 9, label: "implements keyword" },
      { regex: /\w+\[\]|Array<\w+>/, weight: 6, label: "typed array" },
    ],
  },
  {
    language: "rust",
    patterns: [
      { regex: /fn\s+\w+\s*\(/, weight: 10, label: "function definition (fn)" },
      { regex: /let\s+mut\s+/, weight: 10, label: "mutable binding (let mut)" },
      { regex: /use\s+std::/, weight: 10, label: "std library import" },
      { regex: /println!\(|eprintln!\(|format!\(/, weight: 9, label: "macro call" },
      { regex: /impl\s+\w+/, weight: 9, label: "impl block" },
      { regex: /struct\s+\w+\s*\{/, weight: 9, label: "struct definition" },
      { regex: /enum\s+\w+\s*\{/, weight: 8, label: "enum definition" },
      { regex: /->\s*\w+/, weight: 6, label: "return type arrow" },
      { regex: /&(mut\s+)?\w+/, weight: 5, label: "reference" },
      { regex: /match\s+\w+\s*\{/, weight: 9, label: "match expression" },
    ],
  },
  {
    language: "go",
    patterns: [
      { regex: /^package\s+\w+/m, weight: 10, label: "package declaration" },
      { regex: /func\s+\w+\s*\(/, weight: 9, label: "function definition (func)" },
      { regex: /import\s+\(|import\s+"/, weight: 8, label: "import statement" },
      { regex: /fmt\.Print|fmt\.Println|fmt\.Sprintf/, weight: 9, label: "fmt package" },
      { regex: /:=\s*/, weight: 9, label: "short variable declaration (:=)" },
      { regex: /var\s+\w+\s+\w+/, weight: 7, label: "var declaration with type" },
      { regex: /goroutine|go\s+func/, weight: 10, label: "goroutine" },
      { regex: /chan\s+\w+|<-/, weight: 10, label: "channel" },
      { regex: /defer\s+/, weight: 9, label: "defer statement" },
      { regex: /interface\s*\{/, weight: 7, label: "interface" },
    ],
  },
  {
    language: "css",
    patterns: [
      { regex: /\{[\s\S]*?:\s*[\s\S]*?;[\s\S]*?\}/, weight: 8, label: "property: value; block" },
      { regex: /[.#][\w-]+\s*\{/, weight: 9, label: "class/id selector" },
      { regex: /@media\s*\(/, weight: 10, label: "@media query" },
      { regex: /var\(--[\w-]+\)/, weight: 10, label: "CSS custom property" },
      { regex: /display:\s*(flex|grid|block|inline)/, weight: 9, label: "display property" },
      { regex: /:hover|:focus|:active|::before|::after/, weight: 9, label: "pseudo-class/element" },
      { regex: /@keyframes\s+\w+/, weight: 10, label: "@keyframes animation" },
      { regex: /margin:|padding:|border:|background:|color:/, weight: 6, label: "common CSS property" },
      { regex: /rgba?\(|hsla?\(/, weight: 7, label: "color function" },
      { regex: /px|rem|em|vh|vw|%/, weight: 4, label: "CSS unit" },
    ],
  },
  {
    language: "html",
    patterns: [
      { regex: /<!DOCTYPE\s+html>/i, weight: 10, label: "DOCTYPE declaration" },
      { regex: /<html|<head|<body|<div|<span|<p>/, weight: 9, label: "HTML tags" },
      { regex: /class=["']|id=["']/, weight: 7, label: "class/id attribute" },
      { regex: /<\/\w+>/, weight: 6, label: "closing tag" },
      { regex: /href=["']|src=["']/, weight: 8, label: "href/src attribute" },
      { regex: /<meta\s|<link\s|<script/, weight: 8, label: "meta/link/script tag" },
      { regex: /<!--[\s\S]*?-->/, weight: 7, label: "HTML comment" },
      { regex: /&\w+;|&#\d+;/, weight: 9, label: "HTML entity" },
      { regex: /data-[\w-]+=/, weight: 8, label: "data attribute" },
      { regex: /aria-[\w-]+=/, weight: 8, label: "aria attribute" },
    ],
  },
  {
    language: "java",
    patterns: [
      { regex: /public\s+class\s+\w+/, weight: 10, label: "public class declaration" },
      { regex: /public\s+static\s+void\s+main/, weight: 10, label: "main method" },
      { regex: /System\.out\.println/, weight: 10, label: "System.out.println()" },
      { regex: /import\s+java\./, weight: 10, label: "java stdlib import" },
      { regex: /new\s+\w+\(/, weight: 6, label: "object instantiation" },
      { regex: /@Override|@Deprecated|@SuppressWarnings/, weight: 9, label: "annotation" },
      { regex: /throws\s+\w+Exception/, weight: 9, label: "throws clause" },
      { regex: /private|protected|public/, weight: 4, label: "access modifier" },
      { regex: /ArrayList|HashMap|LinkedList/, weight: 9, label: "java collection" },
      { regex: /extends\s+\w+|implements\s+\w+/, weight: 8, label: "extends/implements" },
    ],
  },
  {
    language: "c",
    patterns: [
      { regex: /#include\s*<\w+\.h>/, weight: 10, label: "#include header" },
      { regex: /int\s+main\s*\(/, weight: 10, label: "main() function" },
      { regex: /printf\s*\(|scanf\s*\(/, weight: 9, label: "printf/scanf" },
      { regex: /malloc\s*\(|free\s*\(|calloc\s*\(/, weight: 10, label: "memory management" },
      { regex: /\*\w+|\w+\s*\*\s*\w+/, weight: 5, label: "pointer" },
      { regex: /struct\s+\w+\s*\{/, weight: 8, label: "struct definition" },
      { regex: /->\s*\w+/, weight: 7, label: "pointer member access" },
      { regex: /typedef\s+/, weight: 9, label: "typedef" },
      { regex: /#define\s+\w+/, weight: 8, label: "#define macro" },
      { regex: /void\s+\w+\s*\(/, weight: 6, label: "void function" },
    ],
  },
  {
    language: "c++",
    patterns: [
      { regex: /#include\s*<iostream>|#include\s*<vector>|#include\s*<string>/, weight: 10, label: "C++ header" },
      { regex: /std::|cout\s*<<|cin\s*>>/, weight: 10, label: "std namespace / iostream" },
      { regex: /class\s+\w+\s*(:\s*(public|private)\s+\w+)?\s*\{/, weight: 9, label: "class with inheritance" },
      { regex: /template\s*</, weight: 10, label: "template" },
      { regex: /new\s+\w+|delete\s+\w+/, weight: 7, label: "new/delete" },
      { regex: /vector<|map<|pair</, weight: 9, label: "STL container" },
      { regex: /nullptr/, weight: 9, label: "nullptr" },
      { regex: /auto\s+\w+\s*=/, weight: 7, label: "auto keyword" },
      { regex: /::/, weight: 6, label: "scope resolution (::)" },
      { regex: /public:|private:|protected:/, weight: 8, label: "access specifier" },
    ],
  },
  {
    language: "ruby",
    patterns: [
      { regex: /def\s+\w+[\s\S]*?end/, weight: 9, label: "def...end block" },
      { regex: /puts\s+|print\s+/, weight: 7, label: "puts/print" },
      { regex: /require\s+'|require\s+"/, weight: 8, label: "require statement" },
      { regex: /\.each\s*\{|\.map\s*\{|\.select\s*\{/, weight: 9, label: "block iterator" },
      { regex: /do\s*\|.*\|/, weight: 8, label: "do...block with params" },
      { regex: /attr_accessor|attr_reader|attr_writer/, weight: 10, label: "attr_accessor" },
      { regex: /class\s+\w+\s*<\s*\w+/, weight: 8, label: "class inheritance" },
      { regex: /:\w+/, weight: 5, label: "symbol" },
      { regex: /@\w+/, weight: 7, label: "instance variable" },
      { regex: /nil|true|false/, weight: 3, label: "nil/true/false" },
    ],
  },
  {
    language: "swift",
    patterns: [
      { regex: /var\s+\w+\s*:\s*\w+|let\s+\w+\s*:\s*\w+/, weight: 8, label: "typed var/let" },
      { regex: /func\s+\w+\s*\(.*\)\s*(->.*)?{/, weight: 9, label: "func definition" },
      { regex: /import\s+(UIKit|Foundation|SwiftUI)/, weight: 10, label: "Swift framework import" },
      { regex: /guard\s+let|if\s+let/, weight: 10, label: "optional binding" },
      { regex: /\?\.|!\.|as\?|as!/, weight: 9, label: "optional chaining" },
      { regex: /struct\s+\w+\s*:\s*\w+/, weight: 8, label: "struct conformance" },
      { regex: /@State|@Binding|@ObservedObject/, weight: 10, label: "SwiftUI property wrapper" },
      { regex: /print\(/, weight: 4, label: "print()" },
      { regex: /extension\s+\w+/, weight: 9, label: "extension" },
      { regex: /switch\s+\w+\s*\{[\s\S]*?case\s+/, weight: 7, label: "switch/case" },
    ],
  },
  {
    language: "kotlin",
    patterns: [
      { regex: /fun\s+\w+\s*\(/, weight: 10, label: "function (fun)" },
      { regex: /val\s+\w+|var\s+\w+\s*:/, weight: 7, label: "val/var declaration" },
      { regex: /println\(|print\(/, weight: 5, label: "println()" },
      { regex: /data\s+class\s+\w+/, weight: 10, label: "data class" },
      { regex: /companion\s+object/, weight: 10, label: "companion object" },
      { regex: /\?\s*:\s*/, weight: 8, label: "elvis operator" },
      { regex: /\w+\?\./, weight: 8, label: "safe call operator" },
      { regex: /when\s*\(/, weight: 9, label: "when expression" },
      { regex: /suspend\s+fun/, weight: 10, label: "suspend function" },
      { regex: /listOf\(|mapOf\(|setOf\(/, weight: 9, label: "collection builder" },
    ],
  },
  {
    language: "arduino / c++",
    patterns: [
      { regex: /void\s+setup\s*\(\s*\)/, weight: 10, label: "setup() function" },
      { regex: /void\s+loop\s*\(\s*\)/, weight: 10, label: "loop() function" },
      { regex: /digitalWrite|digitalRead|analogWrite|analogRead/, weight: 10, label: "GPIO functions" },
      { regex: /pinMode\s*\(/, weight: 10, label: "pinMode()" },
      { regex: /delay\s*\(/, weight: 7, label: "delay()" },
      { regex: /Serial\.begin|Serial\.print/, weight: 9, label: "Serial communication" },
      { regex: /HIGH|LOW|INPUT|OUTPUT/, weight: 8, label: "Arduino constants" },
      { regex: /#include\s*<Arduino\.h>/, weight: 10, label: "Arduino.h include" },
      { regex: /millis\(\)|micros\(\)/, weight: 9, label: "timing functions" },
      { regex: /attachInterrupt|detachInterrupt/, weight: 10, label: "interrupt functions" },
    ],
  },
  {
    language: "sql",
    patterns: [
      { regex: /SELECT\s+.*\s+FROM/i, weight: 10, label: "SELECT...FROM" },
      { regex: /INSERT\s+INTO/i, weight: 10, label: "INSERT INTO" },
      { regex: /UPDATE\s+\w+\s+SET/i, weight: 10, label: "UPDATE...SET" },
      { regex: /DELETE\s+FROM/i, weight: 10, label: "DELETE FROM" },
      { regex: /CREATE\s+TABLE/i, weight: 10, label: "CREATE TABLE" },
      { regex: /WHERE\s+\w+/i, weight: 7, label: "WHERE clause" },
      { regex: /JOIN\s+\w+\s+ON/i, weight: 9, label: "JOIN...ON" },
      { regex: /GROUP\s+BY|ORDER\s+BY|HAVING/i, weight: 8, label: "GROUP/ORDER/HAVING" },
      { regex: /PRIMARY\s+KEY|FOREIGN\s+KEY/i, weight: 9, label: "key constraint" },
      { regex: /NULL|NOT\s+NULL/i, weight: 5, label: "NULL constraint" },
    ],
  },
  {
    language: "shell / bash",
    patterns: [
      { regex: /^#!\/bin\/(bash|sh|zsh)/m, weight: 10, label: "shebang line" },
      { regex: /echo\s+["']/, weight: 7, label: "echo statement" },
      { regex: /\$\w+|\$\{.*\}/, weight: 7, label: "variable expansion" },
      { regex: /if\s+\[+.*\]+\s*;?\s*then/, weight: 9, label: "if [...] then" },
      { regex: /for\s+\w+\s+in\s+/, weight: 8, label: "for...in loop" },
      { regex: /grep\s+|sed\s+|awk\s+/, weight: 8, label: "grep/sed/awk" },
      { regex: /chmod\s+|chown\s+|sudo\s+/, weight: 8, label: "unix commands" },
      { regex: /\|\s*\w+/, weight: 5, label: "pipe operator" },
      { regex: /&&\s*\w+|\|\|\s*\w+/, weight: 6, label: "logical operators" },
      { regex: /function\s+\w+\s*\(\s*\)/, weight: 8, label: "function declaration" },
    ],
  },
  {
    language: "markdown",
    patterns: [
      { regex: /^#{1,6}\s+\w+/m, weight: 10, label: "heading (#)" },
      { regex: /\*\*[\w\s]+\*\*|__[\w\s]+__/, weight: 8, label: "bold text" },
      { regex: /\[.*\]\(.*\)/, weight: 9, label: "link syntax" },
      { regex: /^[-*+]\s+\w+/m, weight: 7, label: "unordered list" },
      { regex: /^>\s+\w+/m, weight: 8, label: "blockquote" },
      { regex: /```[\s\S]*?```/, weight: 9, label: "code block" },
      { regex: /^\d+\.\s+\w+/m, weight: 7, label: "ordered list" },
      { regex: /!\[.*\]\(.*\)/, weight: 9, label: "image syntax" },
      { regex: /---|\*\*\*|___/, weight: 6, label: "horizontal rule" },
      { regex: /`\w+`/, weight: 5, label: "inline code" },
    ],
  },
  {
    language: "lua",
    patterns: [
      { regex: /local\s+\w+\s*=/, weight: 9, label: "local variable" },
      { regex: /function\s+\w+\s*\(/, weight: 9, label: "function definition" },
      { regex: /end\s*$|^end/m, weight: 7, label: "end keyword" },
      { regex: /print\s*\(/, weight: 5, label: "print()" },
      { regex: /require\s*\(["']/, weight: 8, label: "require()" },
      { regex: /--.*$/, weight: 5, label: "-- comment" },
      { regex: /~=/, weight: 10, label: "~= not-equal operator" },
      { regex: /\.\.\s*\w+|\w+\s*\.\./, weight: 9, label: ".. string concat" },
      { regex: /ipairs\s*\(|pairs\s*\(/, weight: 10, label: "ipairs/pairs iterator" },
      { regex: /then\s*\n|elseif\s+/, weight: 8, label: "then/elseif keyword" },
    ],
  },
  {
    language: "r",
    patterns: [
      { regex: /<-\s*\w+|\w+\s*<-/, weight: 10, label: "<- assignment operator" },
      { regex: /library\s*\(|require\s*\(/, weight: 8, label: "library/require()" },
      { regex: /c\s*\([\d\s,]+\)/, weight: 8, label: "c() vector" },
      { regex: /data\.frame\s*\(|tibble\s*\(/, weight: 10, label: "data.frame/tibble" },
      { regex: /ggplot\s*\(|geom_\w+\s*\(/, weight: 10, label: "ggplot2" },
      { regex: /\$\w+/, weight: 6, label: "$ accessor" },
      { regex: /TRUE|FALSE/, weight: 6, label: "TRUE/FALSE" },
      { regex: /for\s*\(\s*\w+\s+in\s+/, weight: 7, label: "for...in loop" },
      { regex: /print\s*\(|cat\s*\(|paste\s*\(/, weight: 5, label: "print/cat/paste" },
      { regex: /\bNA\b|\bNULL\b|\bNaN\b/, weight: 8, label: "NA/NULL/NaN" },
    ],
  },
  {
    language: "fortran",
    patterns: [
      { regex: /PROGRAM\s+\w+|program\s+\w+/, weight: 10, label: "PROGRAM declaration" },
      { regex: /IMPLICIT\s+NONE|implicit\s+none/, weight: 10, label: "IMPLICIT NONE" },
      { regex: /INTEGER|REAL|DOUBLE\s+PRECISION|CHARACTER/i, weight: 7, label: "type declaration" },
      { regex: /WRITE\s*\(\s*\*|READ\s*\(\s*\*/i, weight: 9, label: "WRITE/READ statement" },
      { regex: /DO\s+\d+\s+\w+\s*=|do\s+\w+\s*=/i, weight: 9, label: "DO loop" },
      { regex: /END\s+PROGRAM|END\s+SUBROUTINE|END\s+FUNCTION/i, weight: 10, label: "END block" },
      { regex: /SUBROUTINE\s+\w+|subroutine\s+\w+/, weight: 10, label: "SUBROUTINE" },
      { regex: /CALL\s+\w+/i, weight: 8, label: "CALL statement" },
      { regex: /\.TRUE\.|\.FALSE\.|\.AND\.|\.OR\./i, weight: 10, label: "logical operator" },
      { regex: /DIMENSION\s*\(|ALLOCATABLE/i, weight: 9, label: "array declaration" },
    ],
  },
  {
    language: "lisp",
    patterns: [
      { regex: /\(defun\s+\w+/, weight: 10, label: "defun function definition" },
      { regex: /\(defvar\s+|\(defparameter\s+/, weight: 10, label: "defvar/defparameter" },
      { regex: /\(let\s*\(\s*\(/, weight: 9, label: "let binding" },
      { regex: /\(car\s+|\(cdr\s+|\(cons\s+/, weight: 10, label: "car/cdr/cons" },
      { regex: /\(lambda\s+\(/, weight: 10, label: "lambda expression" },
      { regex: /\(if\s+|\(cond\s+/, weight: 7, label: "if/cond expression" },
      { regex: /\(mapcar\s+|\(reduce\s+/, weight: 9, label: "mapcar/reduce" },
      { regex: /;\s.*$/, weight: 6, label: "; comment" },
      { regex: /'\(|`\(/, weight: 8, label: "quoted list" },
      { regex: /\(setq\s+|\(setf\s+/, weight: 9, label: "setq/setf" },
    ],
  },
  {
    language: "scheme",
    patterns: [
      { regex: /\(define\s+\w+/, weight: 10, label: "define expression" },
      { regex: /\(lambda\s+\(/, weight: 9, label: "lambda expression" },
      { regex: /\(display\s+|\(newline\)/, weight: 9, label: "display/newline" },
      { regex: /\(car\s+|\(cdr\s+|\(cons\s+/, weight: 9, label: "car/cdr/cons" },
      { regex: /\(let\s*\(\s*\(|\(let\*/, weight: 8, label: "let/let*" },
      { regex: /\(map\s+|\(for-each\s+/, weight: 9, label: "map/for-each" },
      { regex: /\(cond\s+|\(case\s+/, weight: 8, label: "cond/case" },
      { regex: /#t|#f/, weight: 9, label: "#t/#f boolean" },
      { regex: /\(begin\s+/, weight: 8, label: "begin block" },
      { regex: /\(call-with-current-continuation|\(call\/cc/, weight: 10, label: "call/cc" },
    ],
  },
  {
    language: "clojure",
    patterns: [
      { regex: /\(defn\s+\w+/, weight: 10, label: "defn function" },
      { regex: /\(ns\s+\w+/, weight: 10, label: "ns namespace" },
      { regex: /\(require\s+'\[/, weight: 10, label: "require import" },
      { regex: /\(println\s+|\(print\s+/, weight: 7, label: "println" },
      { regex: /\(let\s+\[/, weight: 9, label: "let binding" },
      { regex: /\(map\s+|\(filter\s+|\(reduce\s+/, weight: 8, label: "map/filter/reduce" },
      { regex: /:[\w-]+/, weight: 6, label: "keyword" },
      { regex: /\(def\s+\w+/, weight: 8, label: "def binding" },
      { regex: /->>|->/, weight: 9, label: "threading macro" },
      { regex: /\(atom\s+|\(swap!\s+|\(reset!\s+/, weight: 10, label: "atom/swap!/reset!" },
    ],
  },
  {
    language: "erlang",
    patterns: [
      { regex: /-module\s*\(/, weight: 10, label: "-module declaration" },
      { regex: /-export\s*\(\[/, weight: 10, label: "-export declaration" },
      { regex: /\w+\s*->\s*\w+/, weight: 7, label: "-> clause" },
      { regex: /io:format\s*\(/, weight: 9, label: "io:format" },
      { regex: /receive\s*[\s\S]*?end/, weight: 10, label: "receive...end" },
      { regex: /spawn\s*\(/, weight: 9, label: "spawn()" },
      { regex: /\?\w+/, weight: 8, label: "macro ?MACRO" },
      { regex: /[A-Z]\w*\s*=/, weight: 6, label: "capitalized variable" },
      { regex: /lists:\w+\s*\(/, weight: 9, label: "lists: module" },
      { regex: /ok\s*\|\s*error|{ok,|{error,/, weight: 8, label: "{ok, error} tuple" },
    ],
  },
  {
    language: "elixir",
    patterns: [
      { regex: /defmodule\s+\w+/, weight: 10, label: "defmodule" },
      { regex: /def\s+\w+\s*\(|defp\s+\w+\s*\(/, weight: 9, label: "def/defp function" },
      { regex: /IO\.puts\s*\(|IO\.inspect\s*\(/, weight: 9, label: "IO.puts/inspect" },
      { regex: /\|>\s*\w+/, weight: 10, label: "pipe operator |>" },
      { regex: /do\s*\n|do:/, weight: 6, label: "do block" },
      { regex: /case\s+.*\s+do|cond\s+do/, weight: 8, label: "case/cond do" },
      { regex: /Enum\.\w+\s*\(/, weight: 9, label: "Enum module" },
      { regex: /%\w+\{/, weight: 9, label: "struct" },
      { regex: /:[\w_]+/, weight: 5, label: "atom" },
      { regex: /\{:ok,|\{:error,/, weight: 8, label: "{:ok/:error} tuple" },
    ],
  },
  {
    language: "haskell",
    patterns: [
      { regex: /^module\s+\w+/m, weight: 10, label: "module declaration" },
      { regex: /import\s+Data\.|import\s+Control\./, weight: 10, label: "haskell import" },
      { regex: /::\s*\w+\s*->\s*\w+/, weight: 10, label: "type signature" },
      { regex: /where\s*$|^\s+where/m, weight: 9, label: "where clause" },
      { regex: /\|\s*\w+\s*=/, weight: 8, label: "guard expression" },
      { regex: /do\s*\n\s+\w+/, weight: 7, label: "do notation" },
      { regex: /let\s+\w+\s*=.*in/, weight: 8, label: "let...in expression" },
      { regex: /map\s+|filter\s+|foldr\s+|foldl\s+/, weight: 8, label: "higher order function" },
      { regex: /\[\s*\w+\s*\.\.\s*\w*\s*\]/, weight: 9, label: "list range" },
      { regex: /data\s+\w+\s*=/, weight: 10, label: "data type definition" },
    ],
  },
  {
    language: "ocaml",
    patterns: [
      { regex: /let\s+\w+\s*=\s*fun|let\s+rec\s+\w+/, weight: 10, label: "let rec / let fun" },
      { regex: /type\s+\w+\s*=\s*\|/, weight: 10, label: "variant type" },
      { regex: /match\s+\w+\s+with/, weight: 10, label: "match...with" },
      { regex: /Printf\.printf\s*\(|print_string\s*\(/, weight: 9, label: "print function" },
      { regex: /\|>\s*\w+/, weight: 8, label: "pipe operator" },
      { regex: /module\s+\w+\s*=\s*struct/, weight: 10, label: "module struct" },
      { regex: /open\s+[A-Z]\w+/, weight: 8, label: "open module" },
      { regex: /fun\s+\w+\s*->/, weight: 8, label: "fun -> lambda" },
      { regex: /\[\s*\w+\s*;\s*\w+/, weight: 7, label: "list with semicolons" },
      { regex: /;;/, weight: 9, label: ";; terminator" },
    ],
  },
  {
    language: "julia",
    patterns: [
      { regex: /function\s+\w+\s*\([\s\S]*?\n\s*end/, weight: 10, label: "function...end block" },
      { regex: /println\s*\(|print\s*\(/, weight: 5, label: "println()" },
      { regex: /using\s+\w+|import\s+\w+/, weight: 8, label: "using/import" },
      { regex: /::\s*\w+|{T}|where\s+T/, weight: 9, label: "type annotation" },
      { regex: /for\s+\w+\s+in\s+\d+:\d+/, weight: 9, label: "for...in range" },
      { regex: /@\w+\s+/, weight: 8, label: "macro (@macro)" },
      { regex: /struct\s+\w+|mutable\s+struct/, weight: 9, label: "struct definition" },
      { regex: /\|>\s*\w+/, weight: 7, label: "pipe operator" },
      { regex: /Vector{|Matrix{|Array{/, weight: 9, label: "typed array" },
      { regex: /begin\s*\n[\s\S]*?end/, weight: 7, label: "begin...end block" },
    ],
  },
  {
    language: "perl",
    patterns: [
      { regex: /^#!\/usr\/bin\/perl|^#!\/usr\/bin\/env perl/m, weight: 10, label: "perl shebang" },
      { regex: /my\s+\$\w+|our\s+\$\w+/, weight: 9, label: "my/our variable" },
      { regex: /\$\w+|\@\w+|%\w+/, weight: 6, label: "sigil variable $@%" },
      { regex: /print\s+["']|say\s+["']/, weight: 7, label: "print/say" },
      { regex: /use\s+strict|use\s+warnings/, weight: 10, label: "use strict/warnings" },
      { regex: /=~\s*\/|!~\s*\//, weight: 10, label: "regex match =~" },
      { regex: /sub\s+\w+\s*\{/, weight: 9, label: "sub definition" },
      { regex: /foreach\s+my\s+\$/, weight: 9, label: "foreach loop" },
      { regex: /push\s+\@|pop\s+\@|shift\s+\@/, weight: 8, label: "array functions" },
      { regex: /use\s+\w+::\w+/, weight: 7, label: "module use" },
    ],
  },
  {
    language: "scala",
    patterns: [
      { regex: /object\s+\w+\s*(extends\s+\w+)?/, weight: 9, label: "object declaration" },
      { regex: /def\s+\w+\s*\(.*\)\s*:\s*\w+/, weight: 9, label: "typed def" },
      { regex: /val\s+\w+\s*:\s*\w+|var\s+\w+\s*:\s*\w+/, weight: 8, label: "val/var with type" },
      { regex: /case\s+class\s+\w+/, weight: 10, label: "case class" },
      { regex: /println\s*\(/, weight: 5, label: "println()" },
      { regex: /import\s+scala\.|import\s+akka\./, weight: 9, label: "scala import" },
      { regex: /List\(|Map\(|Set\(|Seq\(/, weight: 7, label: "collection literal" },
      { regex: /match\s*\{[\s\S]*?case\s+/, weight: 9, label: "match expression" },
      { regex: /trait\s+\w+|sealed\s+trait/, weight: 9, label: "trait definition" },
      { regex: /=>\s*\w+|\w+\s*=>/, weight: 6, label: "lambda =>" },
    ],
  },
  {
    language: "php",
    patterns: [
      { regex: /<\?php|\?>/, weight: 10, label: "<?php tag" },
      { regex: /\$\w+\s*=/, weight: 8, label: "$ variable" },
      { regex: /echo\s+["']|echo\s+\$/, weight: 9, label: "echo statement" },
      { regex: /function\s+\w+\s*\(\$/, weight: 8, label: "function with $ params" },
      { regex: /array\s*\(|\[\s*['"]/, weight: 7, label: "array literal" },
      { regex: /->[\w]+\s*\(|::[\w]+\s*\(/, weight: 8, label: "method call" },
      { regex: /require_once|include_once|require\s*\(/, weight: 9, label: "require/include" },
      { regex: /namespace\s+\w+|use\s+\w+\\/, weight: 9, label: "namespace/use" },
      { regex: /public\s+function|private\s+function|protected\s+function/, weight: 8, label: "access modifier + function" },
      { regex: /\$this->/, weight: 9, label: "$this->" },
    ],
  },
  {
    language: "assembly",
    patterns: [
      { regex: /\.(text|data|bss|global|section)/i, weight: 9, label: "section directive" },
      { regex: /mov\s+\w+,\s*\w+|MOV\s+\w+,\s*\w+/, weight: 9, label: "MOV instruction" },
      { regex: /push\s+\w+|pop\s+\w+/i, weight: 8, label: "push/pop" },
      { regex: /call\s+\w+|ret\b/i, weight: 8, label: "call/ret" },
      { regex: /jmp\s+\w+|je\s+\w+|jne\s+\w+|jz\s+\w+/i, weight: 9, label: "jump instruction" },
      { regex: /eax|ebx|ecx|edx|rax|rbx|rcx|rdx/i, weight: 9, label: "x86 register" },
      { regex: /int\s+0x80|syscall/i, weight: 10, label: "syscall" },
      { regex: /\w+:\s*$|^\w+:/m, weight: 7, label: "label:" },
      { regex: /db\s+|dw\s+|dd\s+|dq\s+/i, weight: 9, label: "data directive" },
      { regex: /;.*$/, weight: 5, label: "; comment" },
    ],
  },
  {
    language: "brainfuck",
    patterns: [
      { regex: /^[+\-<>.,\[\]\s]+$/, weight: 10, label: "only brainfuck chars" },
      { regex: /\+{3,}/, weight: 8, label: "repeated + increments" },
      { regex: /\[.*-.*\]/, weight: 9, label: "loop with decrement" },
      { regex: />{2,}|<{2,}/, weight: 7, label: "multiple pointer moves" },
      { regex: /\.,|,\./, weight: 8, label: "input/output sequence" },
      { regex: /\[>\+<-\]|\[<\+>-\]/, weight: 10, label: "copy loop pattern" },
      { regex: /\[-\]/, weight: 9, label: "zero cell pattern [-]" },
    ],
  },
];

function detect(code: string): Match[] {
  const results: Match[] = [];
  for (const lang of PATTERNS) {
    let score = 0;
    const features: string[] = [];
    for (const p of lang.patterns) {
      if (p.regex.test(code)) {
        score += p.weight;
        features.push(p.label);
      }
    }
    if (score > 0) results.push({ language: lang.language, score, features });
  }
  return results.sort((a, b) => b.score - a.score);
}

function confidence(score: number): string {
  if (score >= 25) return "high";
  if (score >= 12) return "medium";
  return "low";
}

const confidenceColor: Record<string, string> = {
  high: "#2d7a4f",
  medium: "#b5650d",
  low: "#9078a8",
};

const EXAMPLES: Record<string, string> = {
  python: `def greet(name):
    return f"hello, {name}!"

names = ["ada", "grace", "margaret"]
for n in names:
    print(greet(n))`,
  javascript: `const fetchData = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data.map(item => item.name);
};`,
  rust: `fn main() {
    let mut v: Vec<i32> = Vec::new();
    for i in 0..5 {
        v.push(i * 2);
    }
    println!("{:?}", v);
}`,
  arduino: `void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}
void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}`,
  css: `.card {
  display: flex;
  gap: 1rem;
  background: var(--bg);
  border-radius: 8px;
  padding: 1.5rem;
}`,
  lua: `local function greet(name)
  return "hello, " .. name .. "!"
end

local names = {"ada", "grace", "margaret"}
for i, name in ipairs(names) do
  print(greet(name))
end`,
  r: `library(ggplot2)

data <- data.frame(
  x = c(1, 2, 3, 4, 5),
  y = c(2, 4, 6, 8, 10)
)

ggplot(data, aes(x = x, y = y)) +
  geom_line() + geom_point()`,
  fortran: `PROGRAM hello
  IMPLICIT NONE
  INTEGER :: i
  DO i = 1, 10
    WRITE(*,*) 'hello', i
  END DO
END PROGRAM hello`,
  lisp: `(defun fibonacci (n)
  (if (or (= n 0) (= n 1))
      n
      (+ (fibonacci (- n 1))
         (fibonacci (- n 2)))))

(mapcar #'fibonacci '(0 1 2 3 4 5))`,
  clojure: `(defn fibonacci [n]
  (loop [a 0 b 1 i n]
    (if (= i 0)
      a
      (recur b (+ a b) (dec i)))))

(map fibonacci (range 10))`,
  elixir: `defmodule Fibonacci do
  def calc(0), do: 0
  def calc(1), do: 1
  def calc(n), do: calc(n-1) + calc(n-2)
end

IO.inspect(Enum.map(0..9, &Fibonacci.calc/1))`,
  brainfuck: `++++++++++[>+++++++>++++++++++>+++>+<<<<-]
>++.>+.+++++++..+++.>++.<<+++++++++++++++.
>.+++.------.--------.>+.>.`,
};

export default function CodeIdentifierPage() {
  const [code, setCode] = useState("");
  const [results, setResults] = useState<Match[]>([]);
  const [ran, setRan] = useState(false);

  const run = () => {
    setResults(detect(code));
    setRan(true);
  };

  const top = results[0];
  const rest = results.slice(1, 4);

  return (
    <ToolPage
      title="code identifier"
      description="paste any code snippet and identify the programming language using pattern matching."
      category="code & dev"
    >
      {/* examples */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-ghost)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          try an example
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.keys(EXAMPLES).map((lang) => (
            <button
              key={lang}
              className="btn btn-ghost"
              style={{ fontSize: 11 }}
              onClick={() => { setCode(EXAMPLES[lang]); setRan(false); setResults([]); }}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* code input */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-ghost)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          paste code here
        </div>
        <textarea
          value={code}
          onChange={(e) => { setCode(e.target.value); setRan(false); setResults([]); }}
          rows={10}
          placeholder="paste your code snippet…"
          style={{
            width: "100%",
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            borderRadius: 8,
            padding: "12px 14px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--ink)",
            outline: "none",
            resize: "vertical",
            lineHeight: 1.7,
            transition: "border-color 0.12s",
          }}
          onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
          onBlur={(e) => e.target.style.borderColor = "var(--border)"}
        />
      </div>

      {/* identify button */}
      <div style={{ marginBottom: 28 }}>
        <button
          className="btn btn-primary"
          onClick={run}
          disabled={!code.trim()}
        >
          ✦ identify language
        </button>
      </div>

      {/* no results */}
      {ran && results.length === 0 && (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-muted)", padding: "20px 0" }}>
          no language detected — try a longer snippet.
        </div>
      )}

      {/* results */}
      {ran && top && (
        <div>
          {/* top match */}
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-ghost)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            best match
          </div>
          <div style={{
            background: "var(--card)",
            border: "1.5px solid var(--accent)",
            borderRadius: 10,
            padding: "18px 20px",
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 500, color: "var(--ink)" }}>
                {top.language}
              </div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                padding: "3px 8px",
                borderRadius: 4,
                background: `${confidenceColor[confidence(top.score)]}20`,
                color: confidenceColor[confidence(top.score)],
                letterSpacing: "0.08em",
              }}>
                {confidence(top.score)} confidence
              </div>
              <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-ghost)" }}>
                score: {top.score}
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-ghost)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
              detected patterns
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {top.features.map((f) => (
                <span key={f} style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  padding: "3px 8px",
                  background: "rgba(168,85,200,0.08)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  color: "var(--ink-soft)",
                }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* other matches */}
          {rest.length > 0 && (
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-ghost)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                also possible
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {rest.map((r) => (
                  <div key={r.language} style={{
                    background: "var(--card)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 8,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 500, color: "var(--ink)", minWidth: 120 }}>
                      {r.language}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      padding: "2px 7px",
                      borderRadius: 4,
                      background: `${confidenceColor[confidence(r.score)]}15`,
                      color: confidenceColor[confidence(r.score)],
                    }}>
                      {confidence(r.score)}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-ghost)", fontFamily: "var(--font-mono)" }}>
                      {r.features.slice(0, 2).join(", ")}
                    </div>
                    <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-ghost)" }}>
                      {r.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolPage>
  );
}