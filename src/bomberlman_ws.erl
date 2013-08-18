-module(bomberlman_ws).
-behavior(cowboy_websocket_handler).

-record(wss, {ticks=0,ip={},port=0}).

-define(GLOBAL, bomberlman_arena).

-export([init/3,
    websocket_init/3,
    websocket_handle/3,
    websocket_info/3,
    websocket_terminate/3]).

init({_TransportName, _Protocol}, _Req, _Opts) ->
  {upgrade, protocol, cowboy_websocket}.



wsmsg(new, Type) -> wsmsg(new, Type, []);
wsmsg(type, {[{<<"type">>, Type},{<<"data">>, _}]}) -> Type;
wsmsg(data, {[{<<"type">>, _},{<<"data">>, Data}]}) -> Data.

wsmsg(new, Type, Data) ->
  {[{type, Type},{data, {Data}} ]}.


websocket_init(_TransportName, Req, _Opts) ->
  gproc:reg({p,l,?GLOBAL}),
  {{Host, Port},_} = cowboy_req:peer(Req),
  gproc:send({p,l,?GLOBAL},{notify_all,self(),new_connection}),
  {ok, Req, #wss{ticks=0,port=Port, ip=tuple_to_list(Host)}, hibernate}.


websocket_handle({text, JSON}, Req, State) ->
  Msg = jiffy:decode(JSON),
  Type = wsmsg(type, Msg),
  case  Type of
    <<"PING">> -> ping_pong(Req, State);
    _ -> reply(wsmsg(new, <<"UNKNOWN">>),Req, State)
  end;


websocket_handle(_Any, Req, State) ->
  io:format("any>\n"),
  {ok, Req, State}.

websocket_info({notify, Msg}, Req, State) ->
  reply(Msg, Req, State);


websocket_info({notify_all, Pid, new_connection}, Req, State) ->
  Self = self(),
  Local = (Self==Pid),
  new_player(Local, Req, State);


websocket_info(_Info, Req, State) ->
  io:format("info>\n"),
  {ok, Req, State, hibernate}.

websocket_terminate(_Reason, _Req, _State) ->
  ok.


% ----
next_tick(State) -> State#wss{ticks=State#wss.ticks+1}.

reply(Msg, Req, State) ->
  io:format("R>[~p]~n",[Msg]),
  {reply, {text, jiffy:encode(Msg)}, Req, next_tick(State), hibernate}.

ping_pong(Req, State) ->
  Msg = wsmsg(new, <<"PONG">>,[{ticks, State#wss.ticks}]),
  reply(Msg, Req, State).

new_player(Local, Req, State) ->
  Msg = wsmsg(new, 'NEW_PLAYER',[
      {local, Local},
      {host, State#wss.ip},
      {port, State#wss.port}
    ]),
  reply(Msg, Req, State).