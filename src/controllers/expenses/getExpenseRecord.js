const { executeQuery } = require("../../utils/dbConfig.js");
const { send_response, error_response } = require("../../utils/response.js");
const mysql = require("mysql2");
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');

const _fetchExpenseByCategory = () => `        
    SELECT 
        COUNT(id) as expenseCount
    FROM
        expenses 
    WHERE
        user_id = ?;
`;

const getExpenseRecord = async (req, res) => {
    const { id } = req.decoded;

    const query = mysql.format(_fetchExpenseByCategory(), [id]);

    const resultArr = await executeQuery(query);

    if(resultArr instanceof Error) {
        res.status(400);
        throw new Error(resultArr);
    }

    if(!(resultArr.length)) {
        res.status(404);
        throw new Error('Not authorized.');  
    }

    const expenseCount = resultArr[0].expenseCount ;

    // Render EJS template
    const html = await ejs.renderFile(path.resolve(__dirname, 'pdfTemplate.ejs'), { expenseCount });

    // Launch a headless browser
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();

    // Set content and render PDF
    await page.setContent(html);
    const pdf = await page.pdf();

    // Close browser
    await browser.close();

    // Send PDF as response to Postman
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="expenses.pdf"');
    res.status(200).send(pdf);

};

module.exports = { getExpenseRecord };