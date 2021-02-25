<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

## QA-APP: A StackOverflow clone

This is a project which I'm trying to create a similar website to StackOverflow using Laravel+Vuejs.

## How to setup this project in your environment:
First start a Laravel's project:
```
composer create-project laravel/laravel qa-app
```
Then intall Vuejs scaffolding with composer
```
composer require laravel/ui
php artisan ui vue --auth
```
Now npm:
```
npm install
npm run dev
```
After installing the base project, you can overwrite the files in your folder with the ones in this repo.

This project uses MySQL, so you can just download XAMPP and configure the .env file to your database settings.

Since there are already Factory and Seeder configured, you can run the following command to populate your database:
```
php artisan migrate:fresh --seed
```
