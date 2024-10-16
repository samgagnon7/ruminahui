import Ajv from 'ajv';

class MahjongHandValidator {

    private readonly schema = {
        type: "object",
        properties: {
            tiles: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        suit: {
                            type: "string",
                            enum: ["bamboo", "characters", "dots", "honors"]
                        },
                        value: {
                            type: "number",
                            minimum: 1,
                            maximum: 9
                        }
                    },
                    required: ["suit", "value"]
                },
                minItems: 13,
                maxItems: 14
            }
        },
        required: ["tiles"]
    };
        
    public validateHand(hand: any): boolean {
        const ajv = new Ajv();
        const validate = ajv.compile(this.schema);
        const valid = validate(hand);

        if (valid) {
            console.log("The Mahjong hand is valid according to the schema.");
            return true;
        } else {
            console.log("The Mahjong hand is not valid:");
            console.log(validate.errors);
            return false;
        }
    }
}

export { MahjongHandValidator };
