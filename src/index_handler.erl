-module(index_handler).
-behaviour(cowboy_http_handler).

-export([init/3, handle/2, terminate/3]).

init({tcp, http}, Req, _Opts) ->
  {ok, Req, undefined_state}.

handle(Req, State) ->
  Body = <<"<html><head><style>@import url(/static/styles.css);</style><script src=\"/static/js/script.js\"></script><body><h1>in:side</h1></body></html>">>,
  {ok, Resp} = cowboy_req:reply(200, [], Body, Req),
  {ok, Resp, State}.

terminate(_Reason, _Req, _State) ->
  ok.