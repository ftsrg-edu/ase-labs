grammar Workflow

entry Workflow:
    'workflow' name=ID ('('
        parameters += Parameter (',' parameters += Parameter)* ','?
    ')')? '{'
        (
            workers += Worker
            | channels += Channel
            | inPorts += InPort
        )*
        outPort = OutPort
    '}'
;

Parameter:
    name=ID ':' type=ID
;

Worker:
    'worker' name=ID ':' type=ID ( '('
        arguments += [Parameter] (',' arguments += [Parameter])* ','?
    ')' )?
;

Channel:
    fromWorker=[Worker] '.' 'output' '->' toWorker=[Worker] '.' toPort=ID
;

InPort:
    'in' worker=[Worker] '.' port=ID
;

OutPort:
    'out' worker=[Worker] '.' 'output'
;

terminal ID: /[_a-zA-Z][\w_]*/;

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
