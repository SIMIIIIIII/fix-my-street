const validator = require('validator');
const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({
  provider: 'openstreetmap'
});

const checkuserInput = {

    isValidUsername : function(input) {
        if(input.length < 6){
            return false;
        }
        if (input.split(" ").length > 1){
            return false;
        }
        return true;
    },

    isValidPassword : function(input) {
        return validator.isStrongPassword(input, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        });
    },

    isValidEmail : function(input) {
        return validator.isEmail(input);
    },

    isAdressValid: async (input) => {
        try {
            const cleanInput = input.trim();
            const res = await geocoder.geocode(cleanInput);
            
            if (res.length > 0) {
                const location = res[0];
                
                /**
                 * const allowedZipcodes = ['Belgique', 'Belgium', 'België', 'Belgien'];
                if (!allowedZipcodes.includes(location.country)) {
                    console.log('Address rejected: zipcode is', location.country);
                    return {
                        valid: false,
                        formattedAddress: null
                    };
                }
                 */

                const street = location.streetName || '';
                const number = location.streetNumber || '';
                const zipcode = location.zipcode || '';
                const city = location.city || '';
                
                const formattedAddress = `${street} ${number}, ${zipcode} ${city}`.trim();
                
                return {
                    valid: true,
                    formattedAddress: formattedAddress
                };
            }
            return {
                valid: false,
                formattedAddress: null
            };
        } catch (error) {
            console.error('Geocoder error:', error);
            return {
                valid: false,
                formattedAddress: null
            };
        }
    }
}

module.exports = {
    checkUserInput: checkuserInput
}