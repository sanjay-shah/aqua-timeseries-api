const axios = require('axios')

const login = {
  id: 'administrator',
  password: 'NzgxYzll'
}
let auth = {}
async function cron()  {
    console.log('attempting to fetch access token...')
    auth = await axios.post(
    	'https://testdrive656.aquasec.com/api/v1/login', 
    	login
    )
console.log('fetched access token.')
console.log('attempting to fetch images...')
const response = 
	await axios.get('https://testdrive656.aquasec.com/api/v2/images?page=1&include_totals=true&order_by=name&page_size=1000', { 
		headers: { Authorization: "Bearer " + auth.data.token } 
  })
console.log('fetched images.')

const tsResponse = 
	await axios.post(
        	'http://localhost:3000/risks',
        	response.data.result
    	)
}
cron()
