# SSSF week 1 exercise. Submit to Oma

This REST API is based on the API done in 2nd year course 'Basic Concepts of Web Applications'/'Web ohjelmoinnin perusteet'

## Getting started

- Clone this repo
- create .env based on .env.example
- `npm i` to install dependencies
- `npm run dev` to start development server
- `npm run test` to run tests

## Assignment

- Your task is to complete all TODOs in the code until all tests are passed

## Create types/interfaces based on these objects:

Cat:

```json
{
  "cat_id": 41,
  "cat_name": "Siiri",
  "weight": 4,
  "filename": "9434b5b5d9222ed366d22ebcc8e5c828",
  "birthdate": "2010-03-04",
  "lat": 60.258116666666666,
  "lng": 24.84575,
  "owner": {
    "user_id": 37,
    "user_name": "Test User"
  }
}
```

User:

```json
{
  "user_id": 37,
  "user_name": "Test User",
  "email": "john@metropolia.fi",
  "role": "user", // or "admin"
  "password": "1234"
}
```

## Database

The tables are updated a little from 2nd year example.

- Role is "admin"/"user" instead of 0/1.
  - When posting user, don't add role
- Coordinates are saved as [POINT](https://mariadb.com/kb/en/geometry-types/#pointpoint) instead of stringified array
- Passwords for both example users is 1234
- _Do not change or delete admin user_

### Run this SQL in your database, make ids auto increment:

```sql
CREATE TABLE `sssf_cat` (
  `cat_id` int(11) NOT NULL,
  `cat_name` text NOT NULL,
  `weight` float NOT NULL,
  `owner` int(11) NOT NULL,
  `filename` text NOT NULL,
  `birthdate` date DEFAULT NULL,
  `coords` point NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

ALTER TABLE `sssf_cat`
  ADD PRIMARY KEY (`cat_id`),
  ADD KEY `owner` (`owner`);

ALTER TABLE `sssf_cat`
  MODIFY `cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
COMMIT;

INSERT INTO `sssf_cat` (`cat_id`, `cat_name`, `weight`, `owner`, `filename`, `birthdate`, `coords`) VALUES
(41, 'Siiri', 4, 37, 'some_filename', '2010-03-05', 0x00000000010100000064f188f709214e408d976e1283d83840);

CREATE TABLE `sssf_user` (
  `user_id` int(11) NOT NULL,
  `user_name` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `role` text NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

ALTER TABLE `sssf_user`
  ADD PRIMARY KEY (`user_id`);
  
 ALTER TABLE `sssf_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
COMMIT;

INSERT INTO `sssf_user` (`user_id`, `user_name`, `email`, `password`, `role`) VALUES
(1, 'admin', 'admin@metropolia.fi', '$2a$10$5RzpyimIeuzNqW7G8seBiOzBiWBvrSWroDomxMa0HzU6K2ddSgixS', 'admin'),
(37, 'Test User', 'john@metropolia.fi', '$2a$10$5RzpyimIeuzNqW7G8seBiOzBiWBvrSWroDomxMa0HzU6K2ddSgixS', 'user');
```
