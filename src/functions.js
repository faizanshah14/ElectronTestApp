const path = require('path')

module.exports = 
{
    req: async (req, res) => {
        switch(req.reqType)
        {
            case 'request':
                return await testFunction(req, res);
            case 'error':
                return await testError(req, res);
            case 'changeView':
                return await changeView(req, res)
            default:
                return res.error.push('Invalid request type');
        }
    }
}

function testFunction(req, res)
{
    var testVal = req.body.testVal;
    testVal += ' edited';
    res.body.newVal = testVal;
    return res;
}

function testError(req, res)
{
    var testVal = req.body.testVal;
    testVal += ' edited';
    res.body.newVal = testVal;
    res.error = 'invalid test format';
    return res;
}

function changeView(req, res)
{
    var view = req.body.view;
    mainWindow.loadFile(path.join(__dirname, `/view/html/${view}.html`));
    return res;
}

