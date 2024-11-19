CPSModel: 
    'repository' '{'
        software+=Software*
        sensors+=Sensor*
    '}'
    'market' '{'
        computers+=Computer*
        modules+=Module*
    '}'
    (cpss+=CPS)+
;

Software:
    'software' name=ID
    ('depends' 'on' dependencies+=[Software]+)?
    ('requires' 'memory' memory=INT 'GB')?
    ';';

Computer:
    'computer' name=ID
    'processor' frequency=DOUBLE 'GHz' (cores=INT 'cores')?
    'memory' capacity=INT 'GB'
    ';';

Sensor:
    'sensor' name=ID
    'type' sensorType=ID
    ('requires' 'memory' memory=INT 'GB')?
    ';';

Module:
    'module' name=ID
    'supports' supportedHardware+=HARDWARE+
    ('requires' 'memory' memory=INT 'GB')?
    ';';

CPS:
    'cps' name=ID '{'
        (computers+=CPSComputer | connections+=Connection)*
    '}';

CPSComputer:
    'computer' type=[Computer] name=ID '{'
        (addHardware+=AddHardware | installSoftware+=InstallSoftware)*
    '}';

AddHardware:
    'add' hardware=HARDWARE;

terminal HARDWARE:
    'Thermometer' | 'HeatController' | 'SmokeDetector' | 'FireAlarm';

InstallSoftware:
    'install' software=[Software];

Connection:
    from=[CPSComputer] '-o)-' to=[CPSComputer];

terminal DOUBLE returns number: /[0-9]+\.[0-9]+/;
terminal INT returns number: /[0-9]+/;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;