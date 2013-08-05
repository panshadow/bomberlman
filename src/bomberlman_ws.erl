-module(bomberlman_ws).
-behavior(cowboy_websocket_handler).

-record(wss, {count=0}).

-export([init/3,
    websocket_init/3,
    websocket_handle/3,
    websocket_info/3,
    websocket_terminate/3]).

init({_TransportName, _Protocol}, _Req, _Opts) ->
  {upgrade, protocol, cowboy_websocket}.


websocket_init(_TransportName, Req, _Opts) ->
  io:format("init>\n"),
  {ok, Req, #wss{count=0}, hibernate}.

websocket_handle({text, Data}, Req, State) ->
  io:format("msg> ~p\n",[Data]),
  io:format("state> ~p\n",[State]),
  { reply, {text, <<"PONG: ",Data/binary>>}, Req, State#wss{count=State#wss.count+1}, hibernate };


websocket_handle(_Any, Req, State) ->
  io:format("any>\n"),
  {ok, Req, State}.

websocket_info(_Info, Req, State) ->
  io:format("info>\n"),
  {ok, Req, State, hibernate}.

websocket_terminate(_Reason, _Req, _State) ->
  ok.

