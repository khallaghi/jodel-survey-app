# jodel-survey-app v0.0.0



- [Survey](#survey)
	- [Answer to a specific survey](#answer-to-a-specific-survey)
	- [Create a new survey](#create-a-new-survey)
	- [Delete a specific survey](#delete-a-specific-survey)
	- [Retrieve a specific survey](#retrieve-a-specific-survey)
	- [Retrieve surveys of user](#retrieve-surveys-of-user)
	
- [User](#user)
	- [Create new user](#create-new-user)
	- [Signin user and get jwt token](#signin-user-and-get-jwt-token)
	


# Survey

## Answer to a specific survey



	POST /survey/:id/answer


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| id			| string			|  <p>survey id in UUID format</p>							|

### Success Response

(200) Success Response:

```
HTTP/1.1 200 OK
{
	"message": "Your choice with local Id: 1 to survey with Id: 667be815-0327-45ce-8da5-2454a8905d2b has been added."
}
```
### Error Response

Error Response

```
{
	"message": [
		"Error: Survey not found"
	]
}
```
## Create a new survey



	POST /v1/survey

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| x-access-token			| string			|  							|

### Success Response

(200) Success Response:

```
HTTP/1.1 200 OK
{
	"message": "Survey with id: 85e68db7-68d0-474f-90ce-bcc10400d195 has been successfully created",
	"surveyId": "85e68db7-68d0-474f-90ce-bcc10400d195"
}
```
### Error Response

Error Response

```
{
	"message": [
		"must have required property 'question'"
	]
}
```
## Delete a specific survey



	DELETE /survey/:id

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| x-access-token			| string			|  							|

### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| id			| string			|  <p>Survey id in UUID format</p>							|

### Success Response

(200) Success Response:

```
HTTP/1.1 200 OK
{
	"message": "Survey with Id: 1d33ddcb-026a-4198-93b1-4fabce83ba21 has been successfully deleted"
}
```
### Error Response

Error Response

```
{
	"message": [
		"Error: Survey not found"
	]
}
```
## Retrieve a specific survey



	GET /survey/:id?withResult=true


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| id			| string			|  <p>Survey id in UUID format</p>							|
| withResult			| string			|  <p>Select that show the results or not (<code>true</code>|<code>false</code>)</p>							|

### Success Response

(200) withResult=true:

```
HTTP/1.1 200 OK
{
	"id": "c9c444e1-f163-45aa-890f-4c47f4961df4",
	"question": "How are you today?",
	"createdAt": "2022-12-20T22:04:50.897Z",
	"choices": [
		{
			"localId": 0,
			"text": "Very good.",
		  "selectedCount": 0
		},
		{
			"localId": 1,
			"text": "Not bad.",
		  "selectedCount": 2
		},
		{
			"localId": 2,
			"text": "Very very bad.",
		  "selectedCount": 6
		}
	],
	"user": {
		"username": "mohammad"
	}
}
```
(200) withResult=false:

```
HTTP/1.1 200 OK
{
	"id": "c9c444e1-f163-45aa-890f-4c47f4961df4",
	"question": "How are you today?",
	"createdAt": "2022-12-20T22:04:50.897Z",
	"choices": [
		{
			"localId": 0,
			"text": "Very good."
		},
		{
			"localId": 1,
			"text": "Not bad."
		},
		{
			"localId": 2,
			"text": "Very very bad."
		}
	],
	"user": {
		"username": "mohammad"
	}
}
```
### Error Response

Error Response

```
{
	"message": [
		"Error: Survey not found"
	]
}
```
## Retrieve surveys of user



	GET /survey?withResult=true&amp;limit=3&amp;after=cursor&amp;before=cursor

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| x-access-token			| string			|  							|

### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| withResult			| string			|  <p>Select that show the results or not (<code>true</code>|<code>false</code>)</p>							|
| limit			| Number			|  <p>The list size of surveys</p>							|
| after			| string			|  <p>Show <code>limit</code> amount of surveys after a specific cursor</p>							|
| before			| string			|  <p>Show <code>limit</code> amount of surveys before a specific cursor</p>							|

### Success Response

(200) Success Response

```
{
	"totalCount": 7,
	"edges": [
		{
			"node": {
				"id": "ae1f09f7-784c-4f8b-88cc-81b8a9540e4f",
				"question": "How are you today?",
				"createdAt": "2022-12-20T22:21:46.294Z",
				"choices": [
					{
						"localId": 0,
						"text": "Very good.",
						"selectedCount": 0
					},
					{
						"localId": 1,
						"text": "Not bad.",
						"selectedCount": 0
					},
					{
						"localId": 2,
						"text": "Very very bad.",
						"selectedCount": 0
					}
				],
				"user": {
					"username": "mohammad5"
				}
			},
			"cursor": "WyIyMDIyLTEyLTIwVDIyOjIxOjQ2LjI5NFoiLCJhZTFmMDlmNy03ODRjLTRmOGItODhjYy04MWI4YTk1NDBlNGYiXQ=="
		}
	],
	"pageInfo": {
		"hasNextPage": true,
		"hasPreviousPage": true,
		"startCursor": "WyIyMDIyLTEyLTIwVDIyOjIxOjQ2LjI5NFoiLCJhZTFmMDlmNy03ODRjLTRmOGItODhjYy04MWI4YTk1NDBlNGYiXQ==",
		"endCursor": "WyIyMDIyLTEyLTIwVDIyOjIxOjQ2LjI5NFoiLCJhZTFmMDlmNy03ODRjLTRmOGItODhjYy04MWI4YTk1NDBlNGYiXQ=="
	}
}
```
### Error Response

(404 Not Found) Error Response

```
{
	"message": [
		"Error: Survey not found"
	]
}
```
(400 Bad Request) Error Response

```
{
	"message": [
		"Invalid limit size"
	],
```
# User

## Create new user



	POST /user


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| username			| string			|  							|
| password			| string			|  							|

### Success Response

(200) Success Response:

```
{
	"message": "User mohammad has been successfully created.",
	"userId": "efb0722a-1f45-4e39-9e42-c2641a90c1a3"
}
```
### Error Response

Error Response

```
{
	"message": [
		"Error: User not found"
	]
}
```
## Signin user and get jwt token



	POST /user/login


### Success Response

(200) Success Response:

```
HTTP/1.1 200 OK
{
	"id": "9186f029-e95c-452e-9afd-da21b1400014",
	"username": "mohammad",
	"accessToken": "eyJhbGciOiJIUzI1NiIsInR5iMTQwMDAxNCIsImlhdCI6McZXhwIjoxNjcxNjU4NjM2fQ.g3qmOFpJpUGMfyW-g_Fuve0MxXBTZRZvgIuQNc_xxJk"
}
```
### Error Response

Error Response

```
{
	"message": [
		"Error: User not found"
	]
}
```

