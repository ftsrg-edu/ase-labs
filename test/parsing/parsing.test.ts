import { beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem, type LangiumDocument } from "langium";
import { expandToString as s } from "langium/generate";
import { validationHelper, ValidationResult } from "langium/test";
import { createCpsServices } from "../../src/language/cps-module.js";
import {CPSModel, isCPSModel } from "../../src/language/generated/ast.js";

let services: ReturnType<typeof createCpsServices>;
let parse:    ReturnType<typeof validationHelper<CPSModel>>;
let parseResult: ValidationResult<CPSModel> | undefined;

beforeAll(async () => {
    services = createCpsServices(EmptyFileSystem);
    parse = validationHelper<CPSModel>(services.cps);
});

expect.extend({
    toBeValid(result: ValidationResult) {
        if (result.document.parseResult.lexerErrors.length != 0) {
            return {
                message: () => s`
                    Lexer errors:
                      ${result.document.parseResult.lexerErrors.map(e => e.message).join('\n  ')}
                `,
                pass: false
            };
        }

        if (result.document.parseResult.parserErrors.length != 0) {
            return {
                message: () => s`
                    Parser errors:
                      ${result.document.parseResult.parserErrors.map(e => e.message).join('\n  ')}
                `,
                pass: false
            };
        }

        if (result.diagnostics.length != 0) {
            return {
                message: () => s`
                    Model issues:
                      ${result.diagnostics.map(e => e.message).join('\n  ')}
                `,
                pass: false
            };
        }

        if (result.document.parseResult.value === undefined) {
            return {
                message: () => `ParseResult is 'undefined'.`,
                pass: false
            }
        }

        if (!isCPSModel(result.document.parseResult.value)) {
            return {
                message: () => `ParseResult is not a CPSModel instance.`,
                pass: false
            }
        }

        return {
            message: () => `Model successfully parsed!`,
            pass: true
        }
    }
});

describe('Parsing tests', () => {

    test('Test model 1: Empty sections with comments', async () => {
        parseResult = await parse(`
            repository {
                // there will be a section for different softwares
            }
            market {
                // there will be a section for different computers
            }
            cps SmartHome {
                // This will be a simplified specification for our smart home 
            }
        `);

        expect(parseResult).toBeValid();
    });

    test('Test model 2: Computers specified in the market', async () => {
        parseResult = await parse(`
            repository { }
            market {
                computer RaspBerr5M2G processor 2.4 GHz 4 cores memory 2 GB;
                computer RaspBerr5M4G processor 2.4 GHz 4 cores memory 4 GB;
                computer RaspBerr5M8G processor 2.4 GHz 4 cores memory 8 GB;
                computer PersonalComputer processor 3.6 GHz memory 32 GB;
            }
            cps SmartHome { }
        `);

        expect(parseResult).toBeValid();
    });

    test('Test model 3: Software in repository and computers in market', async () => {
        parseResult = await parse(`
            repository {
                software RaspberryOS requires memory 1 GB;
                software BasicSensorDriverPack depends on RaspberryOS;
                software RabbitMQApp depends on BasicSensorDriverPack RaspberryOS;
                software FedoraWorkstation requires memory 4 GB;
                software OpenControlPanel depends on FedoraWorkstation;
            }
            market {
                computer RaspBerr5M2G processor 2.4 GHz 4 cores memory 2 GB;
                computer RaspBerr5M4G processor 2.4 GHz 4 cores memory 4 GB;
                computer RaspBerr5M8G processor 2.4 GHz 4 cores memory 8 GB;
                computer PersonalComputer processor 3.6 GHz memory 32 GB;
            }
            cps SmartHome { }
        `);

        expect(parseResult).toBeValid();
    });

    test('Test model 4: Full CPS specification with computers and connections', async () => {
        parseResult = await parse(`
            repository {
                software RaspberryOS requires memory 1 GB;
                software BasicSensorDriverPack depends on RaspberryOS;
                software RabbitMQApp depends on BasicSensorDriverPack RaspberryOS;
                software FedoraWorkstation requires memory 4 GB;
                software OpenControlPanel depends on FedoraWorkstation;
            }
            market {
                computer RaspBerr5M2G processor 2.4 GHz 4 cores memory 2 GB;
                computer RaspBerr5M4G processor 2.4 GHz 4 cores memory 4 GB;
                computer RaspBerr5M8G processor 2.4 GHz 4 cores memory 8 GB;
                computer PersonalComputer processor 3.6 GHz memory 32 GB;
            }
            cps SmartHome {
                computer RaspBerr5M2G termometer1 {
                    add Thermometer
                    install RaspberryOS
                    install BasicSensorDriverPack
                }
                computer RaspBerr5M2G termometer2 {
                    add Thermometer
                    install RaspberryOS
                    install BasicSensorDriverPack
                }
                computer RaspBerr5M2G heatController {
                    install RaspberryOS
                    install BasicSensorDriverPack
                    add HeatController
                }
                
                termometer1 -o)- heatController
                termometer2 -o)- heatController
            
                computer RaspBerr5M2G smokeDetector {
                    add SmokeDetector
                    add FireAlarm
                    install RaspberryOS
                    install BasicSensorDriverPack
                }
            
                smokeDetector -o)- smokeDetector
            }
        `);

        expect(parseResult).toBeValid();
    });

    test('Test model 4b: CPS allows arbitrary order of computers and connections; mixed content order', async () => {
        parseResult = await parse(`
            repository {
                software RaspberryOS requires memory 1 GB;
                software BasicSensorDriverPack depends on RaspberryOS;
                software FedoraWorkstation requires memory 4 GB;
                software OpenControlPanel depends on FedoraWorkstation;
            }
            market {
                computer RaspBerr5M2G processor 2.4 GHz 4 cores memory 4 GB;
                computer PersonalComputer processor 3.1 GHz 6 cores memory 16 GB;
            }
            cps SmartHome {
                // Connections may appear before and between computer specs
                t1 -o)- heater
                t2 -o)- heater

                computer RaspBerr5M2G t1 {
                    install RaspberryOS
                    add Thermometer
                    install BasicSensorDriverPack
                }

                // Interleaved connection
                heater -o)- panel

                computer RaspBerr5M2G t2 {
                    add Thermometer
                    install RaspberryOS
                    install BasicSensorDriverPack
                }

                // Content order inside block can vary
                computer RaspBerr5M2G heater {
                    add HeatController
                    install BasicSensorDriverPack
                    install RaspberryOS
                }

                computer PersonalComputer panel {
                    install FedoraWorkstation
                    install OpenControlPanel
                }

                // Post-declaration self-loop should also be allowed
                panel -o)- panel
            }
        `);

        expect(parseResult).toBeValid();
    });

    test('Test model 4c: Larger CPS with all four hardware types used at least once', async () => {
        parseResult = await parse(`
            repository {
                software RaspberryOS requires memory 1 GB;
                software BasicSensorDriverPack depends on RaspberryOS;
                software AlarmSuite requires memory 1 GB;
                software ControlSuite depends on BasicSensorDriverPack requires memory 3 GB;
            }
            market {
                computer RaspBerr5M2G processor 2.4 GHz 4 cores memory 2 GB;
                computer RaspBerr5M4G processor 2.4 GHz 4 cores memory 4 GB;
                computer PersonalComputer processor 3.6 GHz memory 16 GB;
            }
            cps SmartHome {
                computer RaspBerr5M2G thermo {
                    add Thermometer
                    install RaspberryOS
                    install BasicSensorDriverPack
                }

                computer RaspBerr5M4G heater {
                    add HeatController
                    install RaspberryOS
                    install ControlSuite
                }

                computer RaspBerr5M2G smoke {
                    add SmokeDetector
                    install RaspberryOS
                    install AlarmSuite
                }

                computer PersonalComputer alarmPanel {
                    add FireAlarm
                    install RaspberryOS
                    install AlarmSuite
                }

                thermo -o)- heater
                smoke  -o)- alarmPanel
                heater -o)- alarmPanel
            }
        `);

        expect(parseResult).toBeValid();
    });

});

describe('Incorrect model parsing tests', () => {

    test('Invalid model 1: Missing semicolon in market computer entry', async () => {
        parseResult = await parse(`
            repository { }
            market {
                computer BrokenBox processor 2.0 GHz memory 2 GB   // <-- semicolon missing here
            }
            cps X { }
        `);

        expect(parseResult).not.toBeValid();
    });

    test('Invalid model 2: Missing GHz keyword after processor frequency', async () => {
        parseResult = await parse(`
            repository { }
            market {
                computer BadCPU processor 2.4 4 cores memory 8 GB; // "GHz" must be present after 2.4
            }
            cps X { }
        `);

        expect(parseResult).not.toBeValid();
    });

    test('Invalid model 3: Software "depends on" must have at least one dependency', async () => {
        parseResult = await parse(`
            repository {
                software RaspberryOS requires memory 1 GB;
                software BrokenPackage depends on ; // empty dependency list is not allowed
            }
            market { }
            cps X { }
        `);

        expect(parseResult).not.toBeValid();
    });

    test('Invalid model 4: Hardware type must be one of the four allowed literals', async () => {
        parseResult = await parse(`
            repository {
                software RaspberryOS requires memory 1 GB;
            }
            market {
                computer RaspBerr5M2G processor 2.4 GHz 4 cores memory 4 GB;
            }
            cps X {
                computer RaspBerr5M2G node1 {
                    add UnknownGadget // only Thermometer, HeatController, SmokeDetector, FireAlarm are allowed
                    install RaspberryOS
                }
            }
        `);

        expect(parseResult).not.toBeValid();
    });

    test('Invalid model 5: Memory requires a numeric amount before "GB"', async () => {
        parseResult = await parse(`
            repository {
                software RaspberryOS requires memory GB; // missing number before GB
            }
            market { }
            cps X { }
        `);

        expect(parseResult).not.toBeValid();
    });

    test('Invalid ordering (market/computer): memory appears before processor', async () => {
        parseResult = await parse(`
            repository { }
            market {
                computer BadOrder memory 8 GB processor 2.0 GHz 4 cores; // memory must come after processor+GHz (and optional cores)
            }
            cps X { }
        `);

        expect(parseResult).not.toBeValid();
    });

    test('Invalid ordering (market/computer): "cores" before GHz frequency', async () => {
        parseResult = await parse(`
            repository { }
            market {
                computer BadCoresOrder processor 4 cores 2.4 GHz memory 8 GB; // must be: processor <freq> GHz [<cores> cores]
            }
            cps X { }
        `);

        expect(parseResult).not.toBeValid();
    });

    test('Invalid software ordering: "requires" before "depends on"', async () => {
        parseResult = await parse(`
            repository {
                software RaspberryOS requires memory 1 GB;
                software WrongOrder requires memory 2 GB depends on RaspberryOS; // spec: depends (optional) must come before requires (optional)
            }
            market { }
            cps X { }
        `);

        expect(parseResult).not.toBeValid();
    });

    test('Negative cores are not allowed', async () => {
        parseResult = await parse(`
            repository { }
            market {
                computer BadCores processor 2.4 GHz -4 cores memory 8 GB; // negative INT not allowed
            }
            cps X { }
        `);

        expect(parseResult).not.toBeValid();
    });

    test('Missing computer content braces in CPS computer declaration', async () => {
        parseResult = await parse(`
            repository {
                software RaspberryOS requires memory 1 GB;
            }
            market {
                computer T processor 2.0 GHz 2 cores memory 2 GB;
            }
            cps Home {
                computer T node1; // per examples/spec, a block with { } content is required (even if empty)
            }
        `);

        expect(parseResult).not.toBeValid();
    });

    test('Unresolved software in repository dependency list', async () => {
        parseResult = await parse(`
            repository {
                software RaspberryOS requires memory 1 GB;
                software NeedsGhost depends on RaspberryOS GhostLib; // GhostLib does not exist
            }
            market { }
            cps X { }
        `);

        expect(parseResult).not.toBeValid();
    });

    test('Unresolved software in CPS "install" command', async () => {
        parseResult = await parse(`
            repository {
                software RaspberryOS requires memory 1 GB;
            }
            market {
                computer Pi processor 2.4 GHz 4 cores memory 4 GB;
            }
            cps Home {
                computer Pi node1 {
                    install RaspberryOS
                    install NotExisting // unresolved software
                }
            }
        `);

        expect(parseResult).not.toBeValid();
    });

    test('CPS computer refers to unknown computer type (not in market)', async () => {
        parseResult = await parse(`
            repository { }
            market {
                computer Known processor 2.0 GHz memory 2 GB;
            }
            cps Home {
                computer UnknownType node1 { } // UnknownType not declared in market
            }
        `);

        expect(parseResult).not.toBeValid();
    });

    test('Connection references a non-existent CPS node', async () => {
        parseResult = await parse(`
            repository { }
            market {
                computer T processor 2.0 GHz memory 2 GB;
            }
            cps Home {
                computer T a { }
                a -o)- ghost // 'ghost' node not declared
            }
        `);

        expect(parseResult).not.toBeValid();
    });
    
    test('CPS installs software not declared in repository but tries to depend on it elsewhere', async () => {
        parseResult = await parse(`
            repository {
                software Base requires memory 1 GB;
                software App depends on Base Missing; // Missing is not declared
            }
            market {
                computer T processor 2.0 GHz memory 2 GB;
            }
            cps Home {
                computer T node {
                    install App
                    install Missing // also unresolved here
                }
            }
        `);

        expect(parseResult).not.toBeValid();
    });

});
