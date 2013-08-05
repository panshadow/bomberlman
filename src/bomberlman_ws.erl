-module(bomberlman_ws).
-behavior(cowboy_websocket_handler).

-export([init/3,
    websocket_init/3,
    websocket_handle/3,
    websocket_info/3,
    websocket_terminate/3]).

init({_TransportName, _Protocol}, _Req, _Opts) ->
  {upgrade, protocol, cowboy_websocket}.


websocket_init(_TransportName, Req, _Opts) ->
  {ok, Req, undefined, hibernate}.

websocket_handle({text, Data}, Req, State) ->
  io:format("> ~p\n",[Data]),
  { reply, {text, <<"PONG: ",Data/binary>>}, Req, State, hibernate };


websocket_handle(_Any, Req, State) ->
  {ok, Req, State}.

websocket_info(_Info, Req, State) ->
  {ok, Req, State, hibernate}.

websocket_terminate(_Reason, _Req, _State) ->
  ok.

