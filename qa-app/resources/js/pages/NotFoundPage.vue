<template>
    <div class="container">
        <div class="jumbotron text-center">
            <h1 class="display-4">404 - Page Not Found</h1>
            <p class="lead">Sorry, we couldn't find the page you are looking for.</p>
            <hr class="my-4">
            <router-link :to="{ name: 'home' }" class="btn btn-primary btn-lg">Back to home page</router-link>
        </div>
    </div>
</template>