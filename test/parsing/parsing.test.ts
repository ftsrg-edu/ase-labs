import { beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem, type LangiumDocument } from "langium";
import { expandToString as s } from "langium/generate";
import { parseHelper } from "langium/test";
import { createHw2Services } from "../../src/language/hw-2-module.js";
import {CPSModel, isCPSModel } from "../../src/language/generated/ast.js";

let services: ReturnType<typeof createHw2Services>;
let parse:    ReturnType<typeof parseHelper<CPSModel>>;
let document: LangiumDocument<CPSModel> | undefined;

beforeAll(async () => {
    services = createHw2Services(EmptyFileSystem);
    parse = parseHelper<CPSModel>(services.Hw2);
});

expect.extend({
    toBeValid(received: LangiumDocument) {
        if (received.parseResult.lexerErrors.length != 0) {
            return {
                message: () => s`
                    Lexer errors:
                      ${received.parseResult.lexerErrors.map(e => e.message).join('\n  ')}
                `,
                pass: false
            };
        }

        if (received.parseResult.parserErrors.length != 0) {
            return {
                message: () => s`
                    Parser errors:
                      ${received.parseResult.parserErrors.map(e => e.message).join('\n  ')}
                `,
                pass: false
            };
        }

        if (received.parseResult.value === undefined) {
            return {
                message: () => `ParseResult is 'undefined'.`,
                pass: false
            }
        }

        if (!isCPSModel(received.parseResult.value)) {
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
        document = await parse(`
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

        expect(document).toBeValid();
    });

    test('Test model 2: Computers specified in the market', async () => {
        document = await parse(`
            repository { }
            market {
                computer RaspBerr5M2G processor 2.4 GHz 4 cores memory 2 GB;
                computer RaspBerr5M4G processor 2.4 GHz 4 cores memory 4 GB;
                computer RaspBerr5M8G processor 2.4 GHz 4 cores memory 8 GB;
                computer PersonalComputer processor 3.6 GHz memory 32 GB;
            }
            cps SmartHome { }
        `);

        expect(document).toBeValid();
    });

    test('Test model 3: Software in repository and computers in market', async () => {
        document = await parse(`
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

        expect(document).toBeValid();
    });

    test('Test model 4: Full CPS specification with computers and connections', async () => {
        document = await parse(`
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

        expect(document).toBeValid();
    });
});
