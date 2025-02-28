grammar DataSpace

entry Model:
    (
        schemas += Schema
    )*
;

Field: 
    (isPii ?= '@PII')? name=ID ':' type=Type
;

Type:
    NumberType
    | StringType
    | BooleanType
;

NumberType:
    {infer NumberFieldType} 'number'
;

StringType:
    {infer StringFieldType} 'string'
;

BooleanType:
    {infer BooleanFieldType} 'boolean'
;

Schema:
    'schema' name=ID ('{'
        fields += Field*
    '}')?
;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
