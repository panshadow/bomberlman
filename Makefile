all: deps compile

deps: rebar.config
	rebar get-deps

compile: ebin/bomberlman.app
	rebar compile

run: all
	erl -pa ebin/ deps/*/ebin -s bomberlman
