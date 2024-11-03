grammar SmartHouse

entry CPSModel :
'repository' '{'
    
'}'
'market' '{'
    
'}'
(cpss += CPS)+
 ;


CPS: 'cps' name = ID;


terminal DOUBLE returns number: /[0-9]+.[0-9]+/;
terminal INT returns number: /[0-9]+/;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
