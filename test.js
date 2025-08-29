// test.js - Test script to verify API functionality
const axios = require('axios');

// Base URL for the API
// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://bajaj-se52.onrender.com';


// Test cases from the document
const testCases = [
    {
        name: "Example A",
        input: {
            data: ["a", "1", "334", "4", "R", "$"]
        },
        expected: {
            odd_numbers: ["1"],
            even_numbers: ["334", "4"],
            alphabets: ["A", "R"],
            special_characters: ["$"],
            sum: "339",
            concat_string: "Ra"
        }
    },
    {
        name: "Example B",
        input: {
            data: ["2", "a", "y", "4", "&", "-", "*", "5", "92", "b"]
        },
        expected: {
            odd_numbers: ["5"],
            even_numbers: ["2", "4", "92"],
            alphabets: ["A", "Y", "B"],
            special_characters: ["&", "-", "*"],
            sum: "103",
            concat_string: "ByA"
        }
    },
    {
        name: "Example C",
        input: {
            data: ["A", "ABcD", "DOE"]
        },
        expected: {
            odd_numbers: [],
            even_numbers: [],
            alphabets: ["A", "ABCD", "DOE"],
            special_characters: [],
            sum: "0",
            concat_string: "EoDdCbAa"
        }
    }
];

async function makeRequest(data) {
    try {
        const response = await axios.post(`${BASE_URL}/bfhl`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with error status
            throw new Error(`Server error: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
            // Request was made but no response
            throw new Error('No response from server. Make sure the server is running on port 3000');
        } else {
            // Error in setting up the request
            throw new Error(`Request error: ${error.message}`);
        }
    }
}

async function runTests() {
    console.log('🧪 Running API Tests...\n');
    console.log('Make sure the server is running on port 3000\n');
    console.log('=' .repeat(50));
    
    for (const testCase of testCases) {
        console.log(`\n📝 Testing: ${testCase.name}`);
        console.log('Input:', JSON.stringify(testCase.input.data));
        
        try {
            const response = await makeRequest(testCase.input);
            
            // Check each expected field
            let allPassed = true;
            for (const [key, expectedValue] of Object.entries(testCase.expected)) {
                const actualValue = response[key];
                const passed = JSON.stringify(actualValue) === JSON.stringify(expectedValue);
                
                if (!passed) {
                    console.log(`❌ ${key}: Expected ${JSON.stringify(expectedValue)}, Got ${JSON.stringify(actualValue)}`);
                    allPassed = false;
                } else {
                    console.log(`✅ ${key}: ${JSON.stringify(actualValue)}`);
                }
            }
            
            // Also check for required fields
            const requiredFields = ['is_success', 'user_id', 'email', 'roll_number'];
            for (const field of requiredFields) {
                if (response[field] === undefined) {
                    console.log(`⚠️  Missing required field: ${field}`);
                    allPassed = false;
                } else if (field === 'is_success' && response[field] !== true) {
                    console.log(`⚠️  is_success should be true`);
                    allPassed = false;
                }
            }
            
            if (allPassed) {
                console.log(`\n✨ ${testCase.name} PASSED!`);
            } else {
                console.log(`\n⚠️  ${testCase.name} has some issues`);
            }
            
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        
        console.log('-'.repeat(50));
    }
    
    // Additional test for error handling
    console.log('\n📝 Testing: Error Handling (Invalid Input)');
    try {
        const response = await makeRequest({ invalid: "data" });
        if (response.is_success === false) {
            console.log('✅ Error handling works correctly');
        } else {
            console.log('⚠️  API should return is_success: false for invalid input');
        }
    } catch (error) {
        console.log('✅ API correctly rejects invalid input');
    }
}

// Check if axios is installed
try {
    require.resolve('axios');
    // Run tests
    runTests().catch(console.error);
} catch(e) {
    console.log('⚠️  Axios is not installed. Please run: npm install axios');
    console.log('Then run this test script again.');
}