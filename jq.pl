#!/usr/bin/env perl
use Mojolicious::Lite;

get '/' => 'main';

get '/greet' => { json => { msg => 'hello, world' } };

app->start;
