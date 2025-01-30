import * as Joi from 'joi';

describe('MongoDB URL Validation', () => {
    const schema = Joi.object({
        MONGODB_URL: Joi.string()
            .custom((value) => {
                if (value.includes('user:pass@')) {
                    throw new Error('MONGODB_URL must not contain default credentials user:pass');
                }
                const pattern = /^mongodb:\/\/([^:]+):([^@]+)@([^:\/]+)(:[0-9]+)?(\/[^?]+)(\?.*)?$/;
                if (!pattern.test(value)) {
                    throw new Error('MONGODB_URL must be a valid url with the following format: mongodb://<user>:<password>@<host>:<port>/<database>?<options>');
                }
                return value;
            }, 'MongoDB URL validation')
            .required(),
    });

    const validate = (url: string) => {
        return schema.validate({ MONGODB_URL: url });
    };

    it('should accept valid MongoDB URLs', () => {
        const validUrls = [
            'mongodb://myuser:mypass@localhost:27017/mydatabase',
            'mongodb://d09dd0b1bc79bbc2e5def58b3765b9b3:795790f9b6a138d57f35789dea8c70e57a3c1e092b8fe3cf28f0432dd3eb68dd@mongodb:27017/bluelight-hub?authSource=bluelight-hub',
            'mongodb://complex.user:complex!pass@mongodb.example.com:27017/mydb?authSource=admin',
            'mongodb://user123:pass456@localhost:27017/testdb?retryWrites=true',
        ];

        validUrls.forEach(url => {
            const { error } = validate(url);
            expect(error).toBeUndefined();
        });
    });

    it('should reject invalid MongoDB URLs', () => {
        const invalidUrls = [
            {
                url: 'mongodb://user:pass@localhost:27017/mydatabase',
                expectedError: 'MONGODB_URL must not contain default credentials user:pass'
            },
            {
                url: 'mongodb://localhost:27017/mydatabase',
                expectedError: 'MONGODB_URL must be a valid url with the following format'
            },
            {
                url: 'mongodb://@localhost:27017/mydatabase',
                expectedError: 'MONGODB_URL must be a valid url with the following format'
            },
            {
                url: 'mongodb://user@localhost:27017/mydatabase',
                expectedError: 'MONGODB_URL must be a valid url with the following format'
            },
        ];

        invalidUrls.forEach(({ url, expectedError }) => {
            const { error } = validate(url);
            expect(error).toBeDefined();
            expect(error?.message).toContain(expectedError);
        });
    });

    it('should require the MONGODB_URL field', () => {
        const { error } = schema.validate({});
        expect(error).toBeDefined();
        expect(error?.message).toContain('"MONGODB_URL" is required');
    });
}); 