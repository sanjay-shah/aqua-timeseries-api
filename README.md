# aqua-timeseries-api

## Project setup
```
git clone https://github.com/sanjay-shah/aqua-timeseries-api.git
cd aqua-timeseries-api
npm install
```
### Prereqisite 
Nodejs and mongodb is required to run this application
On Ubuntu mongodb and nodejs can be installed by running the following commands
```
sudo apt update
sudo apt install -y mongodb
sudo apt install nodejs
sudo apt install npm
```
## Verify  mongodb server is running
```
sudo systemctl status mongodb
```
## Verify nodejs and npm installation
```
nodejs -v
npm -v
```

### Run api server
```
node app.js
```

### Run timeseries updater as cron job
```
node cronRiskUpdater.js
```
