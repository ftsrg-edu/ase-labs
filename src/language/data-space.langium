grammar DataSpace

type NamedElement = Field | Schema | DataSet | Service | Consume | Stakeholder | ServiceChain

type BaseStep = FirstStep | Step | FinalStep
type MappableStep = Step | FinalStep

type Target = Service | Consume;

entry Model:
    (
        schemas+=Schema
        | stakeholders+=Stakeholder
        | serviceChains+=ServiceChain
    )*
;

Field:
    (isPii?='@PII')? name=ID ':' type=Type
;

Type returns string:
    'number'
    | 'string'
    | 'boolean'
;

Schema:
    'schema' name=ID ('{'
        fields+=Field*
    '}')?
;

DataSet:
    'owns' 'dataset' name=ID ':' output=[Schema]
;

SubjectOfRelation:
    'subject' 'of' stakeholder=[Stakeholder] '.' dataSet=[DataSet] ('{'
        ('gives' 'consent' 'to' consents+=[Stakeholder])*
    '}')?
;

Service:
    'provides' 'service' name=ID ':' input=[Schema] '->' output=[Schema]
;

Consume:
    'consumes' 'dataset' name=ID ':' input=[Schema]
;

Stakeholder:
    'stakeholder' name=ID ('{'
        (
            dataSets+=DataSet
            | subjectOfRelations+=SubjectOfRelation
            | services+=Service
            | consumes+=Consume
        )*
    '}')?
;

ValueMapping:
    left=[Field] '<-' ((isPseudonymize?='pseudonymize' '(' right=[Field] ')') | right=[Field])
;

Mapping:
    {infer Mapping} '{'
        valueMappings+=ValueMapping*
    '}'
;

FirstStep:
    'first' stakeholder=[Stakeholder] '.' target=[DataSet]
;

Step:
    'then' stakeholder=[Stakeholder] '.' target=[Service] mapping=Mapping?
;

FinalStep:
    'then' stakeholder=[Stakeholder] '.' target=[Consume] mapping=Mapping?
;

ServiceChain:
    'service' 'chain' name=ID '{'
        steps+=FirstStep
        steps+=Step*
        steps+=FinalStep
    '}'
;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
