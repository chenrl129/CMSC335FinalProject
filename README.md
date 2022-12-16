# CMSC335 Final Project

**Team Members**: Robert Chen, Jonah Leung, James Wang

**App Description**: We are developing an AI tool to assist users in constructing and detailing text messages they want to send. We are targeting this app toward busy users who need to send detailed texts while under time constraints or when they simply need a break from thinking!
This web application is created for the use case of accessible, customizable, and reliable text message suggestions for users through utilizing the Generative Pre-trained Transformer 3 (GPT3) autoregressive language model developed by OpenAI. 

# Getting started

1. Set up a MongoDB database and user with read/write access. More info at https://www.mongodb.com/docs/manual/
2. Get an OpenAI API key from https://beta.openai.com/account/api-keys
3. `npm install`
4. Create .env file following .envexample with MongoDB and OpenAI info
5. `npm start` or `node ./server.js [port]`

## For CMSC335 grading purposes
We have provided a .env file with a MongoDB database.
Please replace "REPLACE_WITH_API_KEY" in .env with the following key split up into the two lines below:  
sk-G1zlgEwSSy0hZE4n1vayT3  
BlbkFJf09r8BGOR2HpthXhRSlR


#

GPT3 API:
https://openai.com/api/

Documentation:
https://beta.openai.com/docs/introduction

Pages: 
1) Main page to navigate to input and history pages
2) Input for user to input text they want to be completed by openai
3) Output page for input
4) History page to view past prompts and suggestions

