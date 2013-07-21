-module(index_handler).
-behaviour(cowboy_http_handler).

-export([init/3, handle/2, terminate/3]).

init({tcp, http}, Req, _Opts) ->
  {ok, Req, undefined_state}.

handle(Req, State) ->
  Body = <<"<h1>in:side</h1>">>,
  {ok, Resp} = cowboy_req:reply(200, [], Body, Req),
  {ok, Resp, State}.

terminate(_Reason, _Req, _State) ->
  ok.