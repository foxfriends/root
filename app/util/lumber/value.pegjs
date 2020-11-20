{
    class Struct {
        constructor(name, contents = undefined) {
            this.name = name;
            this.contents = contents;
        }

        get isAtom() {
            return this.contents === undefined;
        }
    }

    window.Struct = Struct;
}

start = value

_ = " "*
__ = " "+

value
    = literal
    / struct
    / list
    / record

literal
    = value:$decimal { Number.parseFloat(value) }
    / value:$integer { Number.parseInt(value, 10) }
    / string

decimal = integer "." integer
integer = [0-9]+
string  = '"' contents:('\\"' / [^'"'])* '"' { contents }

struct
    = name:$atom _ '(' _ contents:value _ ')' { return new Struct(name, contents) }
    / name:$atom _ contents:record { return new Struct(name, contents) }
    / name:$atom _ contents:list { return new Struct(name, contents) }
    / name:$atom { return new Struct(name) }

list = '[' _ contents:list_entries? _ ']' { return contents || [] }
list_entries = head:value (_ "," _ tail:value)* { return [head, ...tail] }

record = '{' _ contents:fields? _ '}' { return contents || {} }
fields = head:field (_ "," _ tail:field)* { return Object.fromEntries([head, ...tail]) }
field = key:$atom _ ":" _ val:value { return [key, val] }

atom = [a-z] [A-Za-z0-9_]*
