const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function isNumber(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

function isAlphabet(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function isSpecialCharacter(str) {
    return !isNumber(str) && !isAlphabet(str);
}

function createAlternatingCaps(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        if (i % 2 === 0) {
            result += str[i].toUpperCase();
        } else {
            result += str[i].toLowerCase();
        }
    }
    return result;
}

app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input. 'data' must be an array."
            });
        }

        const oddNumbers = [];
        const evenNumbers = [];
        const alphabets = [];
        const specialCharacters = [];
        let sum = 0;
        let allAlphabets = '';

        data.forEach(item => {
            const itemStr = String(item);
            
            if (isNumber(itemStr)) {
                const num = parseInt(itemStr);
                if (num % 2 === 0) {
                    evenNumbers.push(itemStr);
                } else {
                    oddNumbers.push(itemStr);
                }
                sum += num;
            } else if (isAlphabet(itemStr)) {
                alphabets.push(itemStr.toUpperCase());
                allAlphabets += itemStr;
            } else {
                specialCharacters.push(itemStr);
            }
        });

        const reversedAlphabets = allAlphabets.split('').reverse().join('');
        const concatString = createAlternatingCaps(reversedAlphabets);

        const user_id = "john_doe_17091999";
        const email = "john.doe@vitstudent.ac.in";
        const roll_number = "21BCE0001";

        const response = {
            is_success: true,
            user_id: user_id,
            email: email,
            roll_number: roll_number,
            odd_numbers: oddNumbers,
            even_numbers: evenNumbers,
            alphabets: alphabets,
            special_characters: specialCharacters,
            sum: String(sum),
            concat_string: concatString
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        message: "VIT Full Stack API is running!",
        endpoint: "/bfhl (POST)",
        status: "active"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/bfhl`);
});