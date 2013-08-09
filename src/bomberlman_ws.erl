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


wsmsg(Type,Data) ->
  {[{type, Type},{data, Data}]}.

websocket_init(_TransportName, Req, _Opts) ->
  {{RemoteHost,RemotePort},_} = cowboy_req:peer(Req),
  Msg = wsmsg(<<"NOTIFY">>,{[
      {<<"host">>, tuple_to_list(RemoteHost)}, 
      {<<"port">>, RemotePort}
    ]}
  ),
  gproc:reg({p,l,bomberlman_arena}),
  gproc:send({p,l,bomberlman_arena},{notify, jiffy:encode(Msg)}),
  {ok, Req, #wss{count=0}, hibernate}.


websocket_handle({text, JSON}, Req, State) ->
  {[{<<"type">>,Type},{<<"data">>,_Data}]} = jiffy:decode(JSON),
  Resp = case Type of
    <<"PING">> -> wsmsg(<<"PONG">>,{[]});
    _ -> wsmsg(<<"UNKNOWN">>,{[]})
  end,
  {reply, {text, jiffy:encode(Resp)}, Req, State#wss{count=State#wss.count+1}, hibernate };


websocket_handle(_Any, Req, State) ->
  io:format("any>\n"),
  {ok, Req, State}.

websocket_info({notify, Msg}, Req, State) ->
  io:format("notify> ~p",[Msg]),
  {reply, {text, Msg}, Req, State#wss{count=State#wss.count+1}, hibernate };

websocket_info(_Info, Req, State) ->
  io:format("info>\n"),
  {ok, Req, State, hibernate}.

websocket_terminate(_Reason, _Req, _State) ->
  ok.

