#!/usr/bin/env perl
use Mojolicious::Lite;

get '/' => sub { shift->redirect_to('index.html') };

get '/greet' => { json => { msg => 'hello, world' } };

app->start;
