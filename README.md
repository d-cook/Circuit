# Circuit
A Digital Circuit simulation, as a demonstration of the artificial boundaries of programming language.

I'll compare various approaches to show that programming language can be entirely replaced with ordinary programming abstractions *without losing anything*, and that it need not be specified as textual code. The same simulator + circuit will be implemented as:
* Programming language for the simulator, Textual code for the circuit
* Programming language for the simulator, Structural code (data-structure) for circuit
* Code library for the simulator, Code for circuit (both in same language)
* An always-running simulation that can be live-edited as it runs

Syntax for the "programming language":
```
To start with:

SPEC :: ( VAR | EXPR )*
VAR  :: VarName '=' EXPR
EXPR :: OR
OR   :: XOR ( '+' XOR )*
XOR  :: AND ( '^' AND )*
AND  :: NOT ( '*' NOT )*
NOT  :: ('!')? VAL
VAL  :: 0 | 1 | KEY | VarName | '(' EXPR ')'
KEY  :: '[' LabelOfAKeyOnTheKeyboard ']'

With sub-circuits:

SPEC :: ( VAR | EXPR | DEF )*
DEF  :: SubName ':' '(' InputNames... '->' OutputNames... ')' '{' SPEC '}'
...
NOT  :: ('!')? PATH
PATH :: VAL ( '.' VarName )*
VAL  :: 0 | 1 | KEY | VarName | SUB | '(' EXPR ')'
SUB  :: SubName '(' EXPR... ')'

With LED Displays:

SPEC :: ( VAR | EXPR | DISP )*
DISP :: '@' '(' X ',' Y ',' W ',' H ')' '=' EXPR
```