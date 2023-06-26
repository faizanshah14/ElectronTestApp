const displayResponse = document.getElementById('display-response');

async function makeRequest()
{
    var res = await window.api.req(
    {
        reqType: 'request', 
        body: 
        {
            testVal: 'dataVal'
        }
    });

    if(res.error != null) return displayResponse.innerHTML = res.error;
    console.log(res)
    displayResponse.innerHTML = JSON.stringify(res, null, 2);
}

async function requestError()
{
    var res = await window.api.req(
    {
        reqType: 'error', 
        body: 
        {
            testVal: 'dataVal'
        }
    });

    if(res.error != null) return displayResponse.innerHTML = res.error;

    displayResponse.innerHTML = JSON.stringify(res, null, 2);
}

async function changeView(view)
{
    var res = await window.api.req(
    {
        reqType: 'changeView',
        body: 
        {
            view: view
        }
    });
    if(res.error != null) return res.error;
    
}
