"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailcredentials_1 = require("./logic/email/emailcredentials");
/**
 * Anything that shouldn't be uploaded to GitHub should
 * be kept in this file to prevent any potential security
 * holes from occuring.
 */
class Secret {
}
/**
 * The key used to generate Json web
 * tokens for authentication.
 */
Secret.TOKEN_SECRET_KEY = `MIIBPAIBAAJBAM6DrXEzXQCPPu+pCTsvtQ2UHY4NN3UHPorgE7xjT1+HdB4MnXKQ
    5DdNv5cGA5Ds2WDGHXn/8im1dZObVUcW83sCAwEAAQJBAMimcBKY0TgF9iRtnKaB
    B+0ViFHIzaVLUJ0mcoaMB0bMWFrAtJKQpt6fu3zkTKl0HQZ7efSSP1y56Nl8vDV7
    1CECIQD8v6jASrB36Uy4I41fNuflUM2mJq+I+D1UpFZOnh/DxQIhANErwvS76s5O
    yBOKsZR9AmcM1SpoaX+I0YC3zGiaXQ4/AiEAg5MuwTPgm/vqwW1YmjmWDQ28kQNQ
    nChGnTqT54dvl9UCIQCncyIabAmYaWcwhbqNxdnTh2lrDrVOPMiDBCDmqJTQXwIg
    Glf7Xd/esxUUzw+tmWJv3YFXbbISIe81S++wZTslIzo=`;
Secret.EMAIL_CREDENTIALS = new emailcredentials_1.EmailCredentials("admin@nomansblocks.com", "$ChipSkylark1");
exports.Secret = Secret;

//# sourceMappingURL=secret.js.map
